from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('properties', '0003_property_description_richtext'),
    ]

    operations = [
        migrations.AddField(
            model_name='property',
            name='agency_name',
            field=models.CharField(blank=True, max_length=160),
        ),
        migrations.AddField(
            model_name='property',
            name='agent_mobile',
            field=models.CharField(blank=True, max_length=32),
        ),
        migrations.AddField(
            model_name='property',
            name='agent_name',
            field=models.CharField(blank=True, max_length=120),
        ),
        migrations.AddField(
            model_name='property',
            name='agent_phone',
            field=models.CharField(blank=True, max_length=32),
        ),
    ]
