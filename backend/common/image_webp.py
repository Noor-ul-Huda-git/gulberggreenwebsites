"""Resize and encode raster uploads as WebP for smaller files and faster loads."""

from __future__ import annotations

import logging
import re
from io import BytesIO
from pathlib import Path

from django.conf import settings
from django.core.files.base import ContentFile
from PIL import Image, ImageOps

logger = logging.getLogger(__name__)


def _resample():
    try:
        return Image.Resampling.LANCZOS
    except AttributeError:
        return Image.LANCZOS


def _safe_stem(name: str, fallback: str = 'image') -> str:
    base = Path(name or fallback).stem or fallback
    base = re.sub(r'[^\w\-.]+', '-', base, flags=re.ASCII).strip('-_.') or fallback
    return base[:80]


def safe_upload_stem(name: str, fallback: str = 'image') -> str:
    """Filename stem safe for storage (used for .webp output names)."""
    return _safe_stem(name, fallback)


def _read_upload_bytes(file_field) -> bytes | None:
    try:
        if hasattr(file_field, 'seek'):
            file_field.seek(0)
        raw = file_field.read()
        if hasattr(file_field, 'seek'):
            file_field.seek(0)
    except Exception as exc:
        logger.warning('Could not read image upload: %s', exc)
        return None
    return raw if raw else None


def _prepare_pil_image(raw: bytes):
    """Return a Pillow image ready to encode (RGB or RGBA), or None."""
    try:
        img = Image.open(BytesIO(raw))
        img.load()
    except Exception as exc:
        logger.warning('Unsupported or corrupt image (optimization skipped): %s', exc)
        return None

    try:
        img = ImageOps.exif_transpose(img)
    except Exception:
        pass

    if getattr(img, 'is_animated', False):
        try:
            img.seek(0)
            img = img.copy()
        except Exception:
            return None

    if img.mode in ('RGBA', 'LA'):
        pass
    elif img.mode == 'P':
        if 'transparency' in img.info:
            img = img.convert('RGBA')
        else:
            img = img.convert('RGB')
    elif img.mode != 'RGB':
        img = img.convert('RGB')

    w, h = img.size
    if w < 1 or h < 1:
        return None

    max_edge = getattr(settings, 'IMAGE_WEBP_MAX_EDGE', 2400)
    if max(w, h) > max_edge:
        if w >= h:
            nw, nh = max_edge, max(1, int(round(h * max_edge / w)))
        else:
            nh, nw = max_edge, max(1, int(round(w * max_edge / h)))
        img = img.resize((nw, nh), _resample())

    return img


def optimize_upload_to_webp(file_field) -> ContentFile | None:
    """
    Read an ImageField / UploadedFile, normalize orientation, optionally downscale,
    return WebP bytes as ContentFile. Returns None if the file is not a supported raster image.
    """
    raw = _read_upload_bytes(file_field)
    if not raw:
        return None
    img = _prepare_pil_image(raw)
    if img is None:
        return None

    quality = getattr(settings, 'IMAGE_WEBP_QUALITY', 82)
    buf = BytesIO()
    save_kwargs: dict = {'format': 'WEBP', 'quality': quality, 'method': 6}
    try:
        img.save(buf, **save_kwargs)
    except Exception as exc:
        logger.warning('WebP encode failed: %s', exc)
        return None

    data = buf.getvalue()
    if not data:
        return None

    name = getattr(file_field, 'name', '') or 'image'
    stem = _safe_stem(name)
    return ContentFile(data, name=f'{stem}.webp')


def optimize_upload_to_jpeg(file_field) -> ContentFile | None:
    """Same pipeline as WebP but JPEG (RGB, no transparency) — fallback when WebP fails."""
    raw = _read_upload_bytes(file_field)
    if not raw:
        return None
    img = _prepare_pil_image(raw)
    if img is None:
        return None

    if img.mode in ('RGBA', 'LA'):
        if img.mode == 'LA':
            img = img.convert('RGBA')
        background = Image.new('RGB', img.size, (255, 255, 255))
        background.paste(img, mask=img.split()[3])
        img = background
    elif img.mode != 'RGB':
        img = img.convert('RGB')

    quality = int(getattr(settings, 'IMAGE_JPEG_QUALITY', 85))
    buf = BytesIO()
    try:
        img.save(buf, format='JPEG', quality=quality, optimize=True)
    except Exception as exc:
        logger.warning('JPEG encode failed: %s', exc)
        return None

    data = buf.getvalue()
    if not data:
        return None

    name = getattr(file_field, 'name', '') or 'image'
    stem = _safe_stem(name)
    return ContentFile(data, name=f'{stem}.jpg')


def optimize_upload_for_web(file_field) -> ContentFile | None:
    """
    Prefer WebP; if encoding fails, use progressive JPEG. Avoids storing raw PNG uploads from CKEditor.
    """
    webp = optimize_upload_to_webp(file_field)
    if webp is not None:
        return webp
    if hasattr(file_field, 'seek'):
        try:
            file_field.seek(0)
        except (OSError, ValueError, AttributeError):
            pass
    return optimize_upload_to_jpeg(file_field)
