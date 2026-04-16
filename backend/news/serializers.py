from django.utils.html import strip_tags
from rest_framework import serializers

from .models import NewsImage, NewsPost


class NewsImageSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()

    class Meta:
        model = NewsImage
        fields = ('id', 'url', 'sort_order', 'alt_text')

    def get_url(self, obj):
        request = self.context.get('request')
        if not obj.image:
            return None
        path = obj.image.url
        if request:
            return request.build_absolute_uri(path)
        return path


class NewsPostListSerializer(serializers.ModelSerializer):
    excerpt = serializers.SerializerMethodField()
    primary_image = serializers.SerializerMethodField()

    class Meta:
        model = NewsPost
        fields = (
            'id',
            'slug',
            'title',
            'author_name',
            'published_at',
            'excerpt',
            'primary_image',
        )

    def get_excerpt(self, obj):
        plain = strip_tags(obj.description).strip()
        if len(plain) <= 320:
            return plain
        return plain[:317].rsplit(' ', 1)[0] + '…'

    def get_primary_image(self, obj):
        img = obj.images.first()
        if not img or not img.image:
            return None
        request = self.context.get('request')
        path = img.image.url
        if request:
            return request.build_absolute_uri(path)
        return path


class NewsPostDetailSerializer(serializers.ModelSerializer):
    images = NewsImageSerializer(many=True, read_only=True)

    class Meta:
        model = NewsPost
        fields = (
            'id',
            'slug',
            'title',
            'description',
            'author_name',
            'published_at',
            'images',
            'updated_at',
        )
