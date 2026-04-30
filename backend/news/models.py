from django_ckeditor_5.fields import CKEditor5Field
from django.db import models
from django.utils.text import slugify


class NewsPost(models.Model):
    title = models.CharField(max_length=280)
    slug = models.SlugField(max_length=300, unique=True, blank=True)
    description = CKEditor5Field(
        'Description',
        config_name='default',
        help_text='Full article: use the toolbar for bold, headings, lists, and links. This HTML is shown on the website.',
    )
    author_name = models.CharField(max_length=120)
    published_at = models.DateTimeField(db_index=True)
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-published_at']
        verbose_name = 'News article'
        verbose_name_plural = 'News articles'

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title) or 'news'
            slug = base_slug
            suffix = 1
            while NewsPost.objects.exclude(pk=self.pk).filter(slug=slug).exists():
                suffix += 1
                slug = f'{base_slug}-{suffix}'
            self.slug = slug
        super().save(*args, **kwargs)


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
