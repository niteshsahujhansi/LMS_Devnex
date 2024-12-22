from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from django.contrib.auth import get_user_model
from library.models import Author, Book
from rest_framework_simplejwt.tokens import RefreshToken


class AuthorTests(APITestCase):
    def setUp(self):
        # Create a user and obtain the JWT token
        self.user_data = {
            'username': 'testuser',
            'password': 'password123',
        }
        self.user = get_user_model().objects.create_user(**self.user_data)

        # Obtain JWT token for the created user
        self.token = self.get_jwt_token(self.user)

        # Create author data
        self.author_data = {
            "name": "nitesh",
            "bio": "poet"
        }
        self.author = Author.objects.create(**self.author_data)

    def get_jwt_token(self, user):
        """Helper method to generate JWT token for a given user"""
        refresh = RefreshToken.for_user(user)
        return str(refresh.access_token)

    def test_create_author(self):
        url = reverse('author-list')
        data = {
            "name": "dev",
            "bio": "poet"
        }

        # Include JWT token in the Authorization header
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Author.objects.count(), 2)

    def test_list_authors(self):
        url = reverse('author-list')

        # Include JWT token in the Authorization header
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)
        response = self.client.get(url, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_update_author(self):
        url = reverse('author-detail', args=[self.author.id])
        data = {
            "name": "sahu",
            "bio": "Updated bio."
        }

        # Include JWT token in the Authorization header
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)
        response = self.client.put(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.author.refresh_from_db()
        self.assertEqual(self.author.name, "sahu")

    def test_delete_author(self):
        url = reverse('author-detail', args=[self.author.id])

        # Include JWT token in the Authorization header
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Author.objects.count(), 0)


class BookTests(APITestCase):
    def setUp(self):
        # Create a user and obtain the JWT token
        self.user_data = {
            'username': 'testuser',
            'password': 'password123',
        }
        self.user = get_user_model().objects.create_user(**self.user_data)

        # Obtain JWT token for the created user
        self.token = self.get_jwt_token(self.user)

        # Create author and book data
        self.author = Author.objects.create(name="nitesh", bio="poet")
        self.book_data = {
            "title": "Book_1",
            "author": self.author.id,
            "isbn": "9780",
            "available_copies": 10
        }
        self.book = Book.objects.create(**{
            "title": self.book_data['title'],
            "author": self.author,
            "isbn": self.book_data['isbn'],
            "available_copies": self.book_data['available_copies']
        })

    def get_jwt_token(self, user):
        """Helper method to generate JWT token for a given user"""
        refresh = RefreshToken.for_user(user)
        return str(refresh.access_token)

    def test_create_book(self):
        url = reverse('book-list')
        data = {
            "title": "Book_11",
            "author": self.author.id,
            "isbn": "9781",
            "available_copies": 5
        }

        # Include JWT token in the Authorization header
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Book.objects.count(), 2)

    def test_list_books(self):
        url = reverse('book-list')

        # Include JWT token in the Authorization header
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)
        response = self.client.get(url, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_update_book(self):
        url = reverse('book-detail', args=[self.book.id])
        data = {
            "title": "updated_book_title",
            "author": self.author.id,
            "isbn": "9700",
            "available_copies": 15
        }

        # Include JWT token in the Authorization header
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)
        response = self.client.put(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.book.refresh_from_db()
        self.assertEqual(self.book.title, "updated_book_title")

    def test_delete_book(self):
        url = reverse('book-detail', args=[self.book.id])

        # Include JWT token in the Authorization header
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Book.objects.count(), 0)














# from rest_framework.test import APITestCase
# from rest_framework import status
# from django.urls import reverse
# from library.models import Author, Book

# class AuthorTests(APITestCase):
#     def setUp(self):
#         self.author_data = {
#             "name": "nitesh",
#             "bio": "poet"
#         }
#         self.author = Author.objects.create(**self.author_data)

#     def test_create_author(self):
#         url = reverse('author-list')
#         data = {
#             "name": "dev",
#             "bio": "poet"
#         }
#         response = self.client.post(url, data, format='json')
#         self.assertEqual(response.status_code, status.HTTP_201_CREATED)
#         self.assertEqual(Author.objects.count(), 2)

#     def test_list_authors(self):
#         url = reverse('author-list')
#         response = self.client.get(url, format='json')
#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.assertEqual(len(response.data), 1)

#     def test_update_author(self):
#         url = reverse('author-detail', args=[self.author.id])
#         data = {
#             "name": "sahu",
#             "bio": "Updated bio."
#         }
#         response = self.client.put(url, data, format='json')
#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.author.refresh_from_db()
#         self.assertEqual(self.author.name, "sahu")

#     def test_delete_author(self):
#         url = reverse('author-detail', args=[self.author.id])
#         response = self.client.delete(url)
#         self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
#         self.assertEqual(Author.objects.count(), 0)

# class BookTests(APITestCase):
#     def setUp(self):
#         self.author = Author.objects.create(name="nitesh", bio="poet")
#         self.book_data = {
#             "title": "Book_1",
#             "author": self.author.id,
#             "isbn": "9780",
#             "available_copies": 10
#         }
#         self.book = Book.objects.create(**{
#             "title": self.book_data['title'],
#             "author": self.author,
#             "isbn": self.book_data['isbn'],
#             "available_copies": self.book_data['available_copies']
#         })

#     def test_create_book(self):
#         url = reverse('book-list')
#         data = {
#             "title": "Book_11",
#             "author": self.author.id,
#             "isbn": "9781",
#             "available_copies": 5
#         }
#         response = self.client.post(url, data, format='json')
#         self.assertEqual(response.status_code, status.HTTP_201_CREATED)
#         self.assertEqual(Book.objects.count(), 2)

#     def test_list_books(self):
#         url = reverse('book-list')
#         response = self.client.get(url, format='json')
#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.assertEqual(len(response.data), 1)

#     def test_update_book(self):
#         url = reverse('book-detail', args=[self.book.id])
#         data = {
#             "title": "updated_book_title",
#             "author": self.author.id,
#             "isbn": "9700",
#             "available_copies": 15
#         }
#         response = self.client.put(url, data, format='json')
#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.book.refresh_from_db()
#         self.assertEqual(self.book.title, "updated_book_title")

#     def test_delete_book(self):
#         url = reverse('book-detail', args=[self.book.id])
#         response = self.client.delete(url)
#         self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
#         self.assertEqual(Book.objects.count(), 0)
