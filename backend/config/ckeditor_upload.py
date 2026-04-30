"""
CKEditor 5 image uploads from Django admin.

Endpoint: /api/ckeditor5/image_upload/ (under /api/ so production proxies reach Django).

django_ckeditor_5 calls Pillow's image_verify() before saving; that can leave the
uploaded file pointer at EOF so the follow-up save is empty and the editor shows
"could not upload" even though a broken/empty file may appear in storage.

We reset the file position after verify, then save as WebP (preferred) or optimized JPEG
so pasted/inserted images are always web-friendly, not huge raw PNGs.
"""

from __future__ import annotations

import uuid

from django.conf import settings
from django.http import JsonResponse
from django.utils.translation import gettext_lazy as _
from django.views.decorators.http import require_POST

from django_ckeditor_5.exceptions import NoImageException
from django_ckeditor_5.forms import UploadFileForm
from django_ckeditor_5.permissions import check_upload_permission
from django_ckeditor_5.storage_utils import get_django_storage, handle_uploaded_file, image_verify

from common.image_webp import optimize_upload_for_web


def _safe_seek(upload, pos: int = 0) -> None:
    try:
        upload.seek(pos)
    except (AttributeError, OSError, ValueError):
        pass


def _absolute_url(request, url: str) -> str:
    if not url:
        return url
    if url.startswith(('http://', 'https://')):
        return url
    if url.startswith('/'):
        return request.build_absolute_uri(url)
    return url


@require_POST
@check_upload_permission
def upload_file(request):
    allow_all = getattr(settings, 'CKEDITOR_5_ALLOW_ALL_FILE_TYPES', False)
    upload = request.FILES.get('upload')
    if not upload:
        return JsonResponse({'error': {'message': str(_('No file sent.'))}}, status=400)

    if not allow_all:
        try:
            _safe_seek(upload, 0)
            image_verify(upload)
        except NoImageException as ex:
            return JsonResponse({'error': {'message': str(ex)}}, status=400)
        _safe_seek(upload, 0)

    form = UploadFileForm(request.POST, request.FILES)
    if not form.is_valid():
        errs = form.errors.get('upload')
        if errs:
            return JsonResponse({'error': {'message': errs[0]}}, status=400)
        return JsonResponse({'error': {'message': str(_('Invalid upload.'))}}, status=400)

    up = request.FILES['upload']
    _safe_seek(up, 0)

    if getattr(settings, 'CKEDITOR_5_OPTIMIZE_TO_WEBP', True):
        optimized = optimize_upload_for_web(up)
        _safe_seek(up, 0)
        if optimized is not None:
            fs = get_django_storage()
            folder = f'ckeditor/{uuid.uuid4().hex[:12]}'
            stored_name = fs.save(f'{folder}/{optimized.name}', optimized)
            url = _absolute_url(request, fs.url(stored_name))
            return JsonResponse({'url': url})

    _safe_seek(up, 0)
    url = handle_uploaded_file(up)
    url = _absolute_url(request, url)
    return JsonResponse({'url': url})
