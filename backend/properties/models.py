import secrets
import uuid
from urllib.parse import quote

from django.core.files.storage import default_storage
from django.db import models
from django_ckeditor_5.fields import CKEditor5Field
from django.utils.text import slugify

from common.image_webp import optimize_upload_for_web


SITE_ORIGIN = 'https://gulberggreens.com.pk'


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
        PLOTS = 'plots', 'Plots'
        COMMERCIAL_PLOTS = 'commercial_plots', 'Commercial Plots'
        FARMHOUSE = 'farmhouse', 'Farmhouse'
        HOUSE = 'house', 'House'
        FLAT = 'flat', 'Flat'
        OFFICE = 'office', 'Office'
        SHOP = 'shop', 'Shop'

    class AreaUnit(models.TextChoices):
        MARLA = 'marla', 'Marla'
        KANAL = 'kanal', 'Kanal'
        SQUARE_FEET = 'square_feet', 'Square Feet'
        SQUARE_YARDS = 'square_yards', 'Square Yards'

    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=275, unique=True, blank=True)
    listing_type = models.CharField(
        max_length=32,
        choices=ListingType.choices,
        default=ListingType.PLOTS,
    )
    purpose = models.CharField(max_length=80, blank=True)
    block = models.CharField(max_length=100)
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
    area_unit = models.CharField(
        max_length=20,
        choices=AreaUnit.choices,
        default=AreaUnit.MARLA,
        help_text='Unit for the area value.',
    )
    price = models.DecimalField(max_digits=14, decimal_places=2, null=True, blank=True)
    location = models.CharField(max_length=255, blank=True)
    short_description = models.CharField(max_length=320, blank=True)
    description = CKEditor5Field(
        'Description',
        config_name='default',
        blank=True,
        help_text='Full listing copy: use the toolbar for bold, headings, lists, and links. HTML is shown on the property page.',
    )
    meta_title = models.CharField(
        max_length=90,
        blank=True,
        help_text='SEO title. Leave blank to auto-generate from size, type, purpose, and block.',
    )
    meta_description = models.TextField(
        max_length=180,
        blank=True,
        help_text='SEO description. Leave blank to auto-generate from listing details.',
    )
    seo_h1 = models.CharField(
        max_length=220,
        blank=True,
        verbose_name='SEO H1',
        help_text='Main SEO heading. Leave blank to auto-generate.',
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

    @property
    def category_slug(self):
        return {
            self.ListingType.PLOTS: 'plots',
            self.ListingType.COMMERCIAL_PLOTS: 'commercial-plots',
            self.ListingType.FARMHOUSE: 'farm-house',
            self.ListingType.HOUSE: 'house',
            self.ListingType.FLAT: 'flat',
            self.ListingType.OFFICE: 'office',
            self.ListingType.SHOP: 'shop',
        }.get(self.listing_type, self.listing_type)

    @property
    def block_slug(self):
        block = (self.block or '').strip()
        if not block:
            return ''
        normalized = slugify(block.replace('(', ' ').replace(')', ' '))
        normalized = normalized.removeprefix('block-')
        return f'block-{normalized}' if normalized else ''

    @property
    def canonical_url(self):
        block_segment = quote((self.block or '').strip(), safe='')
        return f'{SITE_ORIGIN}/properties/{self.category_slug}/{block_segment}/{self.slug}'

    def _area_label(self):
        if self.area_marlas in (None, ''):
            return ''
        amount = f'{self.area_marlas:.2f}'.rstrip('0').rstrip('.')
        unit = self.get_area_unit_display() if self.area_unit else 'Marla'
        return f'{amount} {unit}'

    def _purpose_label(self):
        value = (self.purpose or '').strip()
        if not value:
            return 'Sale'
        return 'Rent' if 'rent' in value.lower() else 'Sale'

    def _seo_type_label(self):
        return {
            self.ListingType.PLOTS: 'Plot',
            self.ListingType.COMMERCIAL_PLOTS: 'Commercial Plot',
            self.ListingType.FARMHOUSE: 'Farmhouse',
            self.ListingType.HOUSE: 'House',
            self.ListingType.FLAT: 'Flat',
            self.ListingType.OFFICE: 'Office Space',
            self.ListingType.SHOP: 'Shop',
        }.get(self.listing_type, self.get_listing_type_display())

    def _block_label(self):
        block = (self.block or '').strip()
        if not block:
            return 'Gulberg Greens'
        return block if block.lower().startswith('block ') else f'Block {block}'

    def _compact_price(self):
        if self.price in (None, ''):
            return ''
        amount = self.price
        units = (
            (10000000, 'Crore'),
            (100000, 'Lac'),
            (1000, 'Thousand'),
        )
        for divisor, label in units:
            if abs(amount) >= divisor:
                compact = amount / divisor
                text = f'{compact:.2f}'.rstrip('0').rstrip('.')
                return f'PKR {text} {label}'
        return f'PKR {amount:,.0f}'

    def generate_seo(self):
        area = self._area_label()
        listing_type = self._seo_type_label()
        purpose = self._purpose_label()
        block = self._block_label()
        subject = f'{area} {listing_type}'.strip() or self.title
        price = self._compact_price()

        title = f'{subject} for {purpose} in {block} | Gulberg Greens Islamabad'
        description = (
            f'{subject} for {purpose.lower()} in {block}, Gulberg Greens Islamabad. '
            f'Secure gated community by IBECHS.'
        )
        if price:
            description = f'{description} Price: {price}.'
        description = f'{description} Contact us today.'
        h1 = f'{subject} for {purpose} in {block}, Gulberg Greens Islamabad'
        return title[:90], description[:180], h1[:220]

    def _build_serialized_slug(self):
        base_slug = slugify(self.title) or 'property'
        while True:
            serial = f'{secrets.randbelow(10**10):010d}'
            candidate = f'{base_slug}-{serial}'
            if not Property.objects.exclude(pk=self.pk).filter(slug=candidate).exists():
                return candidate

    def _optimize_featured_image_if_needed(self):
        if not self.featured_image:
            return
        old_name = None
        if self.pk:
            prev = Property.objects.only('featured_image').filter(pk=self.pk).first()
            if prev and prev.featured_image:
                old_name = prev.featured_image.name
        cur = self.featured_image.name
        if old_name is not None and cur == old_name:
            return
        optimized = optimize_upload_for_web(self.featured_image)
        if not optimized:
            return
        self.featured_image.save(optimized.name, optimized, save=False)

    def save(self, *args, **kwargs):
        old_featured_name = None
        if self.pk:
            prev_row = Property.objects.only('featured_image').filter(pk=self.pk).first()
            if prev_row and prev_row.featured_image:
                old_featured_name = prev_row.featured_image.name

        self._optimize_featured_image_if_needed()

        title, description, h1 = self.generate_seo()
        if not self.meta_title:
            self.meta_title = title
        if not self.meta_description:
            self.meta_description = description
        if not self.seo_h1:
            self.seo_h1 = h1

        try:
            if self.slug:
                super().save(*args, **kwargs)
                return

            self.slug = f'property-{uuid.uuid4().hex[:12]}'
            super().save(*args, **kwargs)

            self.slug = self._build_serialized_slug()
            super().save(update_fields=('slug',))
        finally:
            if old_featured_name:
                new_name = self.featured_image.name if self.featured_image else None
                if new_name != old_featured_name and default_storage.exists(old_featured_name):
                    default_storage.delete(old_featured_name)


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

    def save(self, *args, **kwargs):
        old_name = None
        if self.pk:
            prev = PropertyImage.objects.filter(pk=self.pk).only('image').first()
            if prev and prev.image:
                old_name = prev.image.name

        if self.image:
            cur = self.image.name
            if old_name is None or cur != old_name:
                optimized = optimize_upload_for_web(self.image)
                if optimized:
                    self.image.save(optimized.name, optimized, save=False)

        super().save(*args, **kwargs)

        if old_name and self.image and old_name != self.image.name:
            if default_storage.exists(old_name):
                default_storage.delete(old_name)


class ListingEmail(models.Model):
    """Inquiry submitted from the public property page (one per listing per sender email)."""

    property_listing = models.ForeignKey(
        Property,
        on_delete=models.CASCADE,
        related_name='listing_emails',
        verbose_name='Property listing',
    )
    sender_name = models.CharField(max_length=200)
    sender_email = models.EmailField(max_length=254, db_index=True)
    sender_phone = models.CharField(max_length=40, blank=True)
    message = models.TextField()
    submitted_ip = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.CharField(max_length=512, blank=True)
    is_read = models.BooleanField(
        default=False,
        db_index=True,
        help_text='Mark when staff has reviewed this inquiry.',
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Listing email inquiry'
        verbose_name_plural = 'Listing email inquiries'
        constraints = [
            models.UniqueConstraint(
                fields=('property_listing', 'sender_email'),
                name='listingemail_unique_listing_sender_email',
            ),
        ]

    def __str__(self):
        return f'{self.sender_email} → listing #{self.property_listing_id}'
