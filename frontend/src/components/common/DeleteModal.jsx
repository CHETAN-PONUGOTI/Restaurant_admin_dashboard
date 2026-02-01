export const DeleteModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[110] p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm p-6 text-center shadow-2xl">
        <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
        <p className="text-gray-500 text-sm mb-6">Are you sure you want to remove this item? This action is permanent.</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 bg-gray-100 rounded-xl font-bold">Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold">Delete</button>
        </div>
      </div>
    </div>
  );
};