from rest_framework.viewsets import ModelViewSet

from accounts.permissions import ADMIN_PERMISSION_CLASSES

from .models import Verb
from .serializers import VerbSerializer


class VerbViewSet(ModelViewSet):
    queryset = Verb.objects.select_related("forms").all()
    serializer_class = VerbSerializer
    permission_classes = ADMIN_PERMISSION_CLASSES
