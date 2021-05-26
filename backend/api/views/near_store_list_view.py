from rest_framework import generics
from sklearn.neighbors import BallTree

from ..mixins import SerializerMixin
from ..models import Store
from ..models import StoreLocation
from ..models import User
from ..models import UserLocation
from ..paginations import StorePagination
from ..serializers import StoreReadSerializer
from ..services import UserService

# https://towardsdatascience.com/using-scikit-learns-binary-trees-to-efficiently-find-latitude-and-longitude-neighbors-909979bd929b

class NearStoreListView(SerializerMixin, generics.ListAPIView):
    serializer_class_read = StoreReadSerializer
    pagination_class = StorePagination
    def get_queryset(self):
        user_pk = self.request.query_params.get('user', None)
        if user_pk:
            user = User.objects.get(pk=user_pk)
        else:
            user = UserService.get_current_user(self.request)
        try:
            user_location = UserLocation.objects.get(user=user.pk).location
            user_location = [[user_location.latitude, user_location.longitude]]
        except UserLocation.DoesNotExist:
            return Store.objects.all()
        store_locations = list(StoreLocation.objects.all())
        stores = list(map(lambda sl: sl.store, store_locations))
        locations = list(map(lambda sl: [sl.location.latitude, sl.location.longitude], store_locations))
        k = int(self.request.query_params.get('k', 5))
        k = min(k, len(locations))
        tree = BallTree(locations, metric='haversine')
        distances, indices = tree.query(user_location, k=k)
        stores = [stores[idx] for idx in indices[0]]
        return stores
