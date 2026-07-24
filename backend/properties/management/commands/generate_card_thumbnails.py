"""Generate .card.webp thumbnails (~320px) for mobile property listing cards."""

from __future__ import annotations

from pathlib import Path

from django.core.management.base import BaseCommand
from PIL import Image, ImageOps

from properties.models import Property, PropertyImage

CARD_MAX_EDGE = 320
CARD_QUALITY = 68


def _card_path(image_path: Path) -> Path:
    return image_path.with_name(f'{image_path.stem}.card{image_path.suffix}')


def _write_card(source: Path, dest: Path) -> bool:
    if not source.is_file():
        return False
    try:
        img = Image.open(source)
        img.load()
        img = ImageOps.exif_transpose(img)
    except OSError:
        return False

    if getattr(img, 'is_animated', False):
        return False

    if img.mode in ('RGBA', 'LA', 'P'):
        img = img.convert('RGB')
    elif img.mode != 'RGB':
        img = img.convert('RGB')

    w, h = img.size
    if max(w, h) > CARD_MAX_EDGE:
        if w >= h:
            nw, nh = CARD_MAX_EDGE, max(1, int(round(h * CARD_MAX_EDGE / w)))
        else:
            nh, nw = CARD_MAX_EDGE, max(1, int(round(w * CARD_MAX_EDGE / h)))
        try:
            resample = Image.Resampling.LANCZOS
        except AttributeError:
            resample = Image.LANCZOS
        img = img.resize((nw, nh), resample)

    dest.parent.mkdir(parents=True, exist_ok=True)
    img.save(dest, format='WEBP', quality=CARD_QUALITY, method=6)
    return True


class Command(BaseCommand):
    help = 'Create .card.webp thumbnails for property featured + gallery images (listing cards).'

    def add_arguments(self, parser):
        parser.add_argument('--force', action='store_true', help='Regenerate even if .card.webp exists.')

    def handle(self, *args, **options):
        force = options['force']
        created = 0
        skipped = 0

        def process_field(file_field):
            nonlocal created, skipped
            if not file_field:
                return
            source = Path(file_field.path)
            dest = _card_path(source)
            if dest.is_file() and not force:
                skipped += 1
                return
            if _write_card(source, dest):
                created += 1
                self.stdout.write(f'  card: {dest.name}')
            else:
                skipped += 1

        for prop in Property.objects.iterator():
            process_field(prop.featured_image)
            for img in PropertyImage.objects.filter(property_listing=prop):
                process_field(img.image)

        self.stdout.write(self.style.SUCCESS(f'Done: {created} created, {skipped} skipped.'))
