import os

try:
    import magic
except ImportError:
    from winmagic import magic
from django.conf import settings
from django.http import HttpResponse, Http404


def download_file(request, path):
    file_path = ''.join((str(settings.BASE_DIR), request.path))
    if os.path.exists(file_path):
        mime = magic.Magic(mime=True)
        mime_type = mime.from_file(file_path)
        with open(file_path, 'rb') as fh:
            response = HttpResponse(fh.read(), content_type=mime_type)
            response['Content-Disposition'] = 'inline; filename=' + os.path.basename(file_path)
            return response
    raise Http404
