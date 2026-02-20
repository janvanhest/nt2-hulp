import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("verbs", "0003_add_answer_form_key"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Exercise",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("exercise_type", models.CharField(choices=[("vervoeging", "Vervoegingsoefening"), ("invulzin", "Invulzin-oefening")], max_length=20)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("user", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="exercises", to=settings.AUTH_USER_MODEL)),
            ],
            options={
                "verbose_name": "Oefening",
                "verbose_name_plural": "Oefeningen",
                "ordering": ["-created_at"],
            },
        ),
        migrations.CreateModel(
            name="ConjugationItem",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("order", models.PositiveSmallIntegerField()),
                ("exercise", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="conjugation_items", to="exercises.exercise")),
                ("verb", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="+", to="verbs.verb")),
            ],
            options={
                "verbose_name": "Vervoeging-item",
                "verbose_name_plural": "Vervoeging-items",
                "ordering": ["exercise", "order"],
            },
        ),
        migrations.CreateModel(
            name="FillInSentenceItem",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("order", models.PositiveSmallIntegerField()),
                ("exercise", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="fill_in_sentence_items", to="exercises.exercise")),
                ("fill_in_sentence", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="+", to="verbs.fillinsentence")),
            ],
            options={
                "verbose_name": "Invulzin-item",
                "verbose_name_plural": "Invulzin-items",
                "ordering": ["exercise", "order"],
            },
        ),
        migrations.CreateModel(
            name="Nakijkmodel",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("format", models.CharField(default="default", max_length=20)),
                ("exercise", models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name="answer_key", to="exercises.exercise")),
            ],
            options={
                "verbose_name": "Nakijkmodel",
                "verbose_name_plural": "Nakijkmodellen",
            },
        ),
        migrations.AddConstraint(
            model_name="conjugationitem",
            constraint=models.UniqueConstraint(fields=("exercise", "order"), name="exercises_conjugationitem_unique_exercise_order"),
        ),
        migrations.AddConstraint(
            model_name="fillinsentenceitem",
            constraint=models.UniqueConstraint(fields=("exercise", "order"), name="exercises_fillinsentenceitem_unique_exercise_order"),
        ),
    ]
