from django.core.exceptions import ValidationError
from django.utils.deconstruct import deconstructible

FILE_SIZE_LIMIT_IN_KILOBYTES = 512


@deconstructible
class FileSizeValidator(object):
    def __init__(self, size_kb=FILE_SIZE_LIMIT_IN_KILOBYTES):
        """
            File size validator. Units of measurement KB. Default value 512 KB
            :param size_kb: int, >0:
        """
        if type(size_kb) != int:
            print(type(size_kb))
            raise TypeError('Argument must be integer')

        if size_kb <= 0:
            raise ValueError('Argument must be positive')

        self.size_kb = size_kb

    def __call__(self, value):
        filesize = value.size / 1024
        if filesize > self.size_kb:
            raise ValidationError(
                "The maximum file size that can be uploaded is {:.2}MB".format(self.size_kb / 1024))
        else:
            return value

    def __eq__(self, other):
        return self.size_kb == other.size_kb
