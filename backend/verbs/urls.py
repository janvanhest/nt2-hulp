from rest_framework.routers import DefaultRouter

from .views import VerbViewSet

router = DefaultRouter()
router.register("", VerbViewSet, basename="werkwoord")

urlpatterns = router.urls
