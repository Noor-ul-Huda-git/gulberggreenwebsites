from django.db import models
from django.utils.text import slugify


class Property(models.Model):
    class PropertyType(models.TextChoices):
        PLOT = 'plot', 'Plot'
        HOUSE = 'house', 'House'
        FARMHOUSE = 'farmhouse', 'Farmhouse'
        APARTMENT = 'apartment', 'Apartment'
        COMMERCIAL = 'commercial', 'Commercial'

    class Category(models.TextChoices):
        SALE = 'sale', 'For Sale'
        RENT = 'rent', 'For Rent'

    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=275, unique=True, blank=True)
    property_type = models.CharField(
        max_length=20,
        choices=PropertyType.choices,
        default=PropertyType.PLOT,
    )
    category = models.CharField(
        max_length=10,
        choices=Category.choices,
        default=Category.SALE,
    )
    block = models.CharField(max_length=100, blank=True)
    size = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=14, decimal_places=2, null=True, blank=True)
    location = models.CharField(max_length=255, blank=True)
    short_description = models.CharField(max_length=320, blank=True)
    description = models.TextField(blank=True)
    featured_image = models.ImageField(upload_to='properties/featured/', blank=True, null=True)
    is_featured = models.BooleanField(default=False)
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-is_featured', '-created_at']
        verbose_name_plural = 'properties'

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title) or 'property'
            slug = base_slug
            suffix = 1

            while Property.objects.exclude(pk=self.pk).filter(slug=slug).exists():
                suffix += 1
                slug = f'{base_slug}-{suffix}'

            self.slug = slug

        super().save(*args, **kwargs)
