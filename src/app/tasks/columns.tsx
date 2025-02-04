'use client'

import {ColumnDef} from "@tanstack/table-core";

export type JiraTask = {
    name: string,
    description: string,
    minimumValue: number,
    maximumValue: number,
}

export const columns: ColumnDef<JiraTask>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "description",
        header: "Description",
    }, {
        accessorKey: "minimumValue",
        header: "Minimum Value",
    }, {
        accessorKey: "maximumValue",
        header: "Maximum Value",
    }
]