from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from ..serializers import UserSerializer
from ..utils.custom_response import CustomResponse
from ..utils.error_response import ErrorResponse

class UserView(APIView):
    def post(self, request):
        try:
            serializer = UserSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return CustomResponse(serializer.data, status=status.HTTP_201_CREATED)

            return ErrorResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        except ValueError:
            return ErrorResponse("Invalid data", status=status.HTTP_400_BAD_REQUEST)