import { Button } from "@/components/ui/button";
import { TaskCsvImport } from "@/features/tasks/components/task-csv-import";

export default function CsvPage() {
  return (
    <div className="p-6 md:p-8">
      <div className="mx-auto w-full max-w-5xl space-y-6">
        <div className="space-y-1 ">
          <TaskCsvImport />
        </div>
        <div>
          <Button>Download Example CSV</Button>
        </div>
      </div>
    </div>
  );
}
