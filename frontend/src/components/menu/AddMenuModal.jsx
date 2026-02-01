import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';
import { X } from 'lucide-react';

export const AddMenuModal = ({ isOpen, onClose, onRefresh, editData }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Main Course',
    price: '',
    imageUrl: '',
    description: ''
  });

  // Populate form when editing an existing item
  useEffect(() => {
    if (editData) {
      setFormData({
        name: editData.name || '',
        category: editData.category || 'Main Course',
        price: editData.price || '',
        imageUrl: editData.imageUrl || '',
        description: editData.description || ''
      });
    } else {
      setFormData({ name: '', category: 'Main Course', price: '', imageUrl: '', description: '' });
    }
  }, [editData, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editData) {
        // Use PUT for updating existing items
        await api.put(`/menu/${editData._id}`, formData);
        toast.success("Item updated successfully!");
      } else {
        // Use POST for adding new items
        await api.post('/menu', formData);
        toast.success("New item added!");
      }
      onRefresh();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[120] p-4">
      <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl animate-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-gray-800 tracking-tight">
            {editData ? 'Edit Menu Item' : 'Add New Item'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={24} className="text-gray-400" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Item Name</label>
            <input 
              type="text" placeholder="e.g. Garlic Parmesan Wings" required
              className="w-full p-3 border border-gray-100 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 transition-all"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Category</label>
              <select 
                className="w-full p-3 border border-gray-100 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option value="Appetizer">Appetizer</option>
                <option value="Main Course">Main Course</option>
                <option value="Dessert">Dessert</option>
                <option value="Beverage">Beverage</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Price ($)</label>
              <input 
                type="number" step="0.01" placeholder="12.99" required
                className="w-full p-3 border border-gray-100 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Image URL</label>
            <input 
              type="text" placeholder="https://images.unsplash.com/..."
              className="w-full p-3 border border-gray-100 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 transition-all"
              value={formData.imageUrl}
              onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Description</label>
            <textarea 
              placeholder="Fresh wings tossed in garlic parmesan sauce..."
              className="w-full p-3 border border-gray-100 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 transition-all h-24 resize-none"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>
          <button type="submit" className="w-full bg-orange-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-orange-100 hover:shadow-orange-200 transition-all active:scale-95">
            {editData ? 'Update Menu Item' : 'Save to Menu'}
          </button>
        </form>
      </div>
    </div>
  );
};