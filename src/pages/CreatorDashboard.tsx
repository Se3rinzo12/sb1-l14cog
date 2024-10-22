import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useQuery } from 'react-query';
import { firestore } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const CreatorDashboard: React.FC = () => {
  const { user } = useAuth();

  const { data: projects } = useQuery('creatorProjects', async () => {
    if (!user) return [];
    const q = query(collection(firestore, 'projects'), where('creatorId', '==', user.uid));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  });

  const { data: earnings } = useQuery('creatorEarnings', async () => {
    if (!user) return [];
    const q = query(collection(firestore, 'payments'), where('creatorId', '==', user.uid));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  });

  const totalEarnings = earnings?.reduce((sum, payment) => sum + payment.amount, 0) || 0;
  const completedProjects = projects?.filter(project => project.status === 'completed').length || 0;

  const chartData = {
    labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'],
    datasets: [
      {
        label: 'الأرباح الشهرية (ريال سعودي)',
        data: [12000, 19000, 3000, 5000, 2000, 3000],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">لوحة تحكم المبدع</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">ملخص الحساب</h2>
          <p className="mb-2">مرحباً، {user?.displayName || 'مبدع'}</p>
          <p className="mb-2">البريد الإلكتروني: {user?.email}</p>
          <p className="mb-4">المشاريع المكتملة: {completedProjects}</p>
          <p className="mb-4">إجمالي الأرباح: {totalEarnings} ريال سعودي</p>
          <Link to="/edit-profile" className="text-blue-600 hover:underline">تعديل الملف الشخصي</Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">الأرباح الشهرية</h2>
          <Bar data={chartData} />
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">المشاريع الحالية</h2>
        {projects && projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project: any) => (
              <div key={project.id} className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
                <p className="text-sm text-gray-600 mb-2">الحالة: {project.status}</p>
                <Link to={`/project/${project.id}`} className="text-blue-600 hover:underline">عرض التفاصيل</Link>
              </div>
            ))}
          </div>
        ) : (
          <p>لا توجد مشاريع حالية.</p>
        )}
      </div>
      <div className="mt-8">
        <Link to="/projects" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          استكشف المشاريع الجديدة
        </Link>
      </div>
    </div>
  );
};

export default CreatorDashboard;