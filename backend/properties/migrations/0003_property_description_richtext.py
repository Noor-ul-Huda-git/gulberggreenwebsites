import ckeditor.fields
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('properties', '0002_listing_type_images'),
    ]

    operations = [
        migrations.AlterField(
            model_name='property',
            name='description',
            field=ckeditor.fields.RichTextField(
                blank=True,
                help_text='Full listing copy: use the toolbar for bold, headings, lists, and links. HTML is shown on the property page.',
            ),
        ),
    ]
