from django.contrib import admin

from .models import Verb, VerbForm


class VerbFormInline(admin.StackedInline):
    model = VerbForm
    fk_name = "verb"
    max_num = 1


@admin.register(Verb)
class VerbAdmin(admin.ModelAdmin):
    list_display = ("infinitive", "created_at")
    search_fields = ("infinitive",)
    inlines = [VerbFormInline]
