import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { firestore } from '../firebase';
import { collection, query, where, getDocs, addDoc, Timestamp } from 'firebase/firestore';
import { toast } from 'react-toastify';

interface Payment {
  id: string;
  amount: number;
  projectId: string;
  creatorId: string;
  companyId: string;
  status: 'pending' | 'completed';
  createdAt: Timestamp;
}

const PaymentManagement: React.FC = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      if (!user) return;

      const q = query(
        collection(firestore, 'payments'),
        where(user.role === 'creator' ? 'creatorId' : 'companyId', '==', user.uid)
      );

      try {
        const querySnapshot = await getDocs(q);
        const fetchedPayments: Payment[] = [];
        querySnapshot.forEach((doc) => {
          fetchedPayments.push({ id: doc.id, ...doc.data() } as Payment);
        });
        setPayments(fetchedPayments);
      } catch (error) {
        console.error('Error fetching payments:', error);
        toast.error('حدث خطأ أثناء جلب المدفوعات');
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [user]);

  const handlePayment = async (payment: Payment) => {
    if (user?.role !== 'company') return;

    try {
      // In a real application, you would integrate with a payment gateway here
      await addDoc(collection(firestore, 'transactions'), {
        paymentId: payment.id,
        amount: payment.amount,
        status: 'completed',
        createdAt: Timestamp.now(),
      });

      // Update the payment status
      // This should be done in a Cloud Function to ensure data integrity
      toast.success('تم إتمام الدفع بنجاح');
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error('حدث خطأ أثناء معالجة الدفع');
    }
  };

  if (loading) {
    return <div>جاري التحميل...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">إدارة المدفوعات</h1>
      {payments.length === 0 ? (
        <p>لا توجد مدفوعات حالياً.</p>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  المبلغ
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الحالة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  التاريخ
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.map((payment) => (
                <tr key={payment.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {payment.amount} ريال سعودي
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {payment.status === 'pending' ? 'قيد الانتظار' : 'مكتمل'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {payment.createdAt.toDate().toLocaleDateString('ar-SA')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user?.role === 'company' && payment.status === 'pending' && (
                      <button
                        onClick={() => handlePayment(payment)}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                      >
                        إتمام الدفع
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PaymentManagement;