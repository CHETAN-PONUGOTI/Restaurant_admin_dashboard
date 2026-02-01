import React, { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import { AddOrderModal } from '../components/common/AddOrderModal';
import { Loader } from '../components/common/Loader';
import { UserPlus, TrendingUp, Package, Clock } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Dashboard = () => {
  const [data, setData] = useState({ orders: [], topSellers: [] });
  const [loading, setLoading] = useState(true);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  // Optimization: Memoize the fetch function to prevent unnecessary recreations
  const fetchDashboardData = useCallback(async () => {
    try {
      // Parallel execution to improve loading speed
      const [ordersRes, analyticsRes] = await Promise.all([
        api.get('/orders'),
        api.get('/orders/analytics/top-sellers')
      ]);

      setData({
        orders: Array.isArray(ordersRes.data) ? ordersRes.data : [],
        topSellers: Array.isArray(analyticsRes.data) ? analyticsRes.data : []
      });
    } catch (err) {
      toast.error("Failed to sync with database. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // FIX: Helper to handle status badge colors without crashing Fast Refresh
  const getStatusBadge = (status) => {
    const styles = {
      'Delivered': 'bg-green-100 text-green-700 border-green-200',
      'Preparing': 'bg-blue-100 text-blue-700 border-blue-200',
      'Pending': 'bg-amber-100 text-amber-700 border-amber-200',
      'Cancelled': 'bg-red-100 text-red-700 border-red-200'
    };
    return styles[status] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-10 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm">Real-time restaurant performance overview.</p>
        </div>
        <button 
          onClick={() => setIsOrderModalOpen(true)}
          className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-bold shadow-lg shadow-orange-200 transition-all active:scale-95"
        >
          <UserPlus size={20} /> Add New Order
        </button>
      </div>

      {/* Top Sellers Analytics Section */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="text-orange-500" size={20} />
          <h2 className="text-lg font-bold text-gray-800">Top 5 Best Sellers</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {data.topSellers.map((item) => (
            <div key={item._id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:border-orange-200 transition-colors group">
              {/* FIX: Explicitly access name string to prevent "object to primitive" TypeError */}
              <p className="text-xs font-black text-gray-400 uppercase truncate mb-1 group-hover:text-orange-500 transition-colors">
                {item.details?.name || 'Unknown Item'}
              </p>
              <div className="flex items-baseline gap-1">
                <p className="text-3xl font-black text-gray-900">{item.totalSold}</p>
                <p className="text-xs text-gray-400 font-bold uppercase">Sold</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Orders Management Table */}
      <section className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-50 rounded-lg">
              <Package className="text-orange-600" size={20} />
            </div>
            <h2 className="font-bold text-gray-800 text-lg">Recent Orders</h2>
          </div>
          <span className="flex items-center gap-1.5 text-[10px] font-black text-emerald-500 uppercase tracking-widest">
            <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" /> Live
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50">
              <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b">
                <th className="px-8 py-4">Customer & Table</th>
                <th className="px-8 py-4">Ordered Items</th>
                <th className="px-8 py-4 text-center">Amount</th>
                <th className="px-8 py-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50/80 transition-colors group">
                  <td className="px-8 py-5">
                    <p className="font-bold text-gray-800 group-hover:text-orange-600 transition-colors">{order.customerName}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock size={12} /> Table {order.tableNumber}
                    </p>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-sm text-gray-600 max-w-xs truncate font-medium">
                      {/* FIX: Map over items and access menuItem name string safely */}
                      {order.items?.map(i => `${i.quantity}x ${i.menuItem?.name || 'Item'}`).join(', ')}
                    </p>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className="font-black text-gray-900">${(order.totalAmount || 0).toFixed(2)}</span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex justify-center">
                      <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border ${getStatusBadge(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <AddOrderModal 
        isOpen={isOrderModalOpen} 
        onClose={() => setIsOrderModalOpen(false)} 
        onRefresh={fetchDashboardData} 
      />
    </div>
  );
};

export default Dashboard;