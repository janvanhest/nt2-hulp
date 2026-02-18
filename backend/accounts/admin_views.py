from rest_framework.response import Response
from rest_framework.views import APIView

from .permissions import ADMIN_PERMISSION_CLASSES


class AdminCheckView(APIView):
    """
    GET stub to verify admin-only access. Returns 200 with {"ok": true} for admins.
    """

    permission_classes = ADMIN_PERMISSION_CLASSES

    def get(self, request):
        return Response({"ok": True})
