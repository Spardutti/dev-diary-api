from ..serializers import DailyNoteSerializer
from ..models import DailyNote
from ..utils.group_by_month import group_by_month
from rest_framework.permissions import IsAuthenticated
from django.db.models.functions import TruncMonth
from rest_framework import generics
from rest_framework.exceptions import ValidationError
from django.db.models.functions import TruncMonth
from rest_framework.exceptions import ValidationError, NotFound
from ..permissions.is_project_owner import IsProjectOwner
from ..utils.custom_response import CustomResponse

class DailyNoteView(generics.ListCreateAPIView):
    queryset = DailyNote.objects.all()
    serializer_class = DailyNoteSerializer
    permission_classes = [IsAuthenticated, IsProjectOwner]

    filterset_fields = ['project', 'date']

    ordering_fields = ['created_at', 'updated_at']
    ordering = ['-created_at'] 

    def get(self, request, *args, **kwargs):
        """
        If a query parameter is provided, ensure that exactly one object matches.
        """
        date = self.request.query_params.get('date')  # type: ignore

        # If date is provided, check for a single matching object
        if date:
            queryset = self.get_queryset()  # get_queryset now filters by both project_id and date
            if queryset.count() == 1:
                # Serialize the single object and return it as a detail response
                obj = queryset.first()
                serializer = self.get_serializer(obj)
                return CustomResponse(serializer.data, status=200)

            if queryset.count() == 0:
                raise NotFound("No DailyNote found matching the given project and date.", )
            
            raise NotFound("Multiple DailyNotes found matching the given project and date.")

        # If no date is provided, fallback to standard list behavior
        return super().get(request, *args, **kwargs)

    def get_queryset(self):
        """
        Filter daily notes based on the project passed in the query params.
        Ensure the project belongs to the authenticated user.
        """
        project_id = self.request.query_params.get("project_id")  # type: ignore
        date = self.request.query_params.get("date")  # type: ignore

        if not project_id:
            raise ValidationError({"project_id": "This query parameter is required."})

        queryset = DailyNote.objects.filter(project=project_id)

        if date:
            queryset = queryset.filter(date=date)

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

class DailyNoteDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = DailyNote.objects.all()
    serializer_class = DailyNoteSerializer
    permission_classes = [IsAuthenticated, IsProjectOwner]

    