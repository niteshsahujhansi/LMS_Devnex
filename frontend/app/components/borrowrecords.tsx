'use client';

import React, { useState, useEffect } from 'react';
import api from '../utils/api';

type BorrowRecord = {
  id: number;
  book: number;
  borrowed_by: string;
  borrow_date: string;
  return_date: string | null;
};

type Book = {
  id: number;
  title: string;
};

const BorrowRecords: React.FC = () => {
  const [borrowRecords, setBorrowRecords] = useState<BorrowRecord[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [formData, setFormData] = useState<Omit<BorrowRecord, 'id' | 'borrow_date' | 'return_date'>>({
    book: 0,
    borrowed_by: '',
  });

  const fetchBorrowRecords = async () => {
    try {
      const response = await api.get('/borrow/');
      setBorrowRecords(response);
    } catch (error) {
      console.error('Error fetching borrow records:', error);
    }
  };

  const fetchBooks = async () => {
    try {
      const response = await api.get('/books/');
      setBooks(response);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  useEffect(() => {
    fetchBorrowRecords();
    fetchBooks();
  }, []);
  const handleCreate = async () => {
    try {
      await api.post('/borrow/', formData);
      fetchBorrowRecords();
      setFormData({ book: 0, borrowed_by: '' });
      /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
      console.error('Error borrowing book:', error);
  
      // Show a user-friendly error message
      alert(error.response?.data?.detail || 'An error occurred while borrowing the book. Please try again.');
    }
  };
  
  

  const handleReturnBook = async (id: number) => {
    try {
      await api.put(`/borrow/${id}/return/`, {});
      fetchBorrowRecords();
    } catch (error) {
      console.error('Error returning book:', error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-center">Borrow Records</h2>

      {/* Form */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold mb-4">Borrow a Book</h3>
        <div className="flex flex-col gap-4">
          <select
            value={formData.book || ''}
            onChange={(e) => setFormData({ ...formData, book: parseInt(e.target.value, 10) || 0 })}
            className="p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring focus:ring-blue-300 dark:focus:ring-blue-800"
          >
            <option value="" disabled>
              Select Book
            </option>
            {books.map((book) => (
              <option key={book.id} value={book.id}>
                {book.title}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Borrowed By"
            value={formData.borrowed_by}
            onChange={(e) => setFormData({ ...formData, borrowed_by: e.target.value })}
            className="p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring focus:ring-blue-300 dark:focus:ring-blue-800"
          />
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Borrow
          </button>
        </div>
      </div>

      {/* Table */}
      <table className="table-auto w-full bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-200 dark:bg-gray-700">
          <tr>
            <th className="px-4 py-2 text-left">ID</th>
            <th className="px-4 py-2 text-left">Book</th>
            <th className="px-4 py-2 text-left">Borrowed By</th>
            <th className="px-4 py-2 text-left">Borrow Date</th>
            <th className="px-4 py-2 text-left">Return Date</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {borrowRecords.map((record) => (
            <tr
              key={record.id}
              className="border-t hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <td className="px-4 py-2">{record.id}</td>
              <td className="px-4 py-2">
                {books.find((book) => book.id === record.book)?.title || 'Unknown'}
              </td>
              <td className="px-4 py-2">{record.borrowed_by}</td>
              <td className="px-4 py-2">{new Date(record.borrow_date).toLocaleDateString()}</td>
              <td className="px-4 py-2">
                {record.return_date
                  ? new Date(record.return_date).toLocaleDateString()
                  : 'Not Returned'}
              </td>
              <td className="px-4 py-2">
                {!record.return_date && (
                  <button
                    onClick={() => handleReturnBook(record.id)}
                    className="text-green-500 hover:underline"
                  >
                    Return
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BorrowRecords;
