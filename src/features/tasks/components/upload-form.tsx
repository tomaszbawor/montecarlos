import Papa from "papaparse";
import type React from "react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";

interface UploadButtonProps {
  onData: (data: UploadDataItem[]) => void;
}

export interface UploadDataItem {
  name: string;
  min: number;
  max: number;
}

export function UploadForm({ onData }: UploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  type CsvRow = [string, string, string, string];

  const isValidRow = (row: string[]): row is CsvRow => row.length >= 4;

  const mapObjects = (csvData: string[][]): UploadDataItem[] => {
    return csvData
      .slice(1)
      .filter(isValidRow)
      .map(([projectName, taskName, minValue, maxValue]) => {
        return {
          name: `${projectName}: ${taskName}`,
          min: Number.parseInt(minValue, 10),
          max: Number.parseInt(maxValue, 10),
        };
      });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const csv = Papa.parse<string[]>(text, { skipEmptyLines: true });
      onData(mapObjects(csv.data));
    };
    reader.readAsText(file);
    // Reset input so the same file can be uploaded again if needed
    e.target.value = "";
  };

  return (
    <>
      <Button onClick={handleButtonClick}>Import CSV</Button>
      <input
        type="file"
        accept=".csv"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </>
  );
}
