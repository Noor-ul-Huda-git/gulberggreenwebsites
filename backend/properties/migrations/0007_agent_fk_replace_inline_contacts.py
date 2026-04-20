# Generated manually: Agent model, FKs on Property, migrate legacy contact fields, drop old columns.

import django.db.models.deletion
from django.db import migrations, models


def forwards_copy_agents(apps, schema_editor):
    Property = apps.get_model('properties', 'Property')
    Agent = apps.get_model('properties', 'Agent')
    by_phone = {}

    def get_or_create_agent(name, phone):
        phone = (phone or '').strip()
        name = (name or '').strip() or 'Agent'
        if not phone:
            return None
        if phone in by_phone:
            return by_phone[phone]
        ag = Agent.objects.create(name=name, phone=phone)
        by_phone[phone] = ag
        return ag

    for p in Property.objects.all():
        primary = get_or_create_agent(getattr(p, 'agent_name', '') or '', getattr(p, 'agency_name', '') or '')
        secondary = get_or_create_agent(getattr(p, 'agent_mobile', '') or '', getattr(p, 'agent_phone', '') or '')
        updates = []
        if primary:
            p.primary_agent_id = primary.pk
            updates.append('primary_agent_id')
        if secondary:
            p.secondary_agent_id = secondary.pk
            updates.append('secondary_agent_id')
        if updates:
            p.save(update_fields=updates)


def backwards_noop(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('properties', '0006_merge_20260420_1428'),
    ]

    operations = [
        migrations.CreateModel(
            name='Agent',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=120)),
                (
                    'phone',
                    models.CharField(help_text='e.g. +92 300 1234567', max_length=32, unique=True),
                ),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name': 'Agent',
                'verbose_name_plural': 'Agents',
                'ordering': ['name'],
            },
        ),
        migrations.AddField(
            model_name='property',
            name='primary_agent',
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name='properties_primary',
                to='properties.agent',
                verbose_name='Primary agent',
            ),
        ),
        migrations.AddField(
            model_name='property',
            name='secondary_agent',
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name='properties_secondary',
                to='properties.agent',
                verbose_name='Secondary agent',
            ),
        ),
        migrations.RunPython(forwards_copy_agents, backwards_noop),
        migrations.RemoveField(model_name='property', name='agent_name'),
        migrations.RemoveField(model_name='property', name='agency_name'),
        migrations.RemoveField(model_name='property', name='agent_mobile'),
        migrations.RemoveField(model_name='property', name='agent_phone'),
    ]
