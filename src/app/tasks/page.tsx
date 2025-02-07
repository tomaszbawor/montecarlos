import { Button } from "@/components/ui/button";
import { columns, JiraTask } from "./columns";
import { DataTable } from "./data-table";

async function getData(): Promise<JiraTask[]> {
  // Fetch data from your API here.
  return [
    {
      name: "Task 1",
      description: "Description of the task",
      minimumValue: 4,
      maximumValue: 15,
    },
    {
      name: "Task 2",
      description: "Some other description",
      minimumValue: 10,
      maximumValue: 21,
    },
    // ...
  ];
}

export default async function JiraTasksPage() {
  const data = await getData();

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
      <div className="my-2 space-x-1">
        <Button className={"bg-green-400"}>Add Task</Button>
        <Button variant={"destructive"}>Remove Task</Button>
      </div>
    </div>
  );
}

