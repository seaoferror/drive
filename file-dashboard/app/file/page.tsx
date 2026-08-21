"use client";

import FileUpload from "@/components/UploadFile";

export default function FilePage() {
  return (
    <div style={{ padding: 40, display: "flex", justifyContent: "center" }}>
      <FileUpload
        onUploadSuccess={() => console.log("Refresh the file list!")}
      />
    </div>
  );
}