import re

from django.db import migrations
from django.utils.text import slugify


def _body(slug, title):
    raw = (slug or '').strip()
    raw = re.sub(r'^\d+-', '', raw)
    if not raw:
        raw = slugify(title) or 'news'
    body = slugify(raw) or slugify(title) or 'news'
    return body[:260].rstrip('-') or 'news'


def forwards(apps, schema_editor):
    Post = apps.get_model('news', 'NewsPost')
    for post in Post.objects.all().order_by('pk'):
        s = (post.slug or '').strip()
        if re.match(r'^\d+-', s):
            continue
        body = _body(post.slug, post.title)
        candidate = f'{post.pk}-{body}'
        suffix = 0
        while Post.objects.exclude(pk=post.pk).filter(slug=candidate).exists():
            suffix += 1
            candidate = f'{post.pk}-{body}-{suffix}'
        Post.objects.filter(pk=post.pk).update(slug=candidate)


def backwards(apps, schema_editor):
    Post = apps.get_model('news', 'NewsPost')
    for post in Post.objects.all().order_by('pk'):
        s = (post.slug or '').strip()
        stripped = re.sub(r'^\d+-', '', s)
        if stripped and stripped != s:
            Post.objects.filter(pk=post.pk).update(slug=stripped)


class Migration(migrations.Migration):

    dependencies = [
        ('news', '0005_alter_newspost_description'),
    ]

    operations = [
        migrations.RunPython(forwards, backwards),
    ]
