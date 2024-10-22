import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { firestore } from '../firebase';

interface Project {
  id: string;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  companyName: string;
}

const ProjectListing: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectsRef = firestore.collection('projects');
        const snapshot = await projectsRef.get();
        const fetchedProjects = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Project[];
        setProjects(fetchedProjects);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return <div>جاري التحميل...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">المشاريع المتاحة</h1>
      {projects.length === 0 ? (
        <p>لا توجد مشاريع متاحة حالياً.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-2">{project.title}</h2>
              <p className="text-gray-600 mb-4">{project.description.substring(0, 100)}...</p>
              <p className="mb-2">الميزانية: {project.budget} ريال سعودي</p>
              <p className="mb-4">الموعد النهائي: {project.deadline}</p>
              <Link to={`/project/${project.id}`} className="text-blue-600 hover:underline">عرض التفاصيل</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectListing;