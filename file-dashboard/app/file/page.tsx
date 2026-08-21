"use client";


import UploadFileBox from "@/components/UploadFileBox";

export default function FilePage() {
  return (
    <div style={{ padding: 40, display: "flex", justifyContent: "center" }}>
      <UploadFileBox
        onUploadSuccess={() => console.log("Refresh the file list!")}
      />
    </div>
  );
}