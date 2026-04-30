import re
import secrets

from django.db import migrations
from django.utils.text import slugify

_SERIAL = re.compile(r'-\d{10}$')


def _base(slug, title):
    raw = (slug or '').strip()
    if re.match(r'^news-pending-[a-f0-9]{12}$', raw):
        raw = ''
    else:
        raw = re.sub(r'^\d+-', '', raw)
        raw = _SERIAL.sub('', raw)
    if not raw:
        raw = slugify(title) or 'news'
    body = slugify(raw) or slugify(title) or 'news'
    return body[:289].rstrip('-') or 'news'


def forwards(apps, schema_editor):
    Post = apps.get_model('news', 'NewsPost')
    for post in Post.objects.all().order_by('pk'):
        s = (post.slug or '').strip()
        if _SERIAL.search(s):
            continue
        base = _base(s, post.title)
        while True:
            serial = f'{secrets.randbelow(10**10):010d}'
            candidate = f'{base}-{serial}'
            if not Post.objects.exclude(pk=post.pk).filter(slug=candidate).exists():
                break
        Post.objects.filter(pk=post.pk).update(slug=candidate)


def backwards(apps, schema_editor):
    Post = apps.get_model('news', 'NewsPost')
    for post in Post.objects.all().order_by('pk'):
        s = (post.slug or '').strip()
        stripped = _SERIAL.sub('', s)
        if stripped and stripped != s:
            Post.objects.filter(pk=post.pk).update(slug=stripped)


class Migration(migrations.Migration):

    dependencies = [
        ('news', '0006_newspost_slug_prefix_pk'),
    ]

    operations = [
        migrations.RunPython(forwards, backwards),
    ]
