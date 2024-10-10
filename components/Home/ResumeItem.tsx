import { useMediaQuery } from "react-responsive"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { FileText, Pencil, Copy, Trash2 } from "lucide-react"
import { Separator } from "../ui/separator"
import { setCurrentResume } from "@/slices/currentResumeSlices"
import { useAppDispatch } from "@/hooks/hooks"

export default function ResumeItem({ resume }: { resume: { id: string; resumeName: string; userId: string; } }) {
  const isPhone = useMediaQuery({ maxWidth: 767 })
  const router = useRouter()
  const dispatch = useAppDispatch()

  const handleOpen = () => {
    dispatch(setCurrentResume({
      currResumeId: resume.id,
      currResumeName: resume.resumeName,
    }))
    router.push(`/editor`)
  }

  const handleRename = () => {
    console.log("Rename", resume.resumeName)
  }

  const handleDuplicate = () => {
    console.log("Duplicate", resume.resumeName)
  }

  const handleDelete = () => {
    console.log("Delete", resume.resumeName)
  }

  const menuItems = (
    <>
      <ContextMenuItem onSelect={handleOpen}>
        <FileText className="mr-2 h-4 w-4" />
        Open
      </ContextMenuItem>
      <ContextMenuItem onSelect={handleRename}>
        <Pencil className="mr-2 h-4 w-4" />
        Rename
      </ContextMenuItem>
      <ContextMenuItem onSelect={handleDuplicate}>
        <Copy className="mr-2 h-4 w-4" />
        Duplicate
      </ContextMenuItem>
      <Separator />
      <ContextMenuItem className="text-destructive" onSelect={handleDelete}>
        <Trash2 className="mr-2 h-4 w-4" />
        Delete
      </ContextMenuItem>
    </>
  )

  return isPhone ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="h-auto flex-col items-start p-4 w-full">
          <FileText className="h-6 w-6 mb-2" />
          <span>{resume.resumeName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onSelect={handleOpen}>
          <FileText className="mr-2 h-4 w-4" />
          Open
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={handleRename}>
          <Pencil className="mr-2 h-4 w-4" />
          Rename
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={handleDuplicate}>
          <Copy className="mr-2 h-4 w-4" />
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuItem className="text-destructive border-t" onSelect={handleDelete}>
          <Trash2 className="mr-2 h-4 w-4" />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <Button variant="outline" onClick={handleOpen} className="h-auto flex-col items-start p-4 w-full hover:bg-secondary">
          <FileText className="h-6 w-6 mb-2" />
          <span>{resume.resumeName}</span>
        </Button>
      </ContextMenuTrigger>
      <ContextMenuContent>{menuItems}</ContextMenuContent>
    </ContextMenu>
  )
}