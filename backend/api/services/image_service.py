from django.db import transaction
from ..models import Image

class ImageService():
    @staticmethod
    def save_images(images_data):
        with transaction.atomic():
            images = Image.objects.bulk_create([Image() for _ in images_data])
            for i in range(len(images)):
                images[i].image.save(images_data[i].name, images_data[i])
        return images
