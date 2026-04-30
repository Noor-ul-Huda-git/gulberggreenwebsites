import re
import secrets
import uuid

from django.core.files.storage import default_storage
from django.db import models
from django.utils import timezone
from django.utils.text import slugify
from django_ckeditor_5.fields import CKEditor5Field

from common.image_webp import optimize_upload_to_webp, safe_upload_stem

# Same pattern as Property.slug: `{base}-{010d}` (10-digit suffix, never at the start).
_SLUG_SERIAL_SUFFIX = re.compile(r'-\d{10}$')


def _news_base_slug(slug, title, *, max_base_len=289):
    """Slug body only (no 10-digit suffix); strip legacy `123-` prefix, DB temp slug, or old serial."""
    raw = (slug or '').strip()
    if re.match(r'^news-pending-[a-f0-9]{12}$', raw):
        raw = ''
    else:
        raw = re.sub(r'^\d+-', '', raw)
        raw = _SLUG_SERIAL_SUFFIX.sub('', raw)
    if not raw:
        raw = slugify(title) or 'news'
    body = slugify(raw) or slugify(title) or 'news'
    return body[:max_base_len].rstrip('-') or 'news'


def _slug_has_trailing_serial(value):
    return bool(value and _SLUG_SERIAL_SUFFIX.search(str(value).strip()))


class NewsPost(models.Model):
    title = models.CharField(max_length=280)
    slug = models.SlugField(max_length=300, unique=True, blank=True)
    description = CKEditor5Field(
        'Description',
        config_name='default',
        help_text='Full article: use the toolbar for bold, headings, lists, and links. This HTML is shown on the website.',
    )
    author_name = models.CharField(max_length=120)
    published_at = models.DateTimeField(
        db_index=True,
        blank=True,
        help_text='Leave blank to use the date and time when the article is saved.',
    )
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-published_at']
        verbose_name = 'News article'
        verbose_name_plural = 'News articles'

    def __str__(self):
        return self.title

    def _build_serialized_slug(self):
        base = _news_base_slug(self.slug, self.title)
        while True:
            serial = f'{secrets.randbelow(10**10):010d}'
            candidate = f'{base}-{serial}'
            if not NewsPost.objects.exclude(pk=self.pk).filter(slug=candidate).exists():
                return candidate

    def save(self, *args, **kwargs):
        if self.published_at is None:
            self.published_at = timezone.now()

        if _slug_has_trailing_serial(self.slug):
            return super().save(*args, **kwargs)

        # First insert: unique placeholder (same idea as Property) so two drafts never share the same slug.
        if self.pk is None:
            self.slug = f'news-pending-{uuid.uuid4().hex[:12]}'
        elif not self.slug or not str(self.slug).strip():
            self.slug = slugify(self.title) or f'news-{uuid.uuid4().hex[:12]}'

        super().save(*args, **kwargs)

        self.slug = self._build_serialized_slug()
        return super().save(update_fields=['slug'])


class NewsImage(models.Model):
    post = models.ForeignKey(
        NewsPost,
        related_name='images',
        on_delete=models.CASCADE,
        help_text='One post can have many images; order with Sort order (lower first).',
    )
    image = models.ImageField(upload_to='news/%Y/%m/')
    sort_order = models.PositiveIntegerField(
        default=0,
        help_text='0 = first in gallery; use 1, 2, 3… to sequence multiple images.',
    )
    alt_text = models.CharField(max_length=255, blank=True)

    class Meta:
        ordering = ['sort_order', 'id']
        verbose_name = 'Article image'
        verbose_name_plural = 'Article images'

    def __str__(self):
        return f'{self.post.title} — image {self.id}'

    def save(self, *args, **kwargs):
        old_name = None
        if self.pk:
            prev = NewsImage.objects.filter(pk=self.pk).only('image').first()
            if prev and prev.image:
                old_name = prev.image.name

        if self.image:
            cur = self.image.name
            if old_name is None or cur != old_name:
                optimized = optimize_upload_to_webp(self.image)
                if optimized:
                    stem = safe_upload_stem(cur)
                    self.image.save(f'{stem}.webp', optimized, save=False)

        super().save(*args, **kwargs)

        if old_name and self.image and old_name != self.image.name:
            if default_storage.exists(old_name):
                default_storage.delete(old_name)
