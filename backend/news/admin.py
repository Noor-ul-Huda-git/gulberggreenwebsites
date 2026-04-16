from django.contrib import admin

from .models import NewsImage, NewsPost


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
    list_display = ('title', 'image_count', 'author_name', 'published_at', 'is_published')
    list_filter = ('is_published', 'published_at')
    search_fields = ('title', 'description', 'author_name')
    prepopulated_fields = {'slug': ('title',)}
    date_hierarchy = 'published_at'
    inlines = [NewsImageInline]
    ordering = ('-published_at',)
    fieldsets = (
        (None, {'fields': ('title', 'slug')}),
        ('Article', {'fields': ('description',)}),
        ('Meta', {'fields': ('author_name', 'published_at', 'is_published')}),
    )

    @admin.display(description='Images')
    def image_count(self, obj):
        if obj.pk:
            return obj.images.count()
        return '—'
