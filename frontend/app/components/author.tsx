'use client';

import React, { useState, useEffect } from 'react';
import api from '../utils/api';

type Author = {
  id: number;
  name: string;
  bio: string;
};

const Authors: React.FC = () => {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [formData, setFormData] = useState<Author>({ id: 0, name: '', bio: '' });
  const [isEditing, setIsEditing] = useState(false);

  const fetchAuthors = async () => {
    try {
      const response = await api.get('/authors/');
      setAuthors(response);
    } catch (error) {
      console.error('Failed to fetch authors:', error);
    }
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  const handleCreateOrUpdate = async () => {
    try {
      if (isEditing) {
        await api.put(`/authors/${formData.id}/`, formData);
      } else {
        await api.post('/authors/', formData);
      }
      fetchAuthors();
      setFormData({ id: 0, name: '', bio: '' });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to create or update author:', error);
    }
  };

  const handleEdit = (author: Author) => {
    setFormData(author);
    setIsEditing(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/authors/${id}/`);
      fetchAuthors();
    } catch (error) {
      console.error('Failed to delete author:', error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-center">Authors</h2>

      {/* Form */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold mb-4">{isEditing ? 'Edit Author' : 'Add Author'}</h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="flex-grow p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring focus:ring-blue-300 dark:focus:ring-blue-800"
          />
          <input
            type="text"
            placeholder="Bio"
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            className="flex-grow p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring focus:ring-blue-300 dark:focus:ring-blue-800"
          />
          <button
            onClick={handleCreateOrUpdate}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            {isEditing ? 'Update' : 'Add'}
          </button>
          {isEditing && (
            <button
              onClick={() => {
                setFormData({ id: 0, name: '', bio: '' });
                setIsEditing(false);
              }}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <table className="table-auto w-full bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-200 dark:bg-gray-700">
          <tr>
            <th className="px-4 py-2 text-left">ID</th>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Bio</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {authors.map((author) => (
            <tr
              key={author.id}
              className="border-t hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <td className="px-4 py-2">{author.id}</td>
              <td className="px-4 py-2">{author.name}</td>
              <td className="px-4 py-2">{author.bio}</td>
              <td className="px-4 py-2">
                <button
                  onClick={() => handleEdit(author)}
                  className="text-blue-500 hover:underline mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(author.id)}
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

export default Authors;
