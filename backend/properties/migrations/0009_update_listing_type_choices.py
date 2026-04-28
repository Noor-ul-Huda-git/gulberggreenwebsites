from django.db import migrations, models


OLD_TO_NEW = {
    'residential_plots': 'plots',
    'commercial_plots': 'commercial_plots',
    'houses_sale': 'house',
    'houses_rent': 'house',
    'apartments_sale': 'flat',
    'apartments_rent': 'flat',
}

NEW_TO_OLD = {
    'plots': 'residential_plots',
    'commercial_plots': 'commercial_plots',
    'farmhouse': 'residential_plots',
    'house': 'houses_sale',
    'flat': 'apartments_sale',
    'office': 'commercial_plots',
    'shop': 'commercial_plots',
}


def forwards_update_listing_types(apps, schema_editor):
    Property = apps.get_model('properties', 'Property')
    for old_value, new_value in OLD_TO_NEW.items():
        Property.objects.filter(listing_type=old_value).update(listing_type=new_value)


def backwards_update_listing_types(apps, schema_editor):
    Property = apps.get_model('properties', 'Property')
    for new_value, old_value in NEW_TO_OLD.items():
        Property.objects.filter(listing_type=new_value).update(listing_type=old_value)


class Migration(migrations.Migration):

    dependencies = [
        ('properties', '0008_add_plot_number_category'),
    ]

    operations = [
        migrations.RunPython(forwards_update_listing_types, backwards_update_listing_types),
        migrations.AlterField(
            model_name='property',
            name='listing_type',
            field=models.CharField(
                choices=[
                    ('plots', 'Plots'),
                    ('commercial_plots', 'Commercial Plots'),
                    ('farmhouse', 'Farmhouse'),
                    ('house', 'House'),
                    ('flat', 'Flat'),
                    ('office', 'Office'),
                    ('shop', 'Shop'),
                ],
                default='plots',
                max_length=32,
            ),
        ),
    ]
