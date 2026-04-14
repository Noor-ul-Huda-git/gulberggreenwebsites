from django.contrib import admin

from .models import Property


@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display = (
        'title',
        'property_type',
        'category',
        'block',
        'size',
        'price',
        'is_featured',
        'is_published',
        'updated_at',
    )
    list_filter = ('property_type', 'category', 'block', 'is_featured', 'is_published')
    search_fields = ('title', 'slug', 'size', 'location', 'block')
    list_editable = ('is_featured', 'is_published')
    prepopulated_fields = {'slug': ('title',)}
    ordering = ('-is_featured', '-updated_at')
