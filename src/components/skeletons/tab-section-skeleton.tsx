import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function TabsSectionSkeleton() {
  return (
    <section className="mt-6 max-w-xl mx-auto px-4">
      <Tabs defaultValue="upload">
        <TabsList>
          <TabsTrigger
            value="upload"
            className="px-4 py-2 data-[state=active]:text-muted-foreground data-[state=active]:border-transparent data-[state=active]:bg-transparent"
          >
            Upload
          </TabsTrigger>
          <TabsTrigger value="files" className="px-4 py-2">
            Files
          </TabsTrigger>
        </TabsList>
        <TabsContent value="upload">
          <div className="rounded-lg border-2 border-dashed bg-white transition-all duration-500 border-gray-300 hover:border-gray-400 hover:shadow-md">
            <Skeleton className="h-[208px] w-full" />
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
}
