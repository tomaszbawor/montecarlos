import {columns, JiraTask} from "./columns"
import {DataTable} from "./data-table"

async function getData(): Promise<JiraTask[]> {
    // Fetch data from your API here.
    return [
        {
            name: "ELO",
            description: "Desc",
            minimumValue: 10,
            maximumValue: 15,
        },
        // ...
    ]
}

export default async function JiraTasksPage() {
    const data = await getData()

    return (
        <div className="container mx-auto py-10">
            <DataTable columns={columns} data={data}/>
        </div>
    )
}