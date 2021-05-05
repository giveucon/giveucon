from django.db import transaction
from rest_framework.serializers import ModelSerializer

from .dummy_article_write_serializer import DummyArticleWriteSerializer
from .store_notice_write_serializer import StoreNoticeWriteSerializer
from .store_notice_read_serializer import StoreNoticeReadSerializer
from ..models import StoreNotice

class DummyStoreNoticeWriteSerializer(StoreNoticeWriteSerializer):
    article = DummyArticleWriteSerializer()
