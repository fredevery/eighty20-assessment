# from django.contrib.auth import get_user_model
# from django.contrib.auth import views as auth_views
# from django.shortcuts import redirect
from rest_framework import permissions, views
from rest_framework.response import Response

from .serializers import UserSerializer


class UserView(views.APIView):
    """
    View to retrieve the current authenticated user.
    """

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if not request.user.is_authenticated:
            return Response({"detail": "Authentication credentials were not provided."}, status=401)

        serializer = UserSerializer(request.user)
        return Response(serializer.data)
