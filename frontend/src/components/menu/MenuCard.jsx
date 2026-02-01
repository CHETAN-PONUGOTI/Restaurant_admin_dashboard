import React from 'react';
import { ToggleRight, ToggleLeft, Edit3, Trash2 } from 'lucide-react';

export const MenuCard = React.memo(({ item, onToggle, onEdit, onDelete }) => {
  return (
    <div className="bg-white border rounded-2xl overflow-hidden shadow-sm flex flex-col h-full">
      <img 
        src={item.imageUrl} 
        alt={item.name} 
        className="w-full h-40 object-cover" 
        onError={(e) => { e.target.src = 'https://via.placeholder.com/300x200?text=No+Image'; }}
      />
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-gray-800">{item.name}</h3>
          <p className="font-black text-orange-600">${item.price}</p>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t mt-auto">
          <div className="flex gap-2">
            {/* FIX: Ensure these functions exist before calling them */}
            <button 
              onClick={() => onEdit && onEdit(item)} 
              className="p-2 text-gray-400 hover:text-blue-500 rounded-lg"
            >
              <Edit3 size={18} />
            </button>
            <button 
              onClick={() => onDelete && onDelete(item._id)} 
              className="p-2 text-gray-400 hover:text-red-500 rounded-lg"
            >
              <Trash2 size={18} />
            </button>
          </div>
          
          <button onClick={() => onToggle && onToggle(item._id, item.isAvailable)} className="flex items-center gap-2">
            <span className={`text-[10px] font-bold ${item.isAvailable ? 'text-green-600' : 'text-gray-300'}`}>
              {item.isAvailable ? 'AVAILABLE' : 'DISABLED'}
            </span>
            {item.isAvailable ? <ToggleRight className="text-green-500" size={28} /> : <ToggleLeft className="text-gray-300" size={28} />}
          </button>
        </div>
      </div>
    </div>
  );
});