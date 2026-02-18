from rest_framework.viewsets import ModelViewSet

from accounts.permissions import ADMIN_PERMISSION_CLASSES

from .models import FillInSentence, Verb
from .serializers import FillInSentenceSerializer, VerbSerializer


class VerbViewSet(ModelViewSet):
    queryset = Verb.objects.select_related("forms").all()
    serializer_class = VerbSerializer
    permission_classes = ADMIN_PERMISSION_CLASSES


class FillInSentenceViewSet(ModelViewSet):
    serializer_class = FillInSentenceSerializer
    permission_classes = ADMIN_PERMISSION_CLASSES

    def get_queryset(self):
        qs = FillInSentence.objects.select_related("verb").all()
        verb_id = self.request.query_params.get("verb")
        if verb_id is not None:
            try:
                qs = qs.filter(verb_id=int(verb_id))
            except ValueError:
                pass
        return qs
