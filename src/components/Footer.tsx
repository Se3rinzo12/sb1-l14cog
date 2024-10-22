import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between">
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h3 className="text-xl font-bold mb-2">Dashboard</h3>
            <p className="text-gray-400">منصة لربط المبدعين بالشركات في المملكة العربية السعودية</p>
          </div>
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h4 className="text-lg font-semibold mb-2">روابط سريعة</h4>
            <ul className="text-gray-400">
              <li><a href="/" className="hover:text-white">الرئيسية</a></li>
              <li><a href="/about" className="hover:text-white">عن المنصة</a></li>
              <li><a href="/contact" className="hover:text-white">اتصل بنا</a></li>
            </ul>
          </div>
          <div className="w-full md:w-1/3">
            <h4 className="text-lg font-semibold mb-2">تواصل معنا</h4>
            <p className="text-gray-400">البريد الإلكتروني: info@dashboard.sa</p>
            <p className="text-gray-400">الهاتف: +966 12 345 6789</p>
          </div>
        </div>
        <div className="mt-8 text-center text-gray-400">
          <p>&copy; 2024 Dashboard. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;