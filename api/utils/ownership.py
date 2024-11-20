from rest_framework import status
from ..utils.error_response import ErrorResponse
from ..utils.guest_account import get_or_create_guest_user

def check_is_owner(entity, request):
    """
    Utility function to check if the requesting user is the owner of the given entity.

    Args:
        entity: The model instance to check ownership of (e.g., Project).
        request: The current HTTP request object.

    Returns:
        - None if the user is the owner.
        - ErrorResponse if the user is not the owner.
    """
    # Determine the user (authenticated or guest)
    user = request.user if request.user.is_authenticated else get_or_create_guest_user()

    # Check if the user is the owner
    if entity.owner != user:
        return ErrorResponse("You are not authorized to perform this action.", status=status.HTTP_403_FORBIDDEN)

    return None
