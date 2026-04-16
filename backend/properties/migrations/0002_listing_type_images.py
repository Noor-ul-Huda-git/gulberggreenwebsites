import re
from decimal import Decimal, InvalidOperation

from django.db import migrations, models
import django.db.models.deletion


def migrate_from_legacy(apps, schema_editor):
    Property = apps.get_model('properties', 'Property')
    for p in Property.objects.all():
        pt = getattr(p, 'property_type', None)
        cat = getattr(p, 'category', None)
        if pt == 'commercial':
            p.listing_type = 'commercial_plots'
        elif pt == 'house' and cat == 'rent':
            p.listing_type = 'houses_rent'
        elif pt == 'house' and cat == 'sale':
            p.listing_type = 'houses_sale'
        elif pt == 'apartment' and cat == 'rent':
            p.listing_type = 'apartments_rent'
        elif pt == 'apartment' and cat == 'sale':
            p.listing_type = 'apartments_sale'
        elif pt == 'farmhouse' and cat == 'rent':
            p.listing_type = 'houses_rent'
        elif pt == 'farmhouse' and cat == 'sale':
            p.listing_type = 'houses_sale'
        else:
            p.listing_type = 'residential_plots'

        size = getattr(p, 'size', '') or ''
        m = re.search(r'(\d+(?:\.\d+)?)', str(size))
        if m:
            try:
                p.area_marlas = Decimal(m.group(1))
            except InvalidOperation:
                pass
        p.save()


def noop_reverse(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('properties', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='property',
            name='listing_type',
            field=models.CharField(
                choices=[
                    ('residential_plots', 'Residential Plots'),
                    ('commercial_plots', 'Commercial Plots'),
                    ('houses_sale', 'Houses For Sale'),
                    ('houses_rent', 'Houses For Rent'),
                    ('apartments_sale', 'Apartments For Sale'),
                    ('apartments_rent', 'Apartments For Rent'),
                ],
                default='residential_plots',
                max_length=32,
            ),
        ),
        migrations.AddField(
            model_name='property',
            name='area_marlas',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True),
        ),
        migrations.AddField(
            model_name='property',
            name='bedrooms',
            field=models.PositiveSmallIntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='property',
            name='baths',
            field=models.PositiveSmallIntegerField(blank=True, null=True),
        ),
        migrations.CreateModel(
            name='PropertyImage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to='properties/gallery/')),
                ('sort_order', models.PositiveSmallIntegerField(default=0)),
                (
                    'property_listing',
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name='images',
                        to='properties.property',
                    ),
                ),
            ],
            options={
                'ordering': ['sort_order', 'id'],
            },
        ),
        migrations.RunPython(migrate_from_legacy, noop_reverse),
        migrations.RemoveField(
            model_name='property',
            name='property_type',
        ),
        migrations.RemoveField(
            model_name='property',
            name='category',
        ),
        migrations.RemoveField(
            model_name='property',
            name='size',
        ),
    ]
