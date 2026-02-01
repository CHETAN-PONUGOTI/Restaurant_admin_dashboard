import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';
import { X, ShoppingCart } from 'lucide-react';

export const AddOrderModal = ({ isOpen, onClose, onRefresh }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [formData, setFormData] = useState({
    customerName: '',
    tableNumber: '',
    items: [] // Array of { menuItem, quantity }
  });

  // Load menu items so admin can choose what the customer ordered
  useEffect(() => {
    if (isOpen) {
      const fetchMenu = async () => {
        try {
          const { data } = await api.get('/menu');
          setMenuItems(data.filter(item => item.isAvailable));
        } catch (err) {
          toast.error("Could not load menu for selection");
        }
      };
      fetchMenu();
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.items.length === 0) return toast.error("Please add at least one item");

    try {
      await api.post('/orders', formData);
      toast.success("Order created successfully!");
      onRefresh();
      onClose();
      setFormData({ customerName: '', tableNumber: '', items: [] });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create order");
    }
  };

  const addItemToOrder = (itemId) => {
    const existing = formData.items.find(i => i.menuItem === itemId);
    if (existing) {
      setFormData({
        ...formData,
        items: formData.items.map(i => i.menuItem === itemId ? { ...i, quantity: i.quantity + 1 } : i)
      });
    } else {
      setFormData({
        ...formData,
        items: [...formData.items, { menuItem: itemId, quantity: 1 }]
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[150] p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-gray-800">New Customer Order</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <input 
              type="text" placeholder="Customer Name" required
              className="p-3 border rounded-xl outline-none focus:ring-2 focus:ring-orange-500"
              value={formData.customerName}
              onChange={(e) => setFormData({...formData, customerName: e.target.value})}
            />
            <input 
              type="number" placeholder="Table #" required
              className="p-3 border rounded-xl outline-none focus:ring-2 focus:ring-orange-500"
              value={formData.tableNumber}
              onChange={(e) => setFormData({...formData, tableNumber: e.target.value})}
            />
          </div>

          <div className="border rounded-xl p-4 bg-gray-50">
            <h3 className="text-xs font-black text-gray-400 uppercase mb-3">Select Items</h3>
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-2">
              {menuItems.map(item => (
                <button
                  key={item._id}
                  type="button"
                  onClick={() => addItemToOrder(item._id)}
                  className="text-left p-2 bg-white border rounded-lg text-xs hover:border-orange-500 transition-colors"
                >
                  {item.name} - <span className="text-orange-600 font-bold">${item.price}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-black text-gray-400 uppercase">Selected ({formData.items.length})</h3>
            {formData.items.map((item, idx) => {
              const details = menuItems.find(m => m._id === item.menuItem);
              return (
                <div key={idx} className="flex justify-between text-sm bg-orange-50 p-2 rounded-lg border border-orange-100">
                  <span>{details?.name}</span>
                  <span className="font-bold">x{item.quantity}</span>
                </div>
              );
            })}
          </div>

          <button type="submit" className="w-full bg-orange-600 text-white py-4 rounded-2xl font-black shadow-lg hover:shadow-orange-200 transition-all flex items-center justify-center gap-2">
            <ShoppingCart size={20} /> Place Order
          </button>
        </form>
      </div>
    </div>
  );
};