from rest_framework.response import Response

class CustomResponse(Response):
    def __init__(self, data=None, status=None, **kwargs):
        data = {'status': status, 'data': data}
        super().__init__(data, status, **kwargs)