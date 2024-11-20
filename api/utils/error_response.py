from rest_framework.response import Response

class ErrorResponse(Response):
    def __init__(self, error=None, status=None, **kwargs):
        data = {'status': status, 'error': error}
        super().__init__(data, status, **kwargs)