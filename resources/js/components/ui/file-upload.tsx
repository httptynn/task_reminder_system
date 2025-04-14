import * as React from "react";
import { CloudUpload, FileText, Image, Video, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  className?: string;
}

export function FileUpload({ onFileSelect, className }: FileUploadProps) {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Handle button click to trigger file input
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    onFileSelect(file); // Notify parent component
  };

  // Handle file removal
  const handleRemoveFile = () => {
    setSelectedFile(null);
    onFileSelect(null); // Notify parent component
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset the file input
    }
  };

  // Determine the icon based on file type
  const getFileIcon = (file: File) => {
    const fileType = file.type;
    if (fileType.startsWith("image/")) {
      return <Image className="h-12 w-12 text-blue-600" />;
    } else if (fileType.startsWith("video/")) {
      return <Video className="h-12 w-12 text-blue-600" />;
    } else if (
      fileType.includes("pdf") ||
      fileType.includes("doc") ||
      fileType.includes("docx")
    ) {
      return <FileText className="h-12 w-12 text-blue-600" />;
    }
    return <FileText className="h-12 w-12 text-blue-600" />; // Default icon for unknown types
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 dark:bg-background",
        className
      )}
    >
      {selectedFile ? (
        // UI when a file is attached
        <div className="flex flex-col items-center">
          <div className="relative">
            {/* File Icon */}
            {getFileIcon(selectedFile)}
            {/* Remove Button */}
            <button
              onClick={handleRemoveFile}
              className="absolute top-0 right-0 -mt-2 -mr-2 bg-gray-200 rounded-full p-1"
            >
              <X className="h-4 w-4 text-gray-600" />
            </button>
          </div>
          {/* File Name */}
          <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
            {selectedFile.name}
          </p>
          {/* Upload Another File Button */}
          <Button
            onClick={handleUploadClick}
            className="mt-4 bg-blue-600 text-white hover:bg-blue-700"
          >
            Upload file
          </Button>
        </div>
      ) : (
        // UI when no file is attached
        <>
          {/* Cloud Icon */}
          <CloudUpload className="h-12 w-12 text-gray-400 mb-2" />
          {/* Upload Text */}
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Upload file here
          </p>
          {/* Upload Button */}
          <Button
            onClick={handleUploadClick}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            Upload file
          </Button>
        </>
      )}
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*,video/*,.pdf,.doc,.docx"
      />
    </div>
  );
}