"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

interface Props {
  onFileSelected: (file: File, preview: string) => void;
}

export default function ImageUploader({ onFileSelected }: Props) {
  const [dragActive, setDragActive] = useState(false);

  const onDrop = useCallback(
    (accepted: File[]) => {
      if (accepted.length === 0) return;
      const file = accepted[0];
      const preview = URL.createObjectURL(file);
      onFileSelected(file, preview);
    },
    [onFileSelected]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/jpeg": [], "image/png": [], "image/webp": [] },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
    onDropAccepted: () => setDragActive(false),
    onDropRejected: () => setDragActive(false),
  });

  return (
    <div
      {...getRootProps()}
      className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-2xl cursor-pointer transition-colors ${
        dragActive
          ? "border-green-500 bg-green-50 dark:bg-green-950"
          : "border-gray-300 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800"
      }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-3 text-center px-4">
        <div className="text-5xl">📷</div>
        <p className="text-lg font-medium text-gray-700 dark:text-gray-200">
          Drop a food photo here
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          or click to select — JPEG, PNG, WebP up to 10MB
        </p>
      </div>
    </div>
  );
}
