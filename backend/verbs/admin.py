from django.contrib import admin

from .models import FillInSentence, Verb, VerbForm


class VerbFormInline(admin.StackedInline):
    model = VerbForm
    fk_name = "verb"
    max_num = 1


@admin.register(Verb)
class VerbAdmin(admin.ModelAdmin):
    list_display = ("infinitive", "created_at")
    search_fields = ("infinitive",)
    inlines = [VerbFormInline]


@admin.register(FillInSentence)
class FillInSentenceAdmin(admin.ModelAdmin):
    list_display = (
        "sentence_template",
        "answer",
        "answer_form_key",
        "verb",
        "created_at",
    )
    list_filter = ("verb", "answer_form_key")
    search_fields = ("sentence_template", "answer")
