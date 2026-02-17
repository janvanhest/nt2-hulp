from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .permissions import IsBeheerder


class BeheerCheckView(APIView):
    """
    GET stub to verify beheerder-only access. Returns 200 with {"ok": true} for beheerders.
    Used for Epic 1 Fase 2 verification; future werkwoorden/zinnen endpoints use the same permissions.
    """

    permission_classes = [IsAuthenticated, IsBeheerder]

    def get(self, request):
        return Response({"ok": True})
