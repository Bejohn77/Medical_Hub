from django.urls import path
from .chat_views import ChatAPIView


urlpatterns = [
    path('', ChatAPIView.as_view(), name='chat'),
]




