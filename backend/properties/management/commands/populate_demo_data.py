"""
Populate the database with demo agents, properties (5 images each), and news articles (3 images each).

Usage:
  python manage.py populate_demo_data
  python manage.py populate_demo_data --clear   # removes all agents, properties, and news posts first

Requires Pillow (already in requirements.txt).
"""

import random
from datetime import timedelta
from decimal import Decimal
from io import BytesIO

from django.core.files.base import ContentFile
from django.core.management.base import BaseCommand
from django.utils import timezone
from django.utils.text import slugify
from PIL import Image

from news.models import NewsImage, NewsPost
from properties.models import Agent, Property, PropertyImage


PAKISTANI_FIRST = [
    'Ahmed',
    'Hassan',
    'Usman',
    'Bilal',
    'Omar',
    'Zain',
    'Hamza',
    'Ali',
    'Faisal',
    'Saad',
    'Ayesha',
    'Fatima',
    'Sana',
    'Hira',
    'Zara',
]
PAKISTANI_LAST = ['Khan', 'Malik', 'Sheikh', 'Raza', 'Butt', 'Abbasi', 'Qureshi', 'Iqbal', 'Hussain', 'Siddiqui']

BLOCKS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'Executive', 'Overseas']

LISTING_TYPES = [c[0] for c in Property.ListingType.choices]


def random_pk_phone(existing):
    """Unique Pakistani-style mobile for demo data."""
    for _ in range(500):
        prefix = random.randint(300, 349)
        rest = random.randint(1_000_000, 9_999_999)
        raw = f'+92 {prefix} {rest // 10000:04d} {rest % 10000:04d}'
        if raw not in existing:
            existing.add(raw)
            return raw
    raise RuntimeError('Could not generate unique phone')


def make_jpeg_bytes(width=960, height=640):
    r, g, b = (random.randint(40, 220), random.randint(40, 220), random.randint(40, 220))
    img = Image.new('RGB', (width, height), color=(r, g, b))
    buf = BytesIO()
    img.save(buf, format='JPEG', quality=88)
    buf.seek(0)
    return buf.read()


class Command(BaseCommand):
    help = 'Create 3 agents, 100 properties (5 photos each), 100 news articles (3 photos each).'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Delete all properties, agents, and news posts (and related images) before seeding.',
        )

    def handle(self, *args, **options):
        if options['clear']:
            self.stdout.write('Clearing properties, agents, and news…')
            Property.objects.all().delete()
            Agent.objects.all().delete()
            NewsPost.objects.all().delete()

        if Agent.objects.exists() or Property.objects.exists() or NewsPost.objects.exists():
            self.stderr.write(
                'Database already has agents, properties, or news. Use --clear to replace, or use an empty DB.'
            )
            return

        phones_used = set()
        agents = []
        for i in range(3):
            name = f'{random.choice(PAKISTANI_FIRST)} {random.choice(PAKISTANI_LAST)}'
            phone = random_pk_phone(phones_used)
            agents.append(Agent.objects.create(name=name, phone=phone))
            self.stdout.write(self.style.SUCCESS(f'Agent: {name} — {phone}'))

        now = timezone.now()
        for n in range(100):
            lt = random.choice(LISTING_TYPES)
            block = random.choice(BLOCKS)
            marlas = Decimal(str(random.choice([5, 8, 10, 12, 14, 1, 2, 4])))
            price = Decimal(random.randint(50, 350)) * Decimal('100000')
            title = f'{marlas.normalize()} Marla {lt.replace("_", " ").title()} — Block {block} #{n + 1}'
            prop = Property(
                title=title,
                listing_type=lt,
                purpose=random.choice(['Sale', 'Rent', '']),
                block=block,
                area_marlas=marlas,
                price=price,
                location=f'Block {block}, Gulberg Greens, Islamabad',
                short_description=f'Prime location in Block {block}. Well-connected and secure.',
                description=f'<p>Demo listing #{n + 1} in Block {block}. Contact our agent for a site visit.</p>',
                primary_agent=random.choice(agents),
                secondary_agent=random.choice(agents) if random.random() > 0.65 else None,
                bedrooms=random.randint(2, 6) if 'house' in lt or 'apartment' in lt else None,
                baths=random.randint(2, 5) if 'house' in lt or 'apartment' in lt else None,
                is_featured=random.random() < 0.12,
                is_published=True,
            )
            prop.save()

            for sort in range(5):
                data = make_jpeg_bytes()
                fname = f'demo-{prop.slug or slugify(title)}-{sort}.jpg'
                if sort == 0:
                    prop.featured_image.save(fname, ContentFile(data), save=True)
                else:
                    img = PropertyImage(property_listing=prop, sort_order=sort)
                    img.image.save(fname, ContentFile(data), save=True)

            if (n + 1) % 25 == 0:
                self.stdout.write(f'  …{n + 1} properties')

        authors = ['Editorial Desk', 'Marketing Team', 'Site Admin', 'Contributing Writer']
        for n in range(100):
            pub = now - timedelta(days=random.randint(0, 400), hours=random.randint(0, 23))
            post = NewsPost(
                title=f'Community update #{n + 1}: Gulberg Greens highlights',
                description=(
                    f'<p>This is demo article <strong>#{n + 1}</strong> with rich text.</p>'
                    f'<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. '
                    f'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>'
                    f'<ul><li>Infrastructure and parks</li><li>Investment outlook</li><li>Resident stories</li></ul>'
                ),
                author_name=random.choice(authors),
                published_at=pub,
                is_published=True,
            )
            post.save()
            for sort in range(3):
                data = make_jpeg_bytes(880, 520)
                ni = NewsImage(post=post, sort_order=sort, alt_text=f'Article {n + 1} figure {sort + 1}')
                ni.image.save(f'news-demo-{post.slug}-{sort}.jpg', ContentFile(data), save=True)

            if (n + 1) % 25 == 0:
                self.stdout.write(f'  …{n + 1} articles')

        self.stdout.write(self.style.SUCCESS('Done: 3 agents, 100 properties, 100 news articles.'))
