"use client";

import React, { useState, useRef } from "react";
import * as stylex from "@stylexjs/stylex";
import { colors } from "@/constants/colors.stylex";
import CustomButton from "@/components/CustomButton";
import { uploadFile } from "@/api/file";

interface FileUploadProps {
  onUploadSuccess?: () => void;
}

export default function UploadFileBox({
  onUploadSuccess,
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
      setStatus("idle");
      setErrorMessage("");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setStatus("idle");
      setErrorMessage("");
    }
  };

  const handleUploadClick = async () => {
    if (!file) return;

    setStatus("uploading");
    setErrorMessage("");

    try {
      await uploadFile(file);
      setStatus("success");
      setFile(null);
      if (onUploadSuccess) onUploadSuccess();
    } catch (error: any) {
      setStatus("error");
      setErrorMessage(error.message || "Something went wrong during upload.");
    }
  };

  return (
    <div {...stylex.props(styles.container)}>
      <div
        {...stylex.props(styles.dropZone, isDragging && styles.dropZoneActive)}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          {...stylex.props(styles.hiddenInput)}
          aria-label="Upload file"
        />

        <div {...stylex.props(styles.dropZoneContent)}>
          {file ? (
            <span {...stylex.props(styles.fileName)}>{file.name}</span>
          ) : (
            <span {...stylex.props(styles.placeholderText)}>
              Click to select or drag and drop a file here
            </span>
          )}
        </div>
      </div>

      {status === "error" && (
        <span {...stylex.props(styles.errorText)}>{errorMessage}</span>
      )}

      {status === "success" && (
        <span {...stylex.props(styles.successText)}>
          File uploaded successfully!
        </span>
      )}

      <CustomButton
        label={status === "uploading" ? "Uploading..." : "Upload File"}
        onPress={handleUploadClick}
        disabled={!file || status === "uploading"}
        style={styles.uploadButton}
      />
    </div>
  );
}

const styles = stylex.create({
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    width: "100%",
    maxWidth: "500px",
  },
  dropZone: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "150px",
    borderWidth: "2px",
    borderStyle: "dashed",
    borderColor: colors.GRAY_400,
    borderRadius: "12px",
    backgroundColor: colors.WHITE,
    cursor: "pointer",
    transitionProperty: "border-color, background-color",
    transitionDuration: "0.2s",
    padding: "20px",
    textAlign: "center",
  },
  dropZoneActive: {
    borderColor: colors.BLACK,
    backgroundColor: colors.GRAY_100,
  },
  hiddenInput: {
    display: "none",
  },
  dropZoneContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
  },
  placeholderText: {
    fontSize: "15px",
    color: colors.GRAY_500,
  },
  fileName: {
    fontSize: "16px",
    fontWeight: "bold",
    color: colors.BLACK,
    wordBreak: "break-all",
  },
  errorText: {
    color: colors.RED_500,
    fontSize: "14px",
    textAlign: "center",
  },
  successText: {
    color: colors.GREEN_600,
    fontSize: "14px",
    textAlign: "center",
  },
  uploadButton: {
    marginTop: "8px",
  },
});
