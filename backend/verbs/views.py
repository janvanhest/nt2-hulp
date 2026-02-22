from rest_framework.viewsets import ModelViewSet

from accounts.permissions import ADMIN_PERMISSION_CLASSES

from .models import FillInSentence, Theme, Verb
from .serializers import FillInSentenceSerializer, ThemeSerializer, VerbSerializer


class VerbViewSet(ModelViewSet):
    queryset = Verb.objects.select_related("forms").all()
    serializer_class = VerbSerializer
    permission_classes = ADMIN_PERMISSION_CLASSES


class ThemeViewSet(ModelViewSet):
    queryset = Theme.objects.all().order_by("naam")
    serializer_class = ThemeSerializer
    permission_classes = ADMIN_PERMISSION_CLASSES


class FillInSentenceViewSet(ModelViewSet):
    serializer_class = FillInSentenceSerializer
    permission_classes = ADMIN_PERMISSION_CLASSES

    def get_queryset(self):
        qs = (
            FillInSentence.objects.select_related("verb")
            .prefetch_related("thema_links__thema")
            .all()
        )
        verb_id = self.request.query_params.get("verb")
        if verb_id is not None:
            try:
                qs = qs.filter(verb_id=int(verb_id))
            except ValueError:
                pass
        return qs
