from rest_framework import status
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet


class EnvelopeModelViewSet(ModelViewSet):
    """
    ModelViewSet that wraps all responses in the standard envelope:
    { "data": ..., "errors": null, "meta": { "count": ..., "next": ..., "previous": ... } }
    """

    def finalize_response(self, request, response, *args, **kwargs):
        response = super().finalize_response(request, response, *args, **kwargs)

        if not hasattr(response, 'data') or response.data is None:
            return response

        # Don't wrap if already enveloped or if it's an error from DRF
        if isinstance(response.data, dict) and 'data' in response.data and 'errors' in response.data:
            return response

        if response.status_code >= 400:
            response.data = {
                'data': None,
                'errors': response.data,
                'meta': {},
            }
        elif isinstance(response.data, dict) and 'results' in response.data:
            # Paginated response
            response.data = {
                'data': response.data['results'],
                'errors': None,
                'meta': {
                    'count': response.data.get('count'),
                    'next': response.data.get('next'),
                    'previous': response.data.get('previous'),
                },
            }
        else:
            response.data = {
                'data': response.data,
                'errors': None,
                'meta': {},
            }

        return response
