'use client';

import React, { useState, useEffect } from 'react';
import api from '../utils/api'; // The updated api utility that includes token handling

type Book = {
  id: number;
  title: string;
  author: number | null;
  isbn: string;
  available_copies: number;
};

type Author = {
  id: number;
  name: string;
};

const Books: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [formData, setFormData] = useState<Book>({
    id: 0,
    title: '',
    author: null,
    isbn: '',
    available_copies: 0,
  });
  const [isEditing, setIsEditing] = useState(false);

  const fetchBooks = async () => {
    try {
      const response = await api.get('/books/');
      setBooks(response);
    } catch (error) {
      console.error('Failed to fetch books', error);
    }
  };

  const fetchAuthors = async () => {
    try {
      const response = await api.get('/authors/');
      setAuthors(response);
    } catch (error) {
      console.error('Failed to fetch authors', error);
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchAuthors();
  }, []);

  const handleCreateOrUpdate = async () => {
    try {
      if (isEditing) {
        await api.put(`/books/${formData.id}/`, formData);
      } else {
        await api.post('/books/', formData);
      }
      fetchBooks();
      setFormData({ id: 0, title: '', author: null, isbn: '', available_copies: 0 });
      setIsEditing(false);
    } catch (error) {
      console.error('Error creating/updating book', error);
    }
  };

  const handleEdit = (book: Book) => {
    setFormData(book);
    setIsEditing(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/books/${id}/`);
      fetchBooks();
    } catch (error) {
      console.error('Error deleting book', error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-center">Books</h2>

      {/* Form */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold mb-4">{isEditing ? 'Edit Book' : 'Add Book'}</h3>
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring focus:ring-blue-300 dark:focus:ring-blue-800"
          />
          <select
            value={formData.author || ''}
            onChange={(e) => setFormData({ ...formData, author: parseInt(e.target.value, 10) || null })}
            className="p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring focus:ring-blue-300 dark:focus:ring-blue-800"
          >
            <option value="" disabled>
              Select Author
            </option>
            {authors.map((author) => (
              <option key={author.id} value={author.id}>
                {author.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="ISBN"
            value={formData.isbn}
            onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
            className="p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring focus:ring-blue-300 dark:focus:ring-blue-800"
          />
          <input
            type="number"
            placeholder="Available Copies"
            value={formData.available_copies}
            onChange={(e) =>
              setFormData({ ...formData, available_copies: parseInt(e.target.value, 10) || 0 })
            }
            className="p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring focus:ring-blue-300 dark:focus:ring-blue-800"
          />
          <div className="flex gap-2">
            <button
              onClick={handleCreateOrUpdate}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              {isEditing ? 'Update' : 'Add'}
            </button>
            {isEditing && (
              <button
                onClick={() => {
                  setFormData({ id: 0, title: '', author: null, isbn: '', available_copies: 0 });
                  setIsEditing(false);
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <table className="table-auto w-full bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-200 dark:bg-gray-700">
          <tr>
            <th className="px-4 py-2 text-left">ID</th>
            <th className="px-4 py-2 text-left">Title</th>
            <th className="px-4 py-2 text-left">Author</th>
            <th className="px-4 py-2 text-left">ISBN</th>
            <th className="px-4 py-2 text-left">Available Copies</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id} className="border-t hover:bg-gray-100 dark:hover:bg-gray-700">
              <td className="px-4 py-2">{book.id}</td>
              <td className="px-4 py-2">{book.title}</td>
              <td className="px-4 py-2">
                {authors.find((author) => author.id === book.author)?.name || 'Unknown'}
              </td>
              <td className="px-4 py-2">{book.isbn}</td>
              <td className="px-4 py-2">{book.available_copies}</td>
              <td className="px-4 py-2">
                <button
                  onClick={() => handleEdit(book)}
                  className="text-blue-500 hover:underline mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(book.id)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Books;
