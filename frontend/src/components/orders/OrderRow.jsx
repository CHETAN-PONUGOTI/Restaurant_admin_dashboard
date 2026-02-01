import { Badge } from '../common/Badge';

export const OrderRow = ({ order }) => {
  const getVariant = (status) => {
    if (status === 'Delivered') return 'green';
    if (status === 'Pending') return 'orange';
    if (status === 'Cancelled') return 'red';
    return 'gray';
  };

  return (
    <tr className="hover:bg-gray-50/50 transition-colors">
      <td className="px-6 py-4 font-mono text-xs text-gray-400">{order.orderNumber}</td>
      <td className="px-6 py-4">
        <div className="font-semibold text-gray-800">{order.customerName}</div>
        <div className="text-xs text-gray-400">Table {order.tableNumber}</div>
      </td>
      <td className="px-6 py-4 text-sm text-gray-600">
        {order.items.map(i => `${i.quantity}x ${i.menuItem.name}`).join(', ')}
      </td>
      <td className="px-6 py-4 font-bold text-gray-900">${order.totalAmount.toFixed(2)}</td>
      <td className="px-6 py-4">
        <Badge variant={getVariant(order.status)}>{order.status}</Badge>
      </td>
    </tr>
  );
};