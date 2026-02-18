from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Verb",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("infinitive", models.CharField(max_length=100, unique=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={
                "verbose_name": "Werkwoord",
                "verbose_name_plural": "Werkwoorden",
            },
        ),
        migrations.CreateModel(
            name="VerbForm",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("tt_ik", models.CharField(blank=True, default="", max_length=100)),
                ("tt_jij", models.CharField(blank=True, default="", max_length=100)),
                ("tt_hij", models.CharField(blank=True, default="", max_length=100)),
                ("vt_ev", models.CharField(blank=True, default="", max_length=100)),
                ("vt_mv", models.CharField(blank=True, default="", max_length=100)),
                ("vd", models.CharField(blank=True, default="", max_length=100)),
                (
                    "vd_hulpwerkwoord",
                    models.CharField(
                        blank=True,
                        choices=[("hebben", "hebben"), ("zijn", "zijn")],
                        default="",
                        max_length=10,
                    ),
                ),
                (
                    "verb",
                    models.OneToOneField(
                        on_delete=models.CASCADE,
                        related_name="forms",
                        to="verbs.verb",
                    ),
                ),
            ],
            options={
                "verbose_name": "Werkwoordsvorm",
                "verbose_name_plural": "Werkwoordsvormen",
            },
        ),
    ]
