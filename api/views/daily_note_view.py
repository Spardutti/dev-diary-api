from rest_framework.views import APIView
from rest_framework import status
from ..serializers import DailyNoteSerializer
from ..models import DailyNote
from ..utils.custom_response import CustomResponse
from ..utils.error_response import ErrorResponse
from rest_framework.permissions import IsAuthenticated
from datetime import datetime, date
from django.db.models.functions import TruncMonth
from django.db.models import Count
from collections import defaultdict

class DailyNoteView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk=None):
        try:
            if pk is not None:
                daily_note = DailyNote.objects.get(pk=pk)
                serializer = DailyNoteSerializer(daily_note)
                return CustomResponse(serializer.data, status=status.HTTP_200_OK)
            
            date_str = request.query_params.get('date', None)
            project_id = request.query_params.get('project_id', None)
            
            if date_str and project_id:
                if date_str == "today":
                    return self.get_or_create_today_note(project_id)
                else:
                    return self.get_daily_note_by_date(project_id, date_str)
            
            daily_notes = DailyNote.objects.filter(project=project_id).annotate(month=TruncMonth('date')).order_by('-date')

            grouped_notes_serialized = self.group_by_month(daily_notes)
        
            return CustomResponse(grouped_notes_serialized, status=status.HTTP_200_OK)
        
        except DailyNote.DoesNotExist:
            return ErrorResponse("Daily notes not found", status=status.HTTP_404_NOT_FOUND)
        
    def post(self, request):
        try:
            serializer = DailyNoteSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return CustomResponse(serializer.data, status=status.HTTP_201_CREATED)

            return ErrorResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except ValueError:
            return ErrorResponse("Invalid data", status=status.HTTP_400_BAD_REQUEST)
        
    def patch(self, request, pk=None):
        try:
            if pk is None:
                return ErrorResponse("Daily note ID is required", status=status.HTTP_400_BAD_REQUEST)
            
            daily_note = DailyNote.objects.get(pk=pk)
            serializer = DailyNoteSerializer(daily_note, data=request.data, partial=True)

            if serializer.is_valid():
                serializer.save()
                return CustomResponse(serializer.data, status=status.HTTP_200_OK)
            
            return ErrorResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        except DailyNote.DoesNotExist:
            return ErrorResponse("Daily note not found", status=status.HTTP_404_NOT_FOUND)
        
    def delete(self, request, pk=None):
        try:
            if pk is None:
                return ErrorResponse("Daily note ID is required", status=status.HTTP_400_BAD_REQUEST)

            daily_note = DailyNote.objects.get(pk=pk)
            daily_note.delete()

            return CustomResponse({"message": "Daily note deleted successfully"}, status=status.HTTP_200_OK)

        except DailyNote.DoesNotExist:
            return ErrorResponse("Daily note not found", status=status.HTTP_404_NOT_FOUND)
        
    
    def get_daily_note_by_date(self, project_id, date_str):
        try:
            date = datetime.strptime(date_str, '%Y-%m-%d').date()
            daily_notes = DailyNote.objects.get(project=project_id, date=date)
            serializer = DailyNoteSerializer(daily_notes)

            return CustomResponse(serializer.data, status=status.HTTP_200_OK)

        except DailyNote.DoesNotExist:
            return ErrorResponse("Daily notes not found", status=status.HTTP_404_NOT_FOUND)
        
    def get_or_create_today_note(self, project_id):
        """
        Get today's note for a project, or create it if it doesn't exist.
        """
        today = date.today()
        daily_note, created = DailyNote.objects.get_or_create(
            project_id=project_id,
            date=today,
        )
        serializer = DailyNoteSerializer(daily_note)
        return CustomResponse(serializer.data, status=status.HTTP_200_OK)
    
    def group_by_month(self, daily_notes):
        """
        Group notes by month in descending order (newest month first).
        """
        # Create a grouped structure
        grouped_notes = defaultdict(list)
        for note in daily_notes:
            key = note.date.strftime('%Y-%m')  # Group by Year-Month
            grouped_notes[key].append(note)

        # Sort months in descending order and serialize grouped notes
        sorted_months = sorted(grouped_notes.keys(), reverse=True)  # Sort months in descending order
        return {
            month: DailyNoteSerializer(grouped_notes[month], many=True).data
            for month in sorted_months
        }