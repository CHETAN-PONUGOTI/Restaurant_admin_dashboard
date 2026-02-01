import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { MenuCard } from '../components/menu/MenuCard';
import { AddMenuModal } from '../components/menu/AddMenuModal';
import { DeleteModal } from '../components/common/DeleteModal';
import { Loader } from '../components/common/Loader';
import { Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';

const MenuPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchMenu = async () => {
    try {
      const { data } = await api.get('/menu');
      // Ensure data is an array to prevent mapping errors
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error("Failed to load menu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMenu(); }, []);

  const handleToggle = async (id, currentStatus) => {
    try {
      await api.patch(`/menu/${id}/availability`);
      setItems(prevItems => prevItems.map(item => 
        item._id === id ? { ...item, isAvailable: !currentStatus } : item
      ));
      toast.success("Availability updated");
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleDeleteClick = (id) => {
    setSelectedItem(id); // Set the ID of the item to be deleted
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      // Use the stored ID from state
      await api.delete(`/menu/${selectedItem}`);
      setItems(prev => prev.filter(i => i._id !== selectedItem));
      toast.success("Item removed from menu");
      setIsDeleteModalOpen(false);
    } catch (err) {
      toast.error("Delete failed - Check backend route");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-black text-gray-800">Menu Manager</h1>
        <button 
          onClick={() => { setSelectedItem(null); setIsModalOpen(true); }}
          className="bg-orange-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold shadow-lg shadow-orange-100"
        >
          <Plus size={18} /> Add New Item
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map(item => (
          <MenuCard 
            key={item._id} 
            item={item} 
            onToggle={handleToggle} 
            onEdit={(it) => { setSelectedItem(it); setIsModalOpen(true); }} 
            onDelete={() => handleDeleteClick(item._id)} 
          />
        ))}
      </div>

      <AddMenuModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onRefresh={fetchMenu} 
        editData={selectedItem}
      />

      <DeleteModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        onConfirm={confirmDelete} 
      />
    </div>
  );
};

export default MenuPage;