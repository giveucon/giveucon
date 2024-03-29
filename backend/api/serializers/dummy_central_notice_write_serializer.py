from django.db import transaction
from rest_framework.serializers import ModelSerializer, SerializerMethodField

from .dummy_article_write_serializer import DummyArticleWriteSerializer
from .central_notice_read_serializer import CentralNoticeReadSerializer
from .central_notice_write_serializer import CentralNoticeWriteSerializer
from ..models import CentralNotice

class DummyCentralNoticeWriteSerializer(CentralNoticeWriteSerializer):
    article = DummyArticleWriteSerializer()
