from django.utils.crypto import get_random_string
from ..models import User
from rest_framework_simplejwt.tokens import RefreshToken

def get_or_create_guest_user():
        """
        Create or fetch a temporary guest user for unauthenticated requests.
        """
        # Generate a unique identifier for the guest user
        guest_email = f"guest_{get_random_string(10)}@email.com"

        # Create the guest user in the database
        guest_user, created = User.objects.get_or_create(
            email=guest_email,
            is_guest=True,
        )

        # If a new user was created, return it; otherwise, retry with a new email
        if created:
            return guest_user