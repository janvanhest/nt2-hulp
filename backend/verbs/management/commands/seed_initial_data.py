"""
Seed initial development data: 10 verbs with full forms and 2–3 fill-in sentences per form.

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
    ("komen", "kom", "komt", "komt", "kwam", "kwamen", "gekomen", VdHulp.zijn.value),
    ("gaan", "ga", "gaat", "gaat", "ging", "gingen", "gegaan", VdHulp.zijn.value),
    ("doen", "doe", "doet", "doet", "deed", "deden", "gedaan", VdHulp.hebben.value),
    ("zien", "zie", "ziet", "ziet", "zag", "zagen", "gezien", VdHulp.hebben.value),
    ("maken", "maak", "maakt", "maakt", "maakte", "maakten", "gemaakt", VdHulp.hebben.value),
    ("lezen", "lees", "leest", "leest", "las", "lazen", "gelezen", VdHulp.hebben.value),
    ("schrijven", "schrijf", "schrijft", "schrijft", "schreef", "schreven", "geschreven", VdHulp.hebben.value),
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
    "komen": [
        ("Ik ___ vanavond laat thuis.", "kom", AnswerFormKey.tt_ik),
        ("Morgen ___ ik op bezoek.", "kom", AnswerFormKey.tt_ik),
        ("Wanneer ___ jij terug?", "komt", AnswerFormKey.tt_jij),
        ("Jij ___ altijd te laat.", "komt", AnswerFormKey.tt_jij),
        ("Hij ___ uit Amsterdam.", "komt", AnswerFormKey.tt_hij),
        ("Mijn vriend ___ morgen langs.", "komt", AnswerFormKey.tt_hij),
        ("Gisteren ___ hij niet opdagen.", "kwam", AnswerFormKey.vt_ev),
        ("Vorig jaar ___ zij op bezoek.", "kwam", AnswerFormKey.vt_ev),
        ("Wij ___ vroeger vaak samen.", "kwamen", AnswerFormKey.vt_mv),
        ("De gasten ___ op tijd.", "kwamen", AnswerFormKey.vt_mv),
        ("Ze is gisteren ___.", "gekomen", AnswerFormKey.vd),
        ("Ze zijn net ___.", "gekomen", AnswerFormKey.vd),
        ("Bij 'gekomen' hoort het hulpwerkwoord ___.", "zijn", AnswerFormKey.vd_hulpwerkwoord),
        ("Het voltooid deelwoord 'gekomen' wordt met ___ gevormd.", "zijn", AnswerFormKey.vd_hulpwerkwoord),
        ("Ik wil graag ___.", "komen", AnswerFormKey.infinitive),
        ("Ze hopen morgen ___.", "komen", AnswerFormKey.infinitive),
    ],
    "gaan": [
        ("Ik ___ naar school.", "ga", AnswerFormKey.tt_ik),
        ("Elke dag ___ ik sporten.", "ga", AnswerFormKey.tt_ik),
        ("Waar ___ jij naartoe?", "gaat", AnswerFormKey.tt_jij),
        ("Jij ___ altijd weg.", "gaat", AnswerFormKey.tt_jij),
        ("Hij ___ naar de winkel.", "gaat", AnswerFormKey.tt_hij),
        ("Mijn zus ___ op reis.", "gaat", AnswerFormKey.tt_hij),
        ("Gisteren ___ hij alleen.", "ging", AnswerFormKey.vt_ev),
        ("Vorig jaar ___ zij naar Spanje.", "ging", AnswerFormKey.vt_ev),
        ("Wij ___ vroeger vaak wandelen.", "gingen", AnswerFormKey.vt_mv),
        ("De kinderen ___ naar huis.", "gingen", AnswerFormKey.vt_mv),
        ("Ze is gisteren ___.", "gegaan", AnswerFormKey.vd),
        ("Ze zijn naar de film ___.", "gegaan", AnswerFormKey.vd),
        ("Bij 'gegaan' hoort het hulpwerkwoord ___.", "zijn", AnswerFormKey.vd_hulpwerkwoord),
        ("Het voltooid deelwoord 'gegaan' wordt met ___ gevormd.", "zijn", AnswerFormKey.vd_hulpwerkwoord),
        ("Ik wil ___.", "gaan", AnswerFormKey.infinitive),
        ("Ze kunnen niet ___.", "gaan", AnswerFormKey.infinitive),
    ],
    "doen": [
        ("Ik ___ mijn best.", "doe", AnswerFormKey.tt_ik),
        ("Elke dag ___ ik de afwas.", "doe", AnswerFormKey.tt_ik),
        ("Wat ___ jij vanavond?", "doet", AnswerFormKey.tt_jij),
        ("Jij ___ altijd je huiswerk.", "doet", AnswerFormKey.tt_jij),
        ("Hij ___ zijn werk goed.", "doet", AnswerFormKey.tt_hij),
        ("Mijn broer ___ aan sport.", "doet", AnswerFormKey.tt_hij),
        ("Gisteren ___ hij de boodschappen.", "deed", AnswerFormKey.vt_ev),
        ("Vorig jaar ___ zij een cursus.", "deed", AnswerFormKey.vt_ev),
        ("Wij ___ vroeger samen klussen.", "deden", AnswerFormKey.vt_mv),
        ("De leerlingen ___ hun best.", "deden", AnswerFormKey.vt_mv),
        ("Ze heeft haar werk ___.", "gedaan", AnswerFormKey.vd),
        ("Ze hebben het ___.", "gedaan", AnswerFormKey.vd),
        ("Bij 'gedaan' hoort het hulpwerkwoord ___.", "hebben", AnswerFormKey.vd_hulpwerkwoord),
        ("Het voltooid deelwoord 'gedaan' wordt met ___ gevormd.", "hebben", AnswerFormKey.vd_hulpwerkwoord),
        ("Ik wil het ___.", "doen", AnswerFormKey.infinitive),
        ("Ze kunnen het niet ___.", "doen", AnswerFormKey.infinitive),
    ],
    "zien": [
        ("Ik ___ je morgen.", "zie", AnswerFormKey.tt_ik),
        ("Elke dag ___ ik hem.", "zie", AnswerFormKey.tt_ik),
        ("___ jij dat ook?", "ziet", AnswerFormKey.tt_jij),
        ("Jij ___ er goed uit.", "ziet", AnswerFormKey.tt_jij),
        ("Hij ___ de vogel.", "ziet", AnswerFormKey.tt_hij),
        ("Mijn moeder ___ het niet.", "ziet", AnswerFormKey.tt_hij),
        ("Gisteren ___ hij een film.", "zag", AnswerFormKey.vt_ev),
        ("Vorig jaar ___ zij hem niet.", "zag", AnswerFormKey.vt_ev),
        ("Wij ___ vroeger veel samen.", "zagen", AnswerFormKey.vt_mv),
        ("De kinderen ___ een konijn.", "zagen", AnswerFormKey.vt_mv),
        ("Ze heeft hem ___.", "gezien", AnswerFormKey.vd),
        ("Ze hebben het ___.", "gezien", AnswerFormKey.vd),
        ("Bij 'gezien' hoort het hulpwerkwoord ___.", "hebben", AnswerFormKey.vd_hulpwerkwoord),
        ("Het voltooid deelwoord 'gezien' wordt met ___ gevormd.", "hebben", AnswerFormKey.vd_hulpwerkwoord),
        ("Ik wil het ___.", "zien", AnswerFormKey.infinitive),
        ("Ze kunnen het niet ___.", "zien", AnswerFormKey.infinitive),
    ],
    "maken": [
        ("Ik ___ een taart.", "maak", AnswerFormKey.tt_ik),
        ("Elke week ___ ik schoon.", "maak", AnswerFormKey.tt_ik),
        ("Wat ___ jij vanavond?", "maakt", AnswerFormKey.tt_jij),
        ("Jij ___ altijd lawaai.", "maakt", AnswerFormKey.tt_jij),
        ("Hij ___ zijn huiswerk.", "maakt", AnswerFormKey.tt_hij),
        ("Mijn vader ___ de tuin.", "maakt", AnswerFormKey.tt_hij),
        ("Gisteren ___ hij een fout.", "maakte", AnswerFormKey.vt_ev),
        ("Vorig jaar ___ zij een reis.", "maakte", AnswerFormKey.vt_ev),
        ("Wij ___ vroeger muziek.", "maakten", AnswerFormKey.vt_mv),
        ("De leerlingen ___ oefeningen.", "maakten", AnswerFormKey.vt_mv),
        ("Ze heeft het ___.", "gemaakt", AnswerFormKey.vd),
        ("Ze hebben hun werk ___.", "gemaakt", AnswerFormKey.vd),
        ("Bij 'gemaakt' hoort het hulpwerkwoord ___.", "hebben", AnswerFormKey.vd_hulpwerkwoord),
        ("Het voltooid deelwoord 'gemaakt' wordt met ___ gevormd.", "hebben", AnswerFormKey.vd_hulpwerkwoord),
        ("Ik wil het ___.", "maken", AnswerFormKey.infinitive),
        ("Ze kunnen het ___.", "maken", AnswerFormKey.infinitive),
    ],
    "lezen": [
        ("Ik ___ elke avond.", "lees", AnswerFormKey.tt_ik),
        ("Elke dag ___ ik de krant.", "lees", AnswerFormKey.tt_ik),
        ("___ jij dit boek?", "leest", AnswerFormKey.tt_jij),
        ("Jij ___ te snel.", "leest", AnswerFormKey.tt_jij),
        ("Hij ___ een brief.", "leest", AnswerFormKey.tt_hij),
        ("Mijn zus ___ graag.", "leest", AnswerFormKey.tt_hij),
        ("Gisteren ___ hij het artikel.", "las", AnswerFormKey.vt_ev),
        ("Vorig jaar ___ zij dat boek.", "las", AnswerFormKey.vt_ev),
        ("Wij ___ vroeger samen.", "lazen", AnswerFormKey.vt_mv),
        ("De kinderen ___ strips.", "lazen", AnswerFormKey.vt_mv),
        ("Ze heeft het ___.", "gelezen", AnswerFormKey.vd),
        ("Ze hebben de krant ___.", "gelezen", AnswerFormKey.vd),
        ("Bij 'gelezen' hoort het hulpwerkwoord ___.", "hebben", AnswerFormKey.vd_hulpwerkwoord),
        ("Het voltooid deelwoord 'gelezen' wordt met ___ gevormd.", "hebben", AnswerFormKey.vd_hulpwerkwoord),
        ("Ik wil graag ___.", "lezen", AnswerFormKey.infinitive),
        ("Ze kunnen niet ___.", "lezen", AnswerFormKey.infinitive),
    ],
    "schrijven": [
        ("Ik ___ een brief.", "schrijf", AnswerFormKey.tt_ik),
        ("Elke week ___ ik een mail.", "schrijf", AnswerFormKey.tt_ik),
        ("___ jij een boek?", "schrijft", AnswerFormKey.tt_jij),
        ("Jij ___ altijd netjes.", "schrijft", AnswerFormKey.tt_jij),
        ("Hij ___ een artikel.", "schrijft", AnswerFormKey.tt_hij),
        ("Mijn broer ___ gedichten.", "schrijft", AnswerFormKey.tt_hij),
        ("Gisteren ___ hij een brief.", "schreef", AnswerFormKey.vt_ev),
        ("Vorig jaar ___ zij een roman.", "schreef", AnswerFormKey.vt_ev),
        ("Wij ___ vroeger brieven.", "schreven", AnswerFormKey.vt_mv),
        ("De leerlingen ___ een opstel.", "schreven", AnswerFormKey.vt_mv),
        ("Ze heeft het ___.", "geschreven", AnswerFormKey.vd),
        ("Ze hebben een boek ___.", "geschreven", AnswerFormKey.vd),
        ("Bij 'geschreven' hoort het hulpwerkwoord ___.", "hebben", AnswerFormKey.vd_hulpwerkwoord),
        ("Het voltooid deelwoord 'geschreven' wordt met ___ gevormd.", "hebben", AnswerFormKey.vd_hulpwerkwoord),
        ("Ik wil ___.", "schrijven", AnswerFormKey.infinitive),
        ("Ze kunnen goed ___.", "schrijven", AnswerFormKey.infinitive),
    ],
}


class Command(BaseCommand):
    help = "Seed 10 sample verbs with full forms and 2 sentences per form (incl. vd_hulpwerkwoord en infinitive). Idempotent (skips existing verbs)."

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
            self.stdout.write("No new verbs created (all 10 already exist).")
        else:
            self.stdout.write(self.style.SUCCESS(f"Seeded {created_count} verb(s)."))
