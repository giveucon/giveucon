class SerializerMixin(object):
    serializer_class = None
    create_serializer_class = None
    retrieve_serializer_class = None
    list_serializer_class = None
    update_serializer_class = None
    partial_update_serializer_class = None
    destroy_update_serializer_class = None

    serializer_class_mapper = {
        'create': create_serializer_class,
        'retrieve': retrieve_serializer_class,
        'list': list_serializer_class,
        'update': update_serializer_class,
        'partial_update': partial_update_serializer_class,
        'destroy': destroy_update_serializer_class
    }

    def get_serializer_class(self):
        serializer_class = self.serializer_class_mapper[self.action]
        if serializer_class is None:
            serializer_class = self.serializer_class
        assert serializer_class is not None, (
            f'serializer for ${self.action} action is not defined'
        )
        return serializer_class
