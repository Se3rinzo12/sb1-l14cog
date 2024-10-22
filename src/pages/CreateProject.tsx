import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { firestore } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface ProjectFormData {
  title: string;
  description: string;
  budget: number;
  deadline: Date;
  skills: string[];
}

const CreateProject: React.FC = () => {
  const { control, handleSubmit, register } = useForm<ProjectFormData>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const onSubmit = async (data: ProjectFormData) => {
    if (!user) return;

    try {
      const projectData = {
        ...data,
        companyId: user.uid,
        companyName: user.displayName,
        status: 'open',
        createdAt: new Date(),
      };

      await addDoc(collection(firestore, 'projects'), projectData);
      toast.success('تم إنشاء المشروع بنجاح');
      navigate('/company-dashboard');
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('حدث خطأ أثناء إنشاء المشروع');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">إنشاء مشروع جديد</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="title" className="block mb-2 font-semibold">عنوان المشروع</label>
          <input
            type="text"
            id="title"
            {...register('title', { required: true })}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="description" className="block mb-2 font-semibold">وصف المشروع</label>
          <textarea
            id="description"
            {...register('description', { required: true })}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
          ></textarea>
        </div>
        <div>
          <label htmlFor="budget" className="block mb-2 font-semibold">الميزانية (ريال سعودي)</label>
          <input
            type="number"
            id="budget"
            {...register('budget', { required: true, min: 0 })}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="deadline" className="block mb-2 font-semibold">الموعد النهائي</label>
          <Controller
            control={control}
            name="deadline"
            render={({ field }) => (
              <DatePicker
                selected={field.value}
                onChange={(date) => field.onChange(date)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                dateFormat="dd/MM/yyyy"
              />
            )}
          />
        </div>
        <div>
          <label htmlFor="skills" className="block mb-2 font-semibold">المهارات المطلوبة</label>
          <input
            type="text"
            id="skills"
            {...register('skills')}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="أدخل المهارات مفصولة بفواصل"
          />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
          إنشاء المشروع
        </button>
      </form>
    </div>
  );
};

export default CreateProject;