from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from entries.views import EntryViewSet

router = DefaultRouter()
router.register(r'entries', EntryViewSet, basename='entry')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api-auth/', include('rest_framework.urls')),
]