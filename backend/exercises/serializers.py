"""Serializers for exercise create and read."""

from rest_framework import serializers

from .models import ConjugationItem, Exercise, ExerciseType, FillInSentenceItem


class CreateExerciseSerializer(serializers.Serializer):
    """Request body for POST: create one exercise."""

    exercise_type = serializers.ChoiceField(choices=ExerciseType.choices)
    num_items = serializers.IntegerField(min_value=1)
    verb_ids = serializers.ListField(
        child=serializers.IntegerField(),
        required=False,
        allow_empty=True,
    )


class ConjugationItemSerializer(serializers.ModelSerializer):
    """Read-only conjugation item (id, order, verb id)."""

    class Meta:
        model = ConjugationItem
        fields = ["id", "order", "verb"]


class FillInSentenceItemSerializer(serializers.ModelSerializer):
    """Read-only fill-in sentence item (id, order, fill_in_sentence id)."""

    class Meta:
        model = FillInSentenceItem
        fields = ["id", "order", "fill_in_sentence"]


class ExerciseSerializer(serializers.ModelSerializer):
    """Response: exercise with nested items (read-only)."""

    conjugation_items = ConjugationItemSerializer(many=True, read_only=True)
    fill_in_sentence_items = FillInSentenceItemSerializer(many=True, read_only=True)

    class Meta:
        model = Exercise
        fields = [
            "id",
            "exercise_type",
            "created_at",
            "conjugation_items",
            "fill_in_sentence_items",
        ]
        read_only_fields = fields


# --- Do-detail (prompts only, no answers) ---


class ConjugationItemDoSerializer(serializers.ModelSerializer):
    """Conjugation item with verb prompt (infinitive); no correct answers."""

    verb = serializers.SerializerMethodField()

    class Meta:
        model = ConjugationItem
        fields = ["id", "order", "verb"]

    def get_verb(self, item: ConjugationItem) -> dict:
        return {"id": item.verb_id, "infinitive": item.verb.infinitive}


class FillInSentenceItemDoSerializer(serializers.ModelSerializer):
    """Fill-in item with sentence prompt; no correct answer."""

    fill_in_sentence = serializers.SerializerMethodField()

    class Meta:
        model = FillInSentenceItem
        fields = ["id", "order", "fill_in_sentence"]

    def get_fill_in_sentence(self, item: FillInSentenceItem) -> dict:
        s = item.fill_in_sentence
        return {
            "id": s.id,
            "sentence_template": s.sentence_template,
            "answer_form_key": s.answer_form_key or "",
        }


class ExerciseDoSerializer(serializers.ModelSerializer):
    """Exercise detail for doing: items with prompts, no answers."""

    conjugation_items = ConjugationItemDoSerializer(many=True, read_only=True)
    fill_in_sentence_items = FillInSentenceItemDoSerializer(many=True, read_only=True)

    class Meta:
        model = Exercise
        fields = [
            "id",
            "exercise_type",
            "created_at",
            "conjugation_items",
            "fill_in_sentence_items",
        ]
        read_only_fields = fields


# --- Nakijkmodel (correct answers only) ---

VERB_FORM_KEYS = [
    "tt_ik",
    "tt_jij",
    "tt_hij",
    "vt_ev",
    "vt_mv",
    "vd",
    "vd_hulpwerkwoord",
]


def build_nakijkmodel_response(exercise: Exercise) -> dict:
    """
    Build nakijkmodel payload from exercise items (no extra DB model for answers).
    Returns conjugation_items and/or fill_in_sentence_items with correct answers.
    """
    result: dict = {"exercise_id": exercise.id, "exercise_type": exercise.exercise_type}

    if exercise.exercise_type == ExerciseType.vervoeging:
        items = list(
            exercise.conjugation_items.select_related("verb__forms").order_by("order")
        )
        result["conjugation_items"] = []
        for item in items:
            forms_obj = getattr(item.verb, "forms", None)
            forms_dict = (
                {key: getattr(forms_obj, key, "") for key in VERB_FORM_KEYS}
                if forms_obj
                else {key: "" for key in VERB_FORM_KEYS}
            )
            result["conjugation_items"].append(
                {
                    "id": item.id,
                    "order": item.order,
                    "verb_id": item.verb_id,
                    "infinitive": item.verb.infinitive,
                    "forms": forms_dict,
                }
            )
        result["fill_in_sentence_items"] = []
    else:
        items = list(
            exercise.fill_in_sentence_items.select_related("fill_in_sentence").order_by(
                "order"
            )
        )
        result["conjugation_items"] = []
        result["fill_in_sentence_items"] = [
            {
                "id": item.id,
                "order": item.order,
                "fill_in_sentence_id": item.fill_in_sentence_id,
                "sentence_template": item.fill_in_sentence.sentence_template,
                "answer": item.fill_in_sentence.answer,
            }
            for item in items
        ]
    return result
