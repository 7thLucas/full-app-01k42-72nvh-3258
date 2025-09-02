import React, { useState } from 'react';
import { ShoppingCart, Plus, Filter, Search } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils';
import { ORDER_STATUSES } from '../constants';
import type { PurchaseOrder } from '../types';

const mockOrders: PurchaseOrder[] = [
  {
    id: '1',
    orderNumber: 'PO-001',
    supplierId: '1',
    status: 'pending',
    orderDate: new Date('2025-09-02'),
    expectedDeliveryDate: new Date('2025-09-05'),
    totalAmount: 2500000,
    items: [],
  },
  {
    id: '2',
    orderNumber: 'PO-002',
    supplierId: '2',
    status: 'delivered',
    orderDate: new Date('2025-08-30'),
    actualDeliveryDate: new Date('2025-09-01'),
    totalAmount: 1800000,
    items: [],
  },
];

export default function RestockOrdersPage() {
  const [statusFilter, setStatusFilter] = useState('');

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Pesanan Restok</h1>
            <button className="bg-primary-600 text-white px-4 py-2 rounded-lg">
              <Plus className="w-5 h-5 inline mr-2" />
              Buat Pesanan
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
        {mockOrders.map((order) => {
          const statusConfig = ORDER_STATUSES.find(s => s.id === order.status);
          
          return (
            <div key={order.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{order.orderNumber}</h3>
                  <p className="text-gray-600">Tanggal: {formatDate(order.orderDate)}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig?.color}`}>
                  {statusConfig?.label}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold">{formatCurrency(order.totalAmount)}</span>
                <button className="text-primary-600 hover:text-primary-800">
                  Lihat Detail →
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
