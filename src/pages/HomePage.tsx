import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Building2, TrendingUp, Search } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-6">مرحباً بك في Dashboard</h1>
      <p className="text-xl mb-8">المنصة الرائدة لربط المبدعين بالشركات في المملكة العربية السعودية</p>
      
      <div className="mb-12">
        <form className="max-w-2xl mx-auto">
          <div className="flex">
            <input
              type="text"
              placeholder="ابحث عن مبدعين أو مشاريع..."
              className="flex-grow px-4 py-2 rounded-r-lg border-t border-b border-r border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-l-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Search className="h-5 w-5" />
            </button>
          </div>
        </form>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">للمبدعين</h2>
          <p className="mb-4">اعرض خدماتك وتواصل مع الشركات الكبرى</p>
          <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">سجل كمبدع</Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <Building2 className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">للشركات</h2>
          <p className="mb-4">اكتشف المبدعين المناسبين لحملاتك التسويقية</p>
          <Link to="/register" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">سجل كشركة</Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <TrendingUp className="h-12 w-12 text-purple-600 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">نمو مستمر</h2>
          <p className="mb-4">انضم إلى مجتمع متنامي من المبدعين والشركات</p>
          <Link to="/projects" className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">استكشف المشاريع</Link>
        </div>
      </div>
      
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-4">لماذا Dashboard؟</h2>
        <ul className="text-lg">
          <li className="mb-2">✓ سهولة التواصل بين المبدعين والشركات</li>
          <li className="mb-2">✓ فرص عمل متنوعة للمبدعين</li>
          <li className="mb-2">✓ وصول الشركات لأفضل المواهب المحلية</li>
          <li className="mb-2">✓ نظام دفع آمن وموثوق</li>
          <li className="mb-2">✓ إدارة المشاريع بكفاءة</li>
          <li className="mb-2">✓ تقييمات وتعليقات لبناء السمعة</li>
        </ul>
      </section>
      
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-4">أحدث المشاريع</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* This would be replaced with actual project data */}
          {[1, 2, 3].map((project) => (
            <div key={project} className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">عنوان المشروع {project}</h3>
              <p className="text-gray-600 mb-4">وصف مختصر للمشروع...</p>
              <Link to={`/project/${project}`} className="text-blue-600 hover:underline">التفاصيل</Link>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <Link to="/projects" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">عرض جميع المشاريع</Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;