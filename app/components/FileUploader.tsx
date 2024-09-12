import { useState } from "react";
import Papa from "papaparse"; // CSV parser
import * as XLSX from "xlsx"; // XLS parser

interface FileUploaderProps {
  onData: (data: any) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onData }) => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0] || null;
    setFile(uploadedFile);
  };

  const handleFileUpload = () => {
    if (!file) return;

    const fileExtension = file.name.split(".").pop()?.toLowerCase();

    if (fileExtension === "csv") {
      Papa.parse(file, {
        header: true,
        complete: (result: any) => {
          onData(result.data);
        },
      });
    } else if (fileExtension === "xls" || fileExtension === "xlsx") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        onData(jsonData);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <div className="file-uploader">
      <input type="file" accept=".csv,.xls,.xlsx" onChange={handleFileChange} />
      <button
        onClick={handleFileUpload}
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md"
      >
        Upload
      </button>
    </div>
  );
};

export default FileUploader;
