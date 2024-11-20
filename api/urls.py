from django.urls import path
from .views import ProjectView, UserView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('projects/', ProjectView.as_view(), name='project-list'),
    path('projects/<int:pk>/', ProjectView.as_view(), name='project-detail'),
    path('users/', UserView.as_view(), name='user-list'),
    path('users/<int:pk>/', UserView.as_view(), name='user-detail'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),   
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),   

]
