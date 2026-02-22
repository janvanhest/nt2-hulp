from rest_framework.routers import DefaultRouter

from .views import ThemeViewSet

router = DefaultRouter()
router.register("", ThemeViewSet, basename="thema")

urlpatterns = router.urls
