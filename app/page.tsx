"use client";
import { useState } from "react";
import FileUploader from "@components/FileUploader";
import DataTable from "@components/DataTable";
import { useMemo } from "react";
import { createColumnHelper } from "@tanstack/react-table";

interface TableData {
  [key: string]: any;
}

export default function Home() {
  const [data, setData] = useState<TableData[]>([]);

  const columnHelper = createColumnHelper<TableData>();

  const columns = useMemo(() => {
    if (data.length === 0) return [];
    const keys = Object.keys(data[0]);
    return keys.map((key) =>
      columnHelper.accessor(key, {
        header: () => key,
        cell: (info) => info.getValue(),
      })
    );
  }, [data]);
  console.log("data in csv", data);
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">{"CSV/XLS => Data Table"}</h1>
      <FileUploader onData={setData} />
      {data.length > 0 && <DataTable columns={columns} data={data} />}
    </div>
  );
}
