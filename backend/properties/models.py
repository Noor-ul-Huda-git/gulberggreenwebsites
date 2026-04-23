from ckeditor.fields import RichTextField
from django.db import models
from django.utils.text import slugify


class Agent(models.Model):
    """Listing contact shown on property pages; reuse across many properties."""

    name = models.CharField(max_length=120)
    phone = models.CharField(max_length=32, unique=True, help_text='e.g. +92 300 1234567')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']
        verbose_name = 'Agent'
        verbose_name_plural = 'Agents'

    def __str__(self):
        return f'{self.name} ({self.phone})'


class Property(models.Model):
    class ListingType(models.TextChoices):
        RESIDENTIAL_PLOTS = 'residential_plots', 'Residential Plots'
        COMMERCIAL_PLOTS = 'commercial_plots', 'Commercial Plots'
        HOUSES_SALE = 'houses_sale', 'Houses For Sale'
        HOUSES_RENT = 'houses_rent', 'Houses For Rent'
        APARTMENTS_SALE = 'apartments_sale', 'Apartments For Sale'
        APARTMENTS_RENT = 'apartments_rent', 'Apartments For Rent'

    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=275, unique=True, blank=True)
    listing_type = models.CharField(
        max_length=32,
        choices=ListingType.choices,
        default=ListingType.RESIDENTIAL_PLOTS,
    )
    purpose = models.CharField(max_length=80, blank=True)
    block = models.CharField(max_length=100, blank=True)
    plot_number = models.CharField(
        max_length=50,
        blank=True,
        help_text='Plot number for the details grid (e.g. 123).',
    )
    category = models.CharField(
        max_length=120,
        blank=True,
        help_text='Listing category label (e.g. Developed plot, Corner).',
    )
    area_marlas = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    price = models.DecimalField(max_digits=14, decimal_places=2, null=True, blank=True)
    location = models.CharField(max_length=255, blank=True)
    short_description = models.CharField(max_length=320, blank=True)
    description = RichTextField(
        blank=True,
        help_text='Full listing copy: use the toolbar for bold, headings, lists, and links. HTML is shown on the property page.',
    )
    primary_agent = models.ForeignKey(
        Agent,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='properties_primary',
        verbose_name='Primary agent',
    )
    secondary_agent = models.ForeignKey(
        Agent,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='properties_secondary',
        verbose_name='Secondary agent',
    )
    bedrooms = models.PositiveSmallIntegerField(null=True, blank=True)
    baths = models.PositiveSmallIntegerField(null=True, blank=True)
    featured_image = models.ImageField(upload_to='properties/featured/', blank=True, null=True)
    is_featured = models.BooleanField(default=False)
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-is_featured', '-created_at']
        verbose_name = 'Property listing'
        verbose_name_plural = 'Property listings'

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


class PropertyImage(models.Model):
    property_listing = models.ForeignKey(
        Property,
        related_name='images',
        on_delete=models.CASCADE,
    )
    image = models.ImageField(upload_to='properties/gallery/')
    sort_order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ['sort_order', 'id']
        verbose_name = 'Property image'
        verbose_name_plural = 'Property images'

    def __str__(self):
        return f'{self.property_listing_id} — image {self.sort_order}'
