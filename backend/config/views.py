"""
Project-level views. Kept minimal; app views live in their apps.
"""

from django.http import JsonResponse


def api_root(request):
    """
    GET /: discoverable API info (links to main entry points).
    Single source of truth for advertised endpoints; update here when adding top-level routes.
    """
    return JsonResponse(
        {
            "name": "NT-2 API",
            "endpoints": {
                "auth": "/api/auth/",
                "admin": "/admin/",
            },
        }
    )
