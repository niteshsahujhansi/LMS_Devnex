from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from django.contrib import admin

from django.urls import path, include
from rest_framework_swagger.views import get_swagger_view

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

schema_view = get_schema_view(
    openapi.Info(
        title="Library API",
        default_version='v1',
        description="API documentation for the Library System",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="contact@library.local"),
        license=openapi.License(name="MIT License"),
    ),
    public=True,
    # permission_classes=(IsAuthenticated,),
    authentication_classes=(JWTAuthentication,)
)

urlpatterns = [
    # Other URLs
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    path('api/', include('library.urls')),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('admin/', admin.site.urls),
    
]


# from django.urls import path, include
# from rest_framework_swagger.views import get_swagger_view

# schema_view = get_swagger_view(title='Library API')

# urlpatterns = [
#     # path('admin/', admin.site.urls),
#     path('swagger/', schema_view),
#     path('api/', include('library.urls')),
# ]




