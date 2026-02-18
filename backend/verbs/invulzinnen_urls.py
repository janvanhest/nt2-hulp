from rest_framework.routers import DefaultRouter

from .views import FillInSentenceViewSet

router = DefaultRouter()
router.register("", FillInSentenceViewSet, basename="invulzin")

urlpatterns = router.urls
