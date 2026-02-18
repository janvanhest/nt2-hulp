from rest_framework import serializers

from .models import FillInSentence, Verb, VerbForm


class VerbFormSerializer(serializers.ModelSerializer):
    class Meta:
        model = VerbForm
        fields = [
            "tt_ik",
            "tt_jij",
            "tt_hij",
            "vt_ev",
            "vt_mv",
            "vd",
            "vd_hulpwerkwoord",
        ]


class VerbSerializer(serializers.ModelSerializer):
    forms = VerbFormSerializer(required=False)

    class Meta:
        model = Verb
        fields = ["id", "infinitive", "created_at", "updated_at", "forms"]
        read_only_fields = ["id", "created_at", "updated_at"]
        extra_kwargs = {
            "infinitive": {
                "error_messages": {
                    "unique": "Een werkwoord met deze infinitief bestaat al.",
                }
            }
        }

    def create(self, validated_data: dict) -> Verb:
        forms_data = validated_data.pop("forms", None)
        verb = Verb.objects.create(**validated_data)
        if forms_data is not None:
            VerbForm.objects.create(verb=verb, **forms_data)
        else:
            VerbForm.objects.create(verb=verb)
        return verb

    def update(self, instance: Verb, validated_data: dict) -> Verb:
        forms_data = validated_data.pop("forms", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if forms_data is not None:
            try:
                form = instance.forms
            except VerbForm.DoesNotExist:
                form = VerbForm(verb=instance)
            for attr, value in forms_data.items():
                setattr(form, attr, value)
            form.save()

        return instance


class FillInSentenceSerializer(serializers.ModelSerializer):
    """Invulzin: verb as id on write, nested { id, infinitive } on read."""

    verb = serializers.PrimaryKeyRelatedField(queryset=Verb.objects.all())

    class Meta:
        model = FillInSentence
        fields = ["id", "verb", "sentence_template", "answer", "answer_form_key", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]

    def to_representation(self, instance: FillInSentence) -> dict:
        data = super().to_representation(instance)
        data["verb"] = {"id": instance.verb.id, "infinitive": instance.verb.infinitive}
        return data
