import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { firestore } from '../firebase';
import { doc, getDoc, updateDoc, collection, addDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

interface Project {
  id: string;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  companyName: string;
  companyId: string;
  status: 'open' | 'in_progress' | 'completed';
  skills: string[];
}

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [applicationText, setApplicationText] = useState('');

  const { data: project, isLoading } = useQuery(['project', id], async () => {
    if (!id) return null;
    const docRef = doc(firestore, 'projects', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Project : null;
  });

  const applyMutation = useMutation(
    async (applicationData: { projectId: string; creatorId: string; text: string }) => {
      await addDoc(collection(firestore, 'applications'), {
        ...applicationData,
        status: 'pending',
        createdAt: new Date(),
      });
    },
    {
      onSuccess: () => {
        toast.success('تم تقديم طلبك بنجاح!');
        queryClient.invalidateQueries(['project', id]);
      },
      onError: () => {
        toast.error('حدث خطأ أثناء تقديم الطلب');
      },
    }
  );

  const handleApply = () => {
    if (!user || !project) return;
    applyMutation.mutate({
      projectId: project.id,
      creatorId: user.uid,
      text: applicationText,
    });
  };

  const updateProjectStatus = useMutation(
    async (newStatus: Project['status']) => {
      if (!id) return;
      const projectRef = doc(firestore, 'projects', id);
      await updateDoc(projectRef, { status: newStatus });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['project', id]);
        toast.success('تم تحديث حالة المشروع');
      },
      onError: () => {
        toast.error('حدث خطأ أثناء تحديث حالة المشروع');
      },
    }
  );

  if (isLoading) return <div>جاري التحميل...</div>;
  if (!project) return <div>لم يتم العثور على المشروع.</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
      <p className="text-gray-600 mb-4">{project.description}</p>
      <div className="mb-4">
        <p><strong>الميزانية:</strong> {project.budget} ريال سعودي</p>
        <p><strong>الموعد النهائي:</strong> {project.deadline}</p>
        <p><strong>الشركة:</strong> {project.companyName}</p>
        <p><strong>الحالة:</strong> {project.status === 'open' ? 'مفتوح' : project.status === 'in_progress' ? 'قيد التنفيذ' : 'مكتمل'}</p>
        <p><strong>المهارات المطلوبة:</strong> {project.skills.join(', ')}</p>
      </div>
      {user && user.role === 'creator' && project.status === 'open' && (
        <div className="mb-4">
          <textarea
            value={applicationText}
            onChange={(e) => setApplicationText(e.target.value)}
            placeholder="اكتب رسالة تقديم..."
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
            rows={4}
          ></textarea>
          <button
            onClick={handleApply}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            تقديم طلب
          </button>
        </div>
      )}
      {user && user.uid === project.companyId && (
        <div className="mt-4">
          <button
            onClick={() => updateProjectStatus.mutate('in_progress')}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mr-2"
            disabled={project.status !== 'open'}
          >
            بدء المشروع
          </button>
          <button
            onClick={() => updateProjectStatus.mutate('completed')}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            disabled={project.status !== 'in_progress'}
          >
            إكمال المشروع
          </button>
        </div>
      )}
      <button
        onClick={() => navigate(-1)}
        className="mt-4 text-blue-600 hover:underline"
      >
        العودة
      </button>
    </div>
  );
};

export default ProjectDetails;