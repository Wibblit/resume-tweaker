import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createResume } from "@/actions/createResume";
import { setCurrentResume } from "@/slices/currentResumeSlices";
import { useAppDispatch } from "@/hooks/hooks";
import { useToast } from "@/hooks/use-toast";
import { UpdateId } from "@/slices/rightsidebarSlice";

export function CreateNewDialog({
  children,
  template,
  templateId,
}: {
  children: React.ReactNode;
  template: boolean;
  templateId?: number;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleCreate = async () => {
    if (template) {
      dispatch(UpdateId(templateId));
    }
    if (name.trim()) {
      setLoading(true);
      try {
        const response = await createResume(name);

        if (response && response.success) {
          localStorage.setItem("currResumeId", response?.resume?.id as string);
          dispatch(
            setCurrentResume({
              currResumeId: response?.resume?.id as string,
              currResumeName: response?.resume?.resumeName as string,
            })
          );
          setOpen(false);
          router.push("/editor");
        } else {
          toast({
            title: "Error",
            description: response.message || "Failed to create resume",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("An error occurred:", error);
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Resume</DialogTitle>
          <DialogDescription>
            Enter a name for your new resume. Try to make it descriptive!
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleCreate}
            disabled={!name.trim() || loading}
          >
            {loading ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
