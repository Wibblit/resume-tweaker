import { CreateNewDialog } from "./CreateNewResumeDialog";
import { Button } from "../ui/button";
import { PlusCircle } from "lucide-react";

export default function CreateNewButtonTop() {
  return (
    <CreateNewDialog template={false}>
       <Button variant="default" className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          <span>Create New</span>
        </Button>
    </CreateNewDialog>
  );
}