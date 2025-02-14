"use client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export function AdminAddButton() {
  const router = useRouter();
  const handleClick = () => {
    router.push("/blogs/create");
  };
  return (
    <div className="w-full text-center py-8">
      <Button onClick={() => handleClick()} className="w-[50vw] py-8 text-xl">
        <span className="mr-3">Add</span>
        <Plus />
      </Button>
    </div>
  );
}
