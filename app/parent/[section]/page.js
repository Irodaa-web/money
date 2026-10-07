import { notFound } from 'next/navigation';
import Dashboard from '@/components/Dashboard';
export default async function ParentSection({ params }) {
  const { section } = await params;
  if (!['tasks', 'goals', 'wallet', 'family', 'notifications', 'learn'].includes(section)) notFound();
  return <Dashboard role="parent" section={section} />;
}
