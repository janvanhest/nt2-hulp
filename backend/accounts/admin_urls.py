from django.urls import include, path

from . import admin_views

app_name = "admin_api"

urlpatterns = [
    path("", admin_views.AdminCheckView.as_view(), name="check"),
    path("werkwoorden/", include("verbs.urls")),
]
