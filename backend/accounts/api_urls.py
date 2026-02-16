from django.urls import path

from . import api_views

app_name = "accounts_api"

urlpatterns = [
    path("login/", api_views.LoginView.as_view(), name="login"),
    path("logout/", api_views.LogoutView.as_view(), name="logout"),
    path("me/", api_views.MeView.as_view(), name="me"),
]
