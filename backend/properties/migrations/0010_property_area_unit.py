from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('properties', '0009_update_listing_type_choices'),
    ]

    operations = [
        migrations.AddField(
            model_name='property',
            name='area_unit',
            field=models.CharField(
                choices=[
                    ('marla', 'Marla'),
                    ('kanal', 'Kanal'),
                    ('square_feet', 'Square Feet'),
                    ('square_yards', 'Square Yards'),
                ],
                default='marla',
                help_text='Unit for the area value.',
                max_length=20,
            ),
        ),
    ]
