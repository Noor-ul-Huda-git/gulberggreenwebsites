from django.contrib import admin

from .models import Property, PropertyImage


class PropertyImageInline(admin.TabularInline):
    model = PropertyImage
    extra = 1
    ordering = ('sort_order', 'id')


@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display = (
        'title',
        'listing_type',
        'block',
        'area_marlas',
        'price',
        'bedrooms',
        'baths',
        'is_featured',
        'is_published',
        'updated_at',
    )
    list_filter = ('listing_type', 'block', 'is_featured', 'is_published')
    search_fields = ('title', 'slug', 'location', 'block', 'short_description')
    list_editable = ('is_featured', 'is_published')
    prepopulated_fields = {'slug': ('title',)}
    ordering = ('-is_featured', '-updated_at')
    inlines = (PropertyImageInline,)
    fieldsets = (
        (None, {'fields': ('title', 'slug', 'listing_type', 'is_featured', 'is_published')}),
        ('Location & size', {'fields': ('block', 'area_marlas', 'location')}),
        ('Pricing', {'fields': ('price',)}),
        ('Details', {'fields': ('bedrooms', 'baths', 'short_description', 'description')}),
        ('Cover image', {'fields': ('featured_image',)}),
    )


@admin.register(PropertyImage)
class PropertyImageAdmin(admin.ModelAdmin):
    list_display = ('property_listing', 'sort_order', 'image')
    list_filter = ('property_listing__listing_type',)
    search_fields = ('property_listing__title',)
    ordering = ('property_listing', 'sort_order', 'id')
