from rest_framework import serializers

from .models import Agent, Property, PropertyImage


class AgentBriefSerializer(serializers.ModelSerializer):
    class Meta:
        model = Agent
        fields = ('id', 'name', 'phone')


class PropertyImageSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()

    class Meta:
        model = PropertyImage
        fields = ('id', 'url', 'sort_order')

    def get_url(self, obj):
        request = self.context.get('request')
        if not obj.image:
            return None
        if request:
            return request.build_absolute_uri(obj.image.url)
        return obj.image.url


class PropertySerializer(serializers.ModelSerializer):
    featured_image_url = serializers.SerializerMethodField()
    listing_type_display = serializers.CharField(source='get_listing_type_display', read_only=True)
    area_unit_display = serializers.CharField(source='get_area_unit_display', read_only=True)
    category_slug = serializers.CharField(read_only=True)
    block_slug = serializers.CharField(read_only=True)
    canonical_url = serializers.CharField(read_only=True)
    images = PropertyImageSerializer(many=True, read_only=True)
    primary_agent = AgentBriefSerializer(read_only=True)
    secondary_agent = AgentBriefSerializer(read_only=True)
    agent_name = serializers.SerializerMethodField()
    agency_name = serializers.SerializerMethodField()
    agent_mobile = serializers.SerializerMethodField()
    agent_phone = serializers.SerializerMethodField()

    class Meta:
        model = Property
        fields = (
            'id',
            'title',
            'slug',
            'listing_type',
            'listing_type_display',
            'category_slug',
            'purpose',
            'block',
            'block_slug',
            'plot_number',
            'category',
            'area_marlas',
            'area_unit',
            'area_unit_display',
            'price',
            'location',
            'short_description',
            'description',
            'meta_title',
            'meta_description',
            'seo_h1',
            'canonical_url',
            'primary_agent',
            'secondary_agent',
            'agent_name',
            'agency_name',
            'agent_mobile',
            'agent_phone',
            'bedrooms',
            'baths',
            'featured_image',
            'featured_image_url',
            'images',
            'is_featured',
            'is_published',
            'created_at',
            'updated_at',
        )

    def get_agent_name(self, obj):
        return obj.primary_agent.name if obj.primary_agent_id else ''

    def get_agency_name(self, obj):
        return obj.primary_agent.phone if obj.primary_agent_id else ''

    def get_agent_mobile(self, obj):
        return obj.secondary_agent.name if obj.secondary_agent_id else ''

    def get_agent_phone(self, obj):
        return obj.secondary_agent.phone if obj.secondary_agent_id else ''

    def get_featured_image_url(self, obj):
        request = self.context.get('request')
        if not obj.featured_image:
            return None
        if request:
            return request.build_absolute_uri(obj.featured_image.url)
        return obj.featured_image.url


class ListingEmailCreateSerializer(serializers.Serializer):
    """Public inquiry form → stored as ListingEmail (one per listing per sender email)."""

    name = serializers.CharField(max_length=200, trim_whitespace=True)
    email = serializers.EmailField(max_length=254)
    phone = serializers.CharField(max_length=20, allow_blank=True, trim_whitespace=True)
    message = serializers.CharField(max_length=8000, allow_blank=True, trim_whitespace=True)

    def validate_email(self, value):
        return value.strip().lower()

    def validate_phone(self, value):
        digits = ''.join(c for c in (value or '') if c.isdigit())
        return digits[:15]
