"use client";

import { Button } from "./ui/Button";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

const CloseModal = () => {
  const router = useRouter();
  return (
    <Button
      onClick={() => router.back()}
      variant="subtle"
      aria-label="close modal"
      className="h-6 w-6 p-0 rounded-md"
    >
      <X className="h-4 w-4" />
    </Button>
  );
};

export default CloseModal;
