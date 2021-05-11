from django.db.models import Model

def to_external_value(data):
    for key, value in data.items() if isinstance(data, dict) else enumerate(data):
        if isinstance(value, Model):
            data[key] = value.pk
        if isinstance(value, dict) or isinstance(value, list):
            data[key] = to_external_value(value)
    return data
