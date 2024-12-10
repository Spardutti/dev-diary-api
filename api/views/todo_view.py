from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from ..serializers import TodoSerializer
from ..utils.custom_response import CustomResponse
from ..utils.error_response import ErrorResponse
from ..models import Todo

class TodoView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk=None):
        try:
            if pk is not None:
                todo = Todo.objects.get(pk=pk)
                serializer = TodoSerializer(todo)
                return CustomResponse(serializer.data, status=status.HTTP_200_OK)
            
            project_id = request.query_params.get('project_id', None)
            
            todos = Todo.objects.filter(project=project_id)

            serializer = TodoSerializer(todos, many=True)
            return CustomResponse(serializer.data, status=status.HTTP_200_OK)

        except Todo.DoesNotExist:
            return ErrorResponse("Todo not found", status=status.HTTP_404_NOT_FOUND)
        

    def post(self, request):
        try:
            serializer = TodoSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return CustomResponse(serializer.data, status=status.HTTP_201_CREATED)

            return ErrorResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        except ValueError:
            return ErrorResponse("Invalid data", status=status.HTTP_400_BAD_REQUEST)
        

    def patch(self, request, pk=None):
        pass

    def delete(self, request, pk=None):
        pass

