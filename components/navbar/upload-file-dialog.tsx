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
import { instance } from "@/lib/axios-config";
import { CheckCircleIcon, FileWarningIcon, Loader2 } from "lucide-react";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const UploadFileDialog = ({ open, setOpen }: Props) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploadSuccess, setIsUploadSuccess] = useState(false);
  const [isDuplicateDocument, setIsDuplicateDocument] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUploadSubmit = async () => {
    setLoading(true);
    if (!file) return console.error("No file selected");
    try {
      const formData = new FormData();
      formData.append("file", file);

      const resp = await instance.post("/file", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setIsUploadSuccess(true);
      console.log(resp);
    } catch (error: any) {
      if (error.response && error.response.status === 409) {
        setIsDuplicateDocument(true);
      }
      console.error(error.message);
    } finally {
      setLoading(false);
      setFile(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <DialogContent className="min-h-[180px]">
        {rendereDialog(
          loading,
          isUploadSuccess,
          isDuplicateDocument,
          file,
          handleFileChange,
          handleUploadSubmit,
        )}
      </DialogContent>
    </Dialog>
  );
};

const rendereDialog = (
  loading: boolean,
  isUploadSuccess: boolean,
  isDuplicateDocument: boolean,
  file: File | null,
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  handleUploadSubmit: () => void,
) => {
  if (loading)
    return <Loader2 className="mx-auto mt-10 h-10 w-10 animate-spin" />;

  if (isUploadSuccess) {
    return (
      <DialogHeader>
        <DialogTitle>Upload Success</DialogTitle>
        <DialogDescription>
          <CheckCircleIcon className="mx-auto mt-10 h-10 w-10 text-green-700" />
        </DialogDescription>
      </DialogHeader>
    );
  }

  if (isDuplicateDocument) {
    return (
      <DialogHeader>
        <DialogTitle> Document already exists</DialogTitle>
        <DialogDescription>
          <FileWarningIcon className="mx-auto mt-10 h-10 w-10 text-orange-300" />
        </DialogDescription>
      </DialogHeader>
    );
  }

  return (
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
          className="disabled:curspor-pointer mt-3 disabled:bg-gray-300 disabled:text-gray-800"
          disabled={file ? false : true}
        >
          Submit
        </Button>
      </DialogFooter>
    </div>
  );
};

export default UploadFileDialog;
