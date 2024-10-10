import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { CreateNewDialog } from "./CreateNewResumeDialog";

export default function CreateNewButton() {
  return (
    <CreateNewDialog template={false}>
        <Button variant="outline" className="h-auto flex-col items-center justify-center p-4">
          <PlusCircle className="h-6 w-6 mb-2" />
          <span>Create New</span>
        </Button>
    </CreateNewDialog>
  );
}
