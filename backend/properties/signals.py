from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver

from common.seo_rebuild import schedule_seo_rebuild
from .models import Property


@receiver(post_save, sender=Property)
def property_saved_schedule_seo_rebuild(sender, instance, **kwargs):
    schedule_seo_rebuild()


@receiver(post_delete, sender=Property)
def property_deleted_schedule_seo_rebuild(sender, instance, **kwargs):
    schedule_seo_rebuild()
