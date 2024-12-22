# ViewSets
from django.db import models
from rest_framework import serializers, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
# from rest_framework.routers import DefaultRouter
from django.urls import path, include
from celery import shared_task
import os
import json
from datetime import datetime
from zoneinfo import ZoneInfo
from django.conf import settings

from library.models import *
from library.serializers import *

from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

india_tz = ZoneInfo('Asia/Kolkata')

class AuthorViewSet(viewsets.ModelViewSet):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer
    # permission_classes = [IsAuthenticated]
    # authentication_classes=(JWTAuthentication,)

    def destroy(self, request, *args, **kwargs):
        try:
            return super().destroy(request, *args, **kwargs)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer

    def update(self, request, *args, **kwargs):
        try:
            return super().update(request, *args, **kwargs)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        try:
            return super().destroy(request, *args, **kwargs)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class BorrowRecordViewSet(viewsets.ModelViewSet):
    queryset = BorrowRecord.objects.all()
    serializer_class = BorrowRecordSerializer

    def create(self, request, *args, **kwargs):
        try:
            book_id = request.data.get('book')
            book = Book.objects.get(id=book_id)

            if book.available_copies <= 0:
                return Response({"error": "No available copies for the selected book."}, status=status.HTTP_400_BAD_REQUEST)

            book.available_copies -= 1
            book.save()

            return super().create(request, *args, **kwargs)
        except Book.DoesNotExist:
            return Response({"error": "Book not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['put'], url_path='return')
    def mark_as_returned(self, request, pk=None):
        try:
            borrow_record = self.get_object()
            if borrow_record.return_date is None:
                borrow_record.return_date = datetime.now(india_tz)
                borrow_record.book.available_copies += 1
                borrow_record.book.save()
                borrow_record.save()
                return Response({"status": "Book marked as returned."})
            return Response({"status": "Book was already returned."})
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

# Report generation task
@shared_task
def generate_library_report():
    try:
        total_authors = Author.objects.count()
        total_books = Book.objects.count()
        total_borrowed_books = BorrowRecord.objects.filter(return_date__isnull=True).count()

        report_data = {
            "total_authors": total_authors,
            "total_books": total_books,
            "total_borrowed_books": total_borrowed_books,
            "generated_at": datetime.now(india_tz).strftime('%Y-%m-%d %H:%M:%S')
        }

        reports_dir = os.path.join(settings.BASE_DIR, 'reports')
        if not os.path.exists(reports_dir):
            os.makedirs(reports_dir)

        timestamp = datetime.now(india_tz).strftime('%Y%m%d%H%M%S')
        report_file_path = os.path.join(reports_dir, f'report_{timestamp}.json')

        with open(report_file_path, 'w') as report_file:
            json.dump(report_data, report_file)

        return report_file_path
    except Exception as e:
        return str(e)

class ReportAPIView(APIView):
    def get(self, request):
        try:
            reports_dir = os.path.join(settings.BASE_DIR, 'reports')
            if not os.path.exists(reports_dir):
                return Response({"error": "No reports available."}, status=status.HTTP_404_NOT_FOUND)

            reports = sorted(os.listdir(reports_dir), reverse=True)
            if not reports:
                return Response({"error": "No reports available."}, status=status.HTTP_404_NOT_FOUND)

            latest_report_path = os.path.join(reports_dir, reports[0])
            with open(latest_report_path, 'r') as report_file:
                report_data = json.load(report_file)

            return Response(report_data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        try:
            generate_library_report.delay()
            return Response({"status": "Report generation started."})
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
