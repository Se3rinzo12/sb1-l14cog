import React from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

interface ProfileFormData {
  displayName: string;
  bio: string;
  skills?: string;
  companySize?: string;
  industry?: string;
}

const EditProfile: React.FC = () => {
  const { user, updateUserProfile } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormData>({
    defaultValues: {
      displayName: user?.displayName || '',
      bio: user?.bio || '',
      skills: user?.skills?.join(', ') || '',
      companySize: user?.companySize || '',
      industry: user?.industry || '',
    },
  });
  const navigate = useNavigate();

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const updatedData: Partial<ProfileFormData> = {
        displayName: data.displayName,
        bio: data.bio,
        profileComplete: true,
      };

      if (user?.role === 'creator') {
        updatedData.skills = data.skills?.split(',').map(skill => skill.trim());
      } else if (user?.role === 'company') {
        updatedData.companySize = data.companySize;
        updatedData.industry = data.industry;
      }

      await updateUserProfile(updatedData);
      toast.success('تم تحديث الملف الشخصي بنجاح');
      navigate(user?.role === 'creator' ? '/creator-dashboard' : '/company-dashboard');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('حدث خطأ أثناء تحديث الملف الشخصي');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">تعديل الملف الشخصي</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="displayName" className="block mb-2 font-semibold">الاسم</label>
          <input
            type="text"
            id="displayName"
            {...register('displayName', { required: 'الاسم مطلوب' })}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.displayName && <p className="text-red-500 mt-1">{errors.displayName.message}</p>}
        </div>
        <div>
          <label htmlFor="bio" className="block mb-2 font-semibold">نبذة شخصية</label>
          <textarea
            id="bio"
            {...register('bio', { required: 'النبذة الشخصية مطلوبة' })}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
          ></textarea>
          {errors.bio && <p className="text-red-500 mt-1">{errors.bio.message}</p>}
        </div>
        {user?.role === 'creator' && (
          <div>
            <label htmlFor="skills" className="block mb-2 font-semibold">المهارات</label>
            <input
              type="text"
              id="skills"
              {...register('skills')}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="أدخل المهارات مفصولة بفواصل"
            />
          </div>
        )}
        {user?.role === 'company' && (
          <>
            <div>
              <label htmlFor="companySize" className="block mb-2 font-semibold">حجم الشركة</label>
              <select
                id="companySize"
                {...register('companySize', { required: 'حجم الشركة مطلوب' })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">اختر حجم الشركة</option>
                <option value="1-10">1-10 موظفين</option>
                <option value="11-50">11-50 موظف</option>
                <option value="51-200">51-200 موظف</option>
                <option value="201-500">201-500 موظف</option>
                <option value="500+">أكثر من 500 موظف</option>
              </select>
              {errors.companySize && <p className="text-red-500 mt-1">{errors.companySize.message}</p>}
            </div>
            <div>
              <label htmlFor="industry" className="block mb-2 font-semibold">مجال العمل</label>
              <input
                type="text"
                id="industry"
                {...register('industry', { required: 'مجال العمل مطلوب' })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.industry && <p className="text-red-500 mt-1">{errors.industry.message}</p>}
            </div>
          </>
        )}
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
          حفظ التغييرات
        </button>
      </form>
    </div>
  );
};

export default EditProfile;