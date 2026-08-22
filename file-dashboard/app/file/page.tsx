"use client";

import UploadFileBox from "@/components/UploadFileBox";

export default function FilePage() {
  return (
    <div
      style={{
        padding: 40,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh"
      }}
    >
      <UploadFileBox
        onUploadSuccess={() => console.log("Refresh the file list!")}
      />
    </div>
  );
}