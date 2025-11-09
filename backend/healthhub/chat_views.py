from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.conf import settings
import logging

logger = logging.getLogger(__name__)


class ChatAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        message = request.data.get('message', '')

        # Default placeholder reply
        ai_reply = "This is an AI response placeholder"

        # Conditional OpenAI call (non-breaking if not configured)
        if getattr(settings, 'AI_CHAT_ENABLED', False) and getattr(settings, 'OPENAI_API_KEY', ''):
            try:
                # Lazy import so package is optional until user installs it
                from openai import OpenAI
                client = OpenAI(api_key=settings.OPENAI_API_KEY)

                # Minimal chat completion request; model configurable via env
                model_name = getattr(settings, 'OPENAI_MODEL', 'gpt-4o-mini')
                completion = client.chat.completions.create(
                    model=model_name,
                    messages=[
                        {"role": "system", "content": "You are a helpful healthcare information assistant. You provide general information and disclaimers. You do not provide medical diagnosis."},
                        {"role": "user", "content": str(message)},
                    ],
                    temperature=0.2,
                )
                content = completion.choices[0].message.content if completion.choices else None
                if content:
                    ai_reply = content
            except Exception as exc:
                # Log and gracefully fall back to placeholder
                logger.warning("OpenAI call failed, falling back to placeholder: %s", exc)

        return Response({
            'reply': ai_reply,
            'echo': message,
        }, status=status.HTTP_200_OK)


