from rest_framework.response import Response
from rest_framework.views import APIView

from .permissions import BEHEER_PERMISSION_CLASSES


class BeheerCheckView(APIView):
    """
    GET stub to verify beheerder-only access. Returns 200 with {"ok": true} for beheerders.
    Used for Epic 1 Fase 2 verification; future werkwoorden/zinnen endpoints use the same permissions.
    """

    permission_classes = BEHEER_PERMISSION_CLASSES

    def get(self, request):
        return Response({"ok": True})
