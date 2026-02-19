"""
Seed initial development data: 3 verbs with full forms and 2–3 fill-in sentences per form.

Idempotent: only creates verbs that do not yet exist (by infinitive).
Re-running with existing data leaves it unchanged.
"""

from django.core.management.base import BaseCommand
from django.db import transaction

from verbs.models import AnswerFormKey, FillInSentence, Verb, VerbForm, VdHulp


# (infinitive, tt_ik, tt_jij, tt_hij, vt_ev, vt_mv, vd, vd_hulpwerkwoord)
VERB_FORMS = [
    ("lopen", "loop", "loopt", "loopt", "liep", "liepen", "gelopen", VdHulp.zijn.value),
    ("zwemmen", "zwem", "zwemt", "zwemt", "zwom", "zwommen", "gezwommen", VdHulp.zijn.value),
    ("fietsen", "fiets", "fietst", "fietst", "fietste", "fietsten", "gefietst", VdHulp.hebben.value),
]

# Per infinitive: list of (sentence_template, answer, answer_form_key). 2 per werkwoordsvorm (incl. vd_hulpwerkwoord en infinitive).
SENTENCES_BY_VERB: dict[str, list[tuple[str, str, str]]] = {
    "lopen": [
        ("Ik ___ elke ochtend naar school.", "loop", AnswerFormKey.tt_ik),
        ("Elke dag ___ ik door het park.", "loop", AnswerFormKey.tt_ik),
        ("Hoe ___ jij zo snel?", "loopt", AnswerFormKey.tt_jij),
        ("Jij ___ altijd te hard.", "loopt", AnswerFormKey.tt_jij),
        ("Hij ___ naar de bus.", "loopt", AnswerFormKey.tt_hij),
        ("Mijn broer ___ elke dag hard.", "loopt", AnswerFormKey.tt_hij),
        ("Gisteren ___ hij in het bos.", "liep", AnswerFormKey.vt_ev),
        ("Vorig jaar ___ zij de marathon.", "liep", AnswerFormKey.vt_ev),
        ("Wij ___ vroeger vaak samen.", "liepen", AnswerFormKey.vt_mv),
        ("De kinderen ___ naar huis.", "liepen", AnswerFormKey.vt_mv),
        ("Wij hebben tien kilometer ___.", "gelopen", AnswerFormKey.vd),
        ("Ze is gisteren naar de winkel ___.", "gelopen", AnswerFormKey.vd),
        ("Bij 'gelopen' hoort het hulpwerkwoord ___.", "zijn", AnswerFormKey.vd_hulpwerkwoord),
        ("Het voltooid deelwoord 'gelopen' wordt met ___ gevormd.", "zijn", AnswerFormKey.vd_hulpwerkwoord),
        ("Ik wil graag ___.", "lopen", AnswerFormKey.infinitive),
        ("Ze kunnen niet goed ___.", "lopen", AnswerFormKey.infinitive),
    ],
    "zwemmen": [
        ("Ik ___ graag in zee.", "zwem", AnswerFormKey.tt_ik),
        ("Elke zomer ___ ik in het meer.", "zwem", AnswerFormKey.tt_ik),
        ("___ jij weleens in de rivier?", "zwem", AnswerFormKey.tt_jij),
        ("Jij ___ heel goed.", "zwemt", AnswerFormKey.tt_jij),
        ("Zij ___ elke week in het zwembad.", "zwemt", AnswerFormKey.tt_hij),
        ("Mijn zus ___ voor de wedstrijd.", "zwemt", AnswerFormKey.tt_hij),
        ("Vorig jaar ___ hij de oversteek.", "zwom", AnswerFormKey.vt_ev),
        ("Hij ___ gisteren een uur.", "zwom", AnswerFormKey.vt_ev),
        ("Wij ___ vroeger in dat meer.", "zwommen", AnswerFormKey.vt_mv),
        ("De honden ___ in de vijver.", "zwommen", AnswerFormKey.vt_mv),
        ("Hij is gisteren ___ in het meer.", "gezwommen", AnswerFormKey.vd),
        ("Ze zijn een half uur ___.", "gezwommen", AnswerFormKey.vd),
        ("Bij 'gezwommen' hoort het hulpwerkwoord ___.", "zijn", AnswerFormKey.vd_hulpwerkwoord),
        ("Het voltooid deelwoord 'gezwommen' wordt met ___ gevormd.", "zijn", AnswerFormKey.vd_hulpwerkwoord),
        ("Ik leer ___.", "zwemmen", AnswerFormKey.infinitive),
        ("Zij willen morgen ___.", "zwemmen", AnswerFormKey.infinitive),
    ],
    "fietsen": [
        ("Ik ___ naar mijn werk.", "fiets", AnswerFormKey.tt_ik),
        ("Elke dag ___ ik door de stad.", "fiets", AnswerFormKey.tt_ik),
        ("___ jij vaak naar school?", "fiets", AnswerFormKey.tt_jij),
        ("Jij ___ altijd te snel.", "fietst", AnswerFormKey.tt_jij),
        ("Hij ___ door het park.", "fietst", AnswerFormKey.tt_hij),
        ("Mijn vader ___ elke ochtend.", "fietst", AnswerFormKey.tt_hij),
        ("Gisteren ___ ze naar Amsterdam.", "fietste", AnswerFormKey.vt_ev),
        ("Vorig jaar ___ hij de tocht alleen.", "fietste", AnswerFormKey.vt_ev),
        ("Wij ___ vroeger naar het strand.", "fietsten", AnswerFormKey.vt_mv),
        ("De kinderen ___ naar school.", "fietsten", AnswerFormKey.vt_mv),
        ("Ze heeft vorige week ___ naar Amsterdam.", "gefietst", AnswerFormKey.vd),
        ("Ze hebben 50 kilometer ___.", "gefietst", AnswerFormKey.vd),
        ("Bij 'gefietst' hoort het hulpwerkwoord ___.", "hebben", AnswerFormKey.vd_hulpwerkwoord),
        ("Het voltooid deelwoord 'gefietst' wordt met ___ gevormd.", "hebben", AnswerFormKey.vd_hulpwerkwoord),
        ("Ik wil graag ___.", "fietsen", AnswerFormKey.infinitive),
        ("Ze kunnen goed ___.", "fietsen", AnswerFormKey.infinitive),
    ],
}


class Command(BaseCommand):
    help = "Seed 3 sample verbs with full forms and 2 sentences per form (incl. vd_hulpwerkwoord en infinitive). Idempotent (skips existing verbs)."

    def handle(self, *args, **options):
        created_count = 0
        with transaction.atomic():
            for infinitive, tt_ik, tt_jij, tt_hij, vt_ev, vt_mv, vd, vd_hulp in VERB_FORMS:
                if Verb.objects.filter(infinitive=infinitive).exists():
                    continue
                verb = Verb.objects.create(infinitive=infinitive)
                VerbForm.objects.create(
                    verb=verb,
                    tt_ik=tt_ik,
                    tt_jij=tt_jij,
                    tt_hij=tt_hij,
                    vt_ev=vt_ev,
                    vt_mv=vt_mv,
                    vd=vd,
                    vd_hulpwerkwoord=vd_hulp,
                )
                for sentence_template, answer, answer_form_key in SENTENCES_BY_VERB.get(
                    infinitive, []
                ):
                    FillInSentence.objects.create(
                        verb=verb,
                        sentence_template=sentence_template,
                        answer=answer,
                        answer_form_key=answer_form_key,
                    )
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(f"Created verb '{infinitive}' with forms and sentences.")
                )
        if created_count == 0:
            self.stdout.write("No new verbs created (all 3 already exist).")
        else:
            self.stdout.write(self.style.SUCCESS(f"Seeded {created_count} verb(s)."))
