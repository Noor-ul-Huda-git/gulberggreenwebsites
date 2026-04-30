from django.contrib import admin

from .models import Agent, Property, PropertyImage


@admin.register(Agent)
class AgentAdmin(admin.ModelAdmin):
    list_display = ('name', 'phone', 'updated_at')
    search_fields = ('name', 'phone')
    ordering = ('name',)


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
        'area_unit',
        'price',
        'primary_agent',
        'bedrooms',
        'baths',
        'is_featured',
        'is_published',
        'updated_at',
    )
    list_filter = ('listing_type', 'block', 'is_featured', 'is_published')
    search_fields = ('title', 'slug', 'location', 'block', 'plot_number', 'category', 'short_description', 'meta_title', 'seo_h1')
    list_editable = ('is_featured', 'is_published')
    readonly_fields = ('slug',)
    ordering = ('-is_featured', '-updated_at')
    autocomplete_fields = ('primary_agent', 'secondary_agent')
    inlines = (PropertyImageInline,)
    fieldsets = (
        (
            None,
            {
                'fields': ('title', 'slug', 'listing_type', 'purpose', 'is_featured', 'is_published'),
                'description': 'Slug is auto-generated from title and updates live while typing. Serial number is appended on save.',
            },
        ),
        ('Location & size', {'fields': ('block', 'plot_number', 'category', ('area_marlas', 'area_unit'), 'location')}),
        ('Pricing', {'fields': ('price',)}),
        ('Agents', {'fields': ('primary_agent', 'secondary_agent'), 'description': 'Pick saved agents, or use the + beside the field to add a new agent in a popup.'}),
        ('Details', {'fields': ('bedrooms', 'baths', 'short_description', 'description')}),
        ('SEO', {'fields': ('meta_title', 'meta_description', 'seo_h1'), 'description': 'Leave these blank to auto-generate SEO copy from listing details.'}),
        ('Cover image', {'fields': ('featured_image',)}),
    )

    class Media:
        js = ('admin/js/property_price_preview.js', 'admin/js/property_slug_preview.js')


@admin.register(PropertyImage)
class PropertyImageAdmin(admin.ModelAdmin):
    list_display = ('property_listing', 'sort_order', 'image')
    list_filter = ('property_listing__listing_type',)
    search_fields = ('property_listing__title',)
    ordering = ('property_listing', 'sort_order', 'id')
