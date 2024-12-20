from ..serializers import DailyNoteSerializer
from ..models import DailyNote
from ..utils.group_by_month import group_by_month
from rest_framework.permissions import IsAuthenticated
from django.db.models.functions import TruncMonth
from rest_framework import generics
from rest_framework.exceptions import ValidationError
from django.db.models.functions import TruncMonth
from rest_framework.exceptions import ValidationError

class DailyNoteView(generics.ListCreateAPIView):
    queryset = DailyNote.objects.all()
    serializer_class = DailyNoteSerializer
    permission_classes = [IsAuthenticated]

    filterset_fields = ['project', 'date']

    ordering_fields = ['created_at', 'updated_at']
    ordering = ['-created_at'] 

    def get_queryset(self):
        """
        Filter daily notes based on the project passed in the query params.
        Ensure the project belongs to the authenticated user.
        """
        project_id = self.request.query_params.get("project_id")  # type: ignore

        if not project_id:
            raise ValidationError({"project_id": "This query parameter is required."})

        queryset = DailyNote.objects.filter(project=project_id)

        return queryset
    
    def list(self, request, *args, **kwargs):
        """
        Override the list method to group daily notes by month if no specific date is provided.
        """
        queryset = self.get_queryset().annotate(month=TruncMonth('date')).order_by('-date')

        # Apply pagination to the queryset
        paginated_queryset = self.paginate_queryset(queryset)
        if paginated_queryset is not None:
            # Group only the paginated results (now a list, not a queryset)
            sorted_months, grouped_data = group_by_month(paginated_queryset)

            # Serialize grouped notes
            grouped_serialized = {
                month: DailyNoteSerializer(grouped_data[month], many=True).data
                for month in sorted_months
            }

            # Return paginated response
            return self.get_paginated_response(grouped_serialized)
    
        
    # def post(self, request):
    #     try:
    #         serializer = DailyNoteSerializer(data=request.data)
    #         if serializer.is_valid():
    #             serializer.save()
    #             return CustomResponse(serializer.data, status=status.HTTP_201_CREATED)

    #         return ErrorResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    #     except ValueError:
    #         return ErrorResponse("Invalid data", status=status.HTTP_400_BAD_REQUEST)
        
    # def patch(self, request, pk=None):
    #     try:
    #         if pk is None:
    #             return ErrorResponse("Daily note ID is required", status=status.HTTP_400_BAD_REQUEST)
            
    #         daily_note = DailyNote.objects.get(pk=pk)
    #         serializer = DailyNoteSerializer(daily_note, data=request.data, partial=True)

    #         if serializer.is_valid():
    #             serializer.save()
    #             return CustomResponse(serializer.data, status=status.HTTP_200_OK)
            
    #         return ErrorResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    #     except DailyNote.DoesNotExist:
    #         return ErrorResponse("Daily note not found", status=status.HTTP_404_NOT_FOUND)
        
    # def delete(self, request, pk=None):
    #     try:
    #         if pk is None:
    #             return ErrorResponse("Daily note ID is required", status=status.HTTP_400_BAD_REQUEST)

    #         daily_note = DailyNote.objects.get(pk=pk)
    #         daily_note.delete()

    #         return CustomResponse({"message": "Daily note deleted successfully"}, status=status.HTTP_200_OK)

    #     except DailyNote.DoesNotExist:
    #         return ErrorResponse("Daily note not found", status=status.HTTP_404_NOT_FOUND)