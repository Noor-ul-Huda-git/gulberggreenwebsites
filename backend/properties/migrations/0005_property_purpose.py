from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('properties', '0004_property_agent_contact_fields'),
    ]

    operations = [
        migrations.AddField(
            model_name='property',
            name='purpose',
            field=models.CharField(blank=True, max_length=80),
        ),
    ]
