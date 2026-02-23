from django.urls import include, path

from . import admin_views

app_name = "admin_api"

urlpatterns = [
    path("", admin_views.AdminCheckView.as_view(), name="check"),
    path("werkwoorden/", include("verbs.urls")),
    path("invulzinnen/", include("verbs.invulzinnen_urls")),
    path("themas/", include("verbs.themas_urls")),
    path("oefeningen/", include("exercises.urls")),
]
