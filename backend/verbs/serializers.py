from rest_framework import serializers

from .models import FillInSentence, InvulzinThema, Theme, Verb, VerbForm


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


class ThemeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Theme
        fields = ["id", "naam"]
        read_only_fields = ["id"]


class FillInSentenceSerializer(serializers.ModelSerializer):
    """Invulzin: verb as id on write, nested { id, infinitive } on read; themas on read, thema_ids on write."""

    verb = serializers.PrimaryKeyRelatedField(queryset=Verb.objects.all())
    themas = serializers.SerializerMethodField()

    class Meta:
        model = FillInSentence
        fields = [
            "id",
            "verb",
            "sentence_template",
            "answer",
            "answer_form_key",
            "themas",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]
        extra_kwargs = {"themas": {"read_only": True}}

    def get_themas(self, instance: FillInSentence) -> list:
        return [
            {"id": lt.thema.id, "naam": lt.thema.naam}
            for lt in instance.thema_links.select_related("thema").all()
        ]

    def to_representation(self, instance: FillInSentence) -> dict:
        data = super().to_representation(instance)
        data["verb"] = {"id": instance.verb.id, "infinitive": instance.verb.infinitive}
        return data

    def validate(self, attrs: dict) -> dict:
        thema_ids = self.initial_data.get("thema_ids")
        if thema_ids is not None:
            if not isinstance(thema_ids, list):
                raise serializers.ValidationError(
                    {"thema_ids": "Moet een lijst van ids zijn."}
                )
            ids = []
            for x in thema_ids:
                try:
                    ids.append(int(x))
                except (TypeError, ValueError):
                    raise serializers.ValidationError(
                        {"thema_ids": "Ongeldige thema-id."}
                    )
            existing = set(Theme.objects.filter(id__in=ids).values_list("id", flat=True))
            if len(existing) != len(ids):
                raise serializers.ValidationError(
                    {"thema_ids": "Een of meer thema-ids bestaan niet."}
                )
            attrs["thema_ids"] = ids
        return attrs

    def create(self, validated_data: dict) -> FillInSentence:
        thema_ids = validated_data.pop("thema_ids", [])
        instance = super().create(validated_data)
        self._set_themas(instance, thema_ids)
        return instance

    def update(self, instance: FillInSentence, validated_data: dict) -> FillInSentence:
        thema_ids = validated_data.pop("thema_ids", None)
        instance = super().update(instance, validated_data)
        if thema_ids is not None:
            self._set_themas(instance, thema_ids)
        return instance

    def _set_themas(self, instance: FillInSentence, thema_ids: list) -> None:
        instance.thema_links.all().delete()
        for tid in thema_ids:
            InvulzinThema.objects.create(invulzin=instance, thema_id=tid)
