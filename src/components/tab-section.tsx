import { getWorkLogs } from '@/app/actions/logs/get-work-logs';
import { MainTab } from '@/components/tabs';

async function TabSection() {
  const workLogs = await getWorkLogs();

  return (
    <section className="mt-6 max-w-xl mx-auto px-4">
      <MainTab logs={workLogs} />
    </section>
  );
}

export default TabSection;
