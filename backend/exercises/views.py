"""Exercise API: list/retrieve for all authenticated users; create for admin only."""

from rest_framework import status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from accounts.permissions import ADMIN_PERMISSION_CLASSES

from .models import Exercise
from .serializers import (
    CreateExerciseSerializer,
    ExerciseDoSerializer,
    ExerciseSerializer,
    build_nakijkmodel_response,
)
from .services import generate_exercise


class ExerciseViewSet(ModelViewSet):
    """
    List/retrieve: any authenticated user (do flow).
    Create: admin only (generate).
    Update/destroy: not exposed (http_method_names).
    """

    queryset = Exercise.objects.prefetch_related(
        "conjugation_items__verb",
        "fill_in_sentence_items__fill_in_sentence",
    ).all()
    http_method_names = ["get", "post"]

    def get_permissions(self):
        if self.action == "create":
            return [perm() for perm in ADMIN_PERMISSION_CLASSES]
        return [IsAuthenticated()]

    def get_serializer_class(self):
        if self.action == "retrieve":
            return ExerciseDoSerializer
        return ExerciseSerializer

    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        serializer = CreateExerciseSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        verb_ids = data.get("verb_ids")
        try:
            exercise = generate_exercise(
                exercise_type=data["exercise_type"],
                num_items=data["num_items"],
                user=request.user,
                verb_ids=verb_ids,
            )
        except ValueError as e:
            return Response(
                {"detail": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response(
            ExerciseSerializer(exercise).data,
            status=status.HTTP_201_CREATED,
        )

    @action(detail=True, methods=["get"], url_path="nakijkmodel")
    def nakijkmodel(self, request, pk=None):
        """GET /oefeningen/:id/nakijkmodel/ — correct answers for this exercise."""
        exercise = self.get_object()
        return Response(build_nakijkmodel_response(exercise))
