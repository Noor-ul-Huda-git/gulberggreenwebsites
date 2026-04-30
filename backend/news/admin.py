from django import forms
from django.contrib import admin
from django.utils import timezone

from .models import NewsImage, NewsPost


class NewsPostAdminForm(forms.ModelForm):
    class Meta:
        model = NewsPost
        fields = '__all__'

    def clean_published_at(self):
        value = self.cleaned_data.get('published_at')
        if value is None:
            return timezone.now()
        return value


class NewsImageInline(admin.TabularInline):
    """Each row is one image; add as many rows as you need (Gallery)."""

    model = NewsImage
    fk_name = 'post'
    extra = 2
    max_num = 50
    fields = ('image', 'sort_order', 'alt_text')
    ordering = ('sort_order', 'id')
    verbose_name = 'Image'
    verbose_name_plural = 'Gallery images (multiple per post)'


@admin.register(NewsPost)
class NewsPostAdmin(admin.ModelAdmin):
    form = NewsPostAdminForm
    list_display = ('id', 'title', 'slug', 'image_count', 'author_name', 'published_at', 'is_published')
    list_filter = ('is_published', 'published_at')
    search_fields = ('title', 'slug', 'description', 'author_name')
    date_hierarchy = 'published_at'
    readonly_fields = ('slug',)
    inlines = [NewsImageInline]
    ordering = ('-published_at',)
    fieldsets = (
        (None, {'fields': ('title', 'slug')}),
        ('Article', {'fields': ('description',)}),
        ('Meta', {'fields': ('author_name', 'published_at', 'is_published')}),
    )

    class Media:
        js = ('admin/js/news_slug_live_preview.js',)

    def formfield_for_dbfield(self, db_field, request, **kwargs):
        if db_field.name == 'slug':
            kwargs.setdefault(
                'help_text',
                'Stored value (read-only). It is built from the title when you save. A random '
                '<strong>10-digit</strong> suffix is appended after the slug (property-style). '
                'Watch the <strong>live preview</strong> below while you type the title.',
            )
        return super().formfield_for_dbfield(db_field, request, **kwargs)

    @admin.display(description='Images')
    def image_count(self, obj):
        if obj.pk:
            return obj.images.count()
        return '—'
