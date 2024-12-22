from __future__ import absolute_import, unicode_literals
import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'library_management.settings')
os.environ.setdefault('FORKED_BY_MULTIPROCESSING', '1')

app = Celery('library_management')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()
