from rest_framework import serializers

from .models import Property


class PropertySerializer(serializers.ModelSerializer):
    featured_image_url = serializers.SerializerMethodField()

    class Meta:
        model = Property
        fields = (
            'id',
            'title',
            'slug',
            'property_type',
            'category',
            'block',
            'size',
            'price',
            'location',
            'short_description',
            'description',
            'featured_image',
            'featured_image_url',
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
