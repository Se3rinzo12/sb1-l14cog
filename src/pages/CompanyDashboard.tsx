import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useQuery } from 'react-query';
import { firestore } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const CompanyDashboard: React.FC = () => {
  const { user } = useAuth();

  const { data: projects } = useQuery('companyProjects', async () => {
    if (!user) return [];
    const q = query(collection(firestore, 'projects'), where('companyId', '==', user.uid));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  });

  const { data: applications } = useQuery('companyApplications', async () => {
    if (!user) return [];
    const q = query(collection(firestore, 'applications'), where('companyId', '==', user.uid));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  });

  const activeProjects = projects?.filter(project => project.status === 'in_progress').length || 0;
  const totalSpending = projects?.reduce((sum, project) => sum + project.budget, 0) || 0;

  const chartData = {
    labels: ['مشاريع نشطة', 'مشاريع مكتملة', 'مشاريع معلقة'],
    datasets: [
      {
        data: [activeProjects, projects?.filter(p => p.status === 'completed').length || 0, projects?.filter(p => p.status === 'pending').length || 0],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">لوحة تحكم الشركة</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">ملخص الحساب</h2>
          <p className="mb-2">مرحباً، {user?.displayName || 'شركة'}</p>
          <p className="mb-2">البريد الإلكتروني: {user?.email}</p>
          <p className="mb-4">المشاريع النشطة: {activeProjects}</p>
          <p className="mb-4">إجمالي الإنفاق: {totalSpending} ريال سعودي</p>
          <Link to="/edit-profile" className="text-blue-600 hover:underline">تعديل ملف الشركة</Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">حالة المشاريع</h2>
          <Pie data={chartData} />
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
      <div className="mt-8 flex space-x-4">
        <Link to="/create-project" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          إنشاء مشروع جديد
        </Link>
        <Link to="/projects" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          استعراض المبدعين
        </Link>
      </div>
    </div>
  );
};

export default CompanyDashboard;