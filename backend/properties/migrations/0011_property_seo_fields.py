from django.db import migrations, models


def _display_area(prop):
    value = prop.area_marlas
    if value in (None, ''):
        return ''
    amount = f'{value:.2f}'.rstrip('0').rstrip('.')
    unit = {
        'marla': 'Marla',
        'kanal': 'Kanal',
        'square_feet': 'Square Feet',
        'square_yards': 'Square Yards',
    }.get(prop.area_unit or 'marla', 'Marla')
    return f'{amount} {unit}'


def _purpose_label(prop):
    value = (prop.purpose or '').strip()
    if not value:
        return 'Sale'
    return 'Rent' if 'rent' in value.lower() else 'Sale'


def _type_label(prop):
    return {
        'plots': 'Plot',
        'commercial_plots': 'Commercial Plot',
        'farmhouse': 'Farmhouse',
        'house': 'House',
        'flat': 'Flat',
        'office': 'Office Space',
        'shop': 'Shop',
    }.get(prop.listing_type, prop.listing_type.replace('_', ' ').title())


def _block_label(prop):
    block = (prop.block or '').strip()
    if not block:
        return 'Gulberg Greens'
    return block if block.lower().startswith('block ') else f'Block {block}'


def _compact_price(prop):
    if prop.price in (None, ''):
        return ''
    amount = prop.price
    for divisor, label in ((10000000, 'Crore'), (100000, 'Lac'), (1000, 'Thousand')):
        if abs(amount) >= divisor:
            compact = amount / divisor
            text = f'{compact:.2f}'.rstrip('0').rstrip('.')
            return f'PKR {text} {label}'
    return f'PKR {amount:,.0f}'


def backfill_property_seo(apps, schema_editor):
    Property = apps.get_model('properties', 'Property')
    for prop in Property.objects.all().iterator():
        area = _display_area(prop)
        listing_type = _type_label(prop)
        purpose = _purpose_label(prop)
        block = _block_label(prop)
        subject = f'{area} {listing_type}'.strip() or prop.title
        price = _compact_price(prop)

        title = f'{subject} for {purpose} in {block} | Gulberg Greens Islamabad'
        description = (
            f'{subject} for {purpose.lower()} in {block}, Gulberg Greens Islamabad. '
            f'Secure gated community by IBECHS.'
        )
        if price:
            description = f'{description} Price: {price}.'
        description = f'{description} Contact us today.'
        h1 = f'{subject} for {purpose} in {block}, Gulberg Greens Islamabad'

        Property.objects.filter(pk=prop.pk).update(
            meta_title=(prop.meta_title or title)[:90],
            meta_description=(prop.meta_description or description)[:180],
            seo_h1=(prop.seo_h1 or h1)[:220],
        )


class Migration(migrations.Migration):

    dependencies = [
        ('properties', '0010_property_area_unit'),
    ]

    operations = [
        migrations.AddField(
            model_name='property',
            name='meta_title',
            field=models.CharField(
                blank=True,
                help_text='SEO title. Leave blank to auto-generate from size, type, purpose, and block.',
                max_length=90,
            ),
        ),
        migrations.AddField(
            model_name='property',
            name='meta_description',
            field=models.TextField(
                blank=True,
                help_text='SEO description. Leave blank to auto-generate from listing details.',
                max_length=180,
            ),
        ),
        migrations.AddField(
            model_name='property',
            name='seo_h1',
            field=models.CharField(
                blank=True,
                help_text='Main SEO heading. Leave blank to auto-generate.',
                max_length=220,
                verbose_name='SEO H1',
            ),
        ),
        migrations.RunPython(backfill_property_seo, migrations.RunPython.noop),
    ]
