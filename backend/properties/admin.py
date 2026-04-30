from django.contrib import admin
from django.urls import reverse
from django.utils.html import format_html

from .models import Agent, ListingEmail, Property, PropertyImage


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


@admin.register(ListingEmail)
class ListingEmailAdmin(admin.ModelAdmin):
    list_display = (
        'created_at',
        'property_admin_link',
        'sender_email',
        'sender_name',
        'phone_short',
        'message_preview',
        'is_read',
    )
    list_display_links = ('created_at', 'sender_email')
    list_filter = ('is_read', 'created_at', 'property_listing__listing_type')
    list_editable = ('is_read',)
    search_fields = (
        'sender_name',
        'sender_email',
        'sender_phone',
        'message',
        'property_listing__title',
        'property_listing__slug',
    )
    date_hierarchy = 'created_at'
    ordering = ('-created_at',)
    list_per_page = 25
    readonly_fields = (
        'property_admin_link',
        'sender_name',
        'sender_email',
        'sender_phone',
        'message',
        'submitted_ip',
        'user_agent',
        'created_at',
    )
    fieldsets = (
        (
            'Inquiry',
            {
                'fields': ('sender_name', 'sender_email', 'sender_phone', 'message'),
                'description': 'Submitted from the public property page. One inquiry per email address per listing.',
            },
        ),
        (
            'Listing',
            {'fields': ('property_admin_link',)},
        ),
        (
            'Technical',
            {
                'fields': ('submitted_ip', 'user_agent', 'created_at'),
                'classes': ('collapse',),
            },
        ),
    )

    @admin.display(description='Property')
    def property_admin_link(self, obj):
        if not obj.property_listing_id:
            return '—'
        url = reverse('admin:properties_property_change', args=[obj.property_listing_id])
        title = (obj.property_listing.title or '')[:80]
        return format_html('<a href="{}"><strong>{}</strong></a>', url, title)

    @admin.display(description='Phone')
    def phone_short(self, obj):
        p = (obj.sender_phone or '').strip()
        return p[:24] + ('…' if len(p) > 24 else '')

    @admin.display(description='Message')
    def message_preview(self, obj):
        m = (obj.message or '').replace('\n', ' ').strip()
        if len(m) > 90:
            return m[:90] + '…'
        return m or '—'

    def has_add_permission(self, request):
        return False

    actions = ('mark_read', 'mark_unread')

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('property_listing')

    @admin.action(description='Mark selected as read')
    def mark_read(self, request, queryset):
        queryset.update(is_read=True)

    @admin.action(description='Mark selected as unread')
    def mark_unread(self, request, queryset):
        queryset.update(is_read=False)
