import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { CreateNewDialog } from "./CreateNewDialog";

const RESUME = "Resume";
const COVER = "Cover Letter";

export const  CreateNewResumeButton =() => {
  return (
    <CreateNewDialog type={RESUME} template={false}>
      <Button
        variant="outline"
        className="h-auto flex-col items-center justify-center p-4"
      >
        <PlusCircle className="h-6 w-6 mb-2" />
        <span>Create New</span>
      </Button>
    </CreateNewDialog>
  );
}

export const CreateNewCoverButton = () => {
  return (
    <CreateNewDialog type={COVER} template={false}>
      <Button
        variant="outline"
        className="h-auto flex-col items-center justify-center p-4"
      >
        <PlusCircle className="h-6 w-6 mb-2" />
        <span>Create New</span>
      </Button>
    </CreateNewDialog>
  );
};
