import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { CheckCircleIcon, FileWarningIcon, Loader2 } from "lucide-react";
import { instance } from "@/lib/axios-config";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}

type UploadStatus = "idle" | "loading" | "success" | "duplicate";

const UploadFileDialog: React.FC<Props> = ({ open, setOpen }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
  };

  const handleUploadSubmit = async () => {
    if (!file) return;
    setUploadStatus("loading");
    try {
      const formData = new FormData();
      formData.append("file", file);

      await instance.post("/file", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUploadStatus("success");
    } catch (error: any) {
      setUploadStatus(error.response?.status === 409 ? "duplicate" : "idle");
      console.error(error.message);
    } finally {
      setFile(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <DialogContent className="min-h-[180px]">
        {renderDialogContent(
          uploadStatus,
          file,
          handleFileChange,
          handleUploadSubmit,
        )}
      </DialogContent>
    </Dialog>
  );
};

const renderDialogContent = (
  status: UploadStatus,
  file: File | null,
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  handleUploadSubmit: () => void,
) => {
  const statusContent = {
    loading: <Loader2 className="mx-auto mt-10 h-10 w-10 animate-spin" />,
    success: (
      <DialogHeader>
        <DialogTitle>Upload Success</DialogTitle>
        <DialogDescription>
          <CheckCircleIcon className="mx-auto mt-10 h-10 w-10 text-green-700" />
        </DialogDescription>
      </DialogHeader>
    ),
    duplicate: (
      <DialogHeader>
        <DialogTitle>Document already exists</DialogTitle>
        <DialogDescription>
          <FileWarningIcon className="mx-auto mt-10 h-10 w-10 text-orange-300" />
        </DialogDescription>
      </DialogHeader>
    ),
    idle: (
      <div>
        <DialogHeader>
          <DialogTitle>Upload a Document</DialogTitle>
          <DialogDescription>
            <Input type="file" className="mt-2" onChange={handleFileChange} />
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            onClick={handleUploadSubmit}
            className="mt-3 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-800"
            disabled={!file}
          >
            Submit
          </Button>
        </DialogFooter>
      </div>
    ),
  };

  return statusContent[status];
};

export default UploadFileDialog;
