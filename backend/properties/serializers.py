from rest_framework import serializers

from .models import Property, PropertyImage


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
    images = PropertyImageSerializer(many=True, read_only=True)

    class Meta:
        model = Property
        fields = (
            'id',
            'title',
            'slug',
            'listing_type',
            'listing_type_display',
            'block',
            'area_marlas',
            'price',
            'location',
            'short_description',
            'description',
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

    def get_featured_image_url(self, obj):
        request = self.context.get('request')
        if not obj.featured_image:
            return None
        if request:
            return request.build_absolute_uri(obj.featured_image.url)
        return obj.featured_image.url


