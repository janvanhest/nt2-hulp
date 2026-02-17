from django.urls import path

from . import beheer_views

app_name = "beheer_api"

urlpatterns = [
    path("", beheer_views.BeheerCheckView.as_view(), name="check"),
]
