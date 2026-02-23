# Generated manually for Theme and InvulzinThema

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('verbs', '0004_alter_fillinsentence_answer_form_key'),
    ]

    operations = [
        migrations.CreateModel(
            name='Theme',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('naam', models.CharField(max_length=100, unique=True)),
            ],
            options={
                'verbose_name': 'Thema',
                'verbose_name_plural': "Thema's",
            },
        ),
        migrations.CreateModel(
            name='InvulzinThema',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('invulzin', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='thema_links', to='verbs.fillinsentence')),
                ('thema', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='invulzin_links', to='verbs.theme')),
            ],
            options={
                'verbose_name': 'Invulzin-thema',
                'verbose_name_plural': "Invulzin-thema's",
            },
        ),
        migrations.AddConstraint(
            model_name='invulzinthema',
            constraint=models.UniqueConstraint(fields=('invulzin', 'thema'), name='unique_invulzin_thema'),
        ),
    ]
