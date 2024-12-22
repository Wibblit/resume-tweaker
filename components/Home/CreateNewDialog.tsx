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
import { setCurrentCover } from "@/slices/currentCoverSlice";
import { setCurrentResume } from "@/slices/currentResumeSlices";
import { useAppDispatch } from "@/hooks/hooks";
import { useToast } from "@/hooks/use-toast";
import { UpdateId } from "@/slices/rightsidebarSlice";
import { createCover } from "@/actions/createCover";
import { Loader2 } from "lucide-react";

const RESUME = "Resume";
const COVER = "Cover Letter";

export function CreateNewDialog({
  children,
  template,
  templateId,
  type,
}: {
  children: React.ReactNode;
  template: boolean;
  templateId?: number;
  type: string;
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
    } else {
      dispatch(UpdateId(1));
    }
    setLoading(true);
    if (name.trim()) {
      try {
        if (type === RESUME) {
          const response = await createResume(name);
          if (response.status === 429) {
            toast({
              title: "Whoa there! You've hit the rate limit.",
              description: "Please slow down and try again in a few minutes.",
              variant: "destructive",
            });
            return;
          }
          if (response && response.success) { 
            localStorage.setItem(
              "currResumeId",
              response?.resume?.id as string
            );
            dispatch(
              setCurrentResume({
                currResumeId: response?.resume?.id as string,
                currResumeName: response?.resume?.resumeName as string,
              })
            );

            router.push("/editor");
          } else {
            toast({
              title: "Error",
              description: response.message || "Failed to create resume",
              variant: "destructive",
            });
            setLoading(false);
          }
        } else {
          const response = await createCover(name);
          if (response.status === 429) {
            toast({
              title: "Whoa there! You've hit the rate limit.",
              description: "Please slow down and try again in a few minutes.",
              variant: "destructive",
            });
            return;
          }

          if (response && response.success) {
            localStorage.setItem("currCoverId", response?.cover?.id as string);
            dispatch(
              setCurrentCover({
                currCoverId: response?.cover?.id as string,
                currCoverName: response?.cover?.coverName as string,
              })
            );
            router.push("/covereditor");
          } else {
            toast({
              title: "Error",
              description: response.message || "Failed to create resume",
              variant: "destructive",
            });
            setLoading(false);
          }
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
        setLoading(false);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New {type}</DialogTitle>
          <DialogDescription>
            Enter a name for your new {type.toLowerCase()}. Try to make it
            descriptive!
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
            {loading ? (
              <div className="flex ">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </div>
            ) : (
              "Create"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
