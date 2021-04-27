class SerializerMixin(object):
    serializer_class = None
    serializer_class_read = None
    serializer_class_write = None
    serializer_class_get = None
    serializer_class_post = None
    serializer_class_put = None

    def get_serializer_class(self):
        print('get_serializer_class()')

        serializer_class_mapper = {
            'GET': self.serializer_class_get or self.serializer_class_read,
            'POST': self.serializer_class_post or self.serializer_class_write,
            'PUT': self.serializer_class_put or self.serializer_class_write,
        }

        serializer_class = serializer_class_mapper[self.request.method]

        if serializer_class is None:
            serializer_class = self.serializer_class

        assert serializer_class is not None, (
            f'serializer for ${self.action} action is not defined'
        )

        return serializer_class
