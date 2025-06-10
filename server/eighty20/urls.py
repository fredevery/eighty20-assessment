from django.contrib import admin
from django.urls import path
from rest_framework_simplejwt import views as jwt_views
from users.views import UserView

urlpatterns = [
    path("admin/", admin.site.urls),
    path(
        "api/auth/login",
        jwt_views.TokenObtainPairView.as_view(),
        name="token_obtain_pair",
    ),
    path(
        "api/auth/refresh",
        jwt_views.TokenRefreshView.as_view(),
        name="token_refresh",
    ),
    path(
        "api/auth/logout",
        jwt_views.TokenBlacklistView.as_view(),
        name="token_blacklist",
    ),
    path("api/users/me", UserView.as_view(), name="user-view"),
]
