import { CreateNewDialog } from "./CreateNewDialog";
import { Button } from "../ui/button";
import { PlusCircle } from "lucide-react";

const RESUME = "Resume";
const COVER = "Cover Letter";

export const  CreateNewResumeButtonTop = () => {
  return (
    <CreateNewDialog type={RESUME} template={false}>
      <Button variant="default" className="flex items-center gap-2">
        <PlusCircle className="h-4 w-4" />
        <span>Create New</span>
      </Button>
    </CreateNewDialog>
  );
}

export const CreateNewCoverLetterButtonTop = () => {
  return (
    <CreateNewDialog type={COVER} template={false}>
      <Button variant="default" className="flex items-center gap-2">
        <PlusCircle className="h-4 w-4" />
        <span>Create New</span>
      </Button>
    </CreateNewDialog>
  );
};