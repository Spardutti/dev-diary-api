from rest_framework.views import APIView
from rest_framework import status

from ..serializers import UserSerializer
from ..utils.custom_response import CustomResponse
from ..utils.error_response import ErrorResponse
from ..utils.guest_account import get_or_create_guest_user
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny

from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework import status

from ..serializers import UserSerializer
from ..utils.custom_response import CustomResponse
from ..utils.error_response import ErrorResponse
from ..utils.guest_account import get_or_create_guest_user
from rest_framework_simplejwt.tokens import RefreshToken


class GuestView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            user = get_or_create_guest_user()

            if user is None:
                return ErrorResponse("Error creating guest user", status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            serializer = UserSerializer(user)

            refresh = RefreshToken.for_user(user)
            token_data = {
                "refresh": str(refresh),
                "access": str(refresh.access_token)  # type: ignore
            }

            return CustomResponse(
                {"user": serializer.data, "token": token_data},
                status=status.HTTP_201_CREATED
            )

        except ValueError:
            return ErrorResponse("Invalid data", status=status.HTTP_400_BAD_REQUEST)
