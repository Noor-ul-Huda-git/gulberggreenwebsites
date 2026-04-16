"""Admin site tweaks: auth models are not managed through this UI."""
from django.contrib import admin
from django.contrib.auth.models import Group, User

admin.site.unregister(User)
admin.site.unregister(Group)
