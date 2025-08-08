import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import Papa from 'papaparse';

interface UploadButtonProps {
  onData: (data: UploadDataItem[]) => void;
}

export interface UploadDataItem {
  name: string;
  min: number;
  max: number;
}

export function UploadForm({onData}: UploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const mapObjects = (csvData: any[]): UploadDataItem[] => {
    return csvData.slice(1).map((obj: string[]) => {
      return {
        name: `${obj[0]}: ${obj[1]}`,
        min: parseInt(obj[2]),
        max: parseInt(obj[3]),
      }
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const csv = Papa.parse(text);
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
        style={{display: "none"}}
        onChange={handleFileChange}
      />
    </>
  );
}
