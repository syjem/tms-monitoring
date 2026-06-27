import Dropzone from '@/components/home/dropzone';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FALLBACK_ATTENDANCE_DEFAULTS } from '@/constants/attendance-defults';

export default function HomeTabsSkeleton() {
  const defaults = FALLBACK_ATTENDANCE_DEFAULTS;

  return (
    <section className="mt-8 max-w-xl mx-auto px-4">
      <Tabs value="upload">
        <TabsList>
          <TabsTrigger
            value="upload"
            className="doc-subtitle px-4 py-2 text-sm"
          >
            Upload
          </TabsTrigger>
          <TabsTrigger
            value="documents"
            className="doc-subtitle px-4 py-2 text-sm"
          >
            Documents
          </TabsTrigger>
        </TabsList>
        <TabsContent value="upload">
          <Dropzone attendanceDefaults={defaults} />
        </TabsContent>
        <TabsContent value="documents">Documents Manager</TabsContent>
      </Tabs>
    </section>
  );
}
