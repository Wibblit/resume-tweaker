"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, PlusCircle, User, Pencil, Copy, Trash2 } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useAppDispatch } from "@/hooks/hooks"
import { UpdateId } from "@/slices/rightsidebarSlice"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useMediaQuery } from "react-responsive"
import { Label } from "@/components/ui/label"

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <AnimatePresence>
      {isLoaded && (
        <motion.div
          className="p-4 md:p-6 h-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ScrollArea className="h-full">
            <Tabs defaultValue="resumes" className="h-full">
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="resumes">Resumes</TabsTrigger>
                  <TabsTrigger value="letters">Letters</TabsTrigger>
                </TabsList>
                <div className="flex items-center gap-2">
                  <CreateNewButtonTop />
                  <Button
                    variant="ghost"
                    onClick={() => router.push("/profile")}
                    className="hidden items-center gap-2 lg:flex"
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </Button>
                </div>
              </div>
              <div className="mt-4">
                <Input 
                  placeholder="Search templates..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <TabsContent value="resumes" className="mt-4">
                <ResumeContent searchQuery={searchQuery} />
              </TabsContent>
              <TabsContent value="letters" className="mt-4">
                <LetterContent searchQuery={searchQuery} />
              </TabsContent>
            </Tabs>
          </ScrollArea>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function ResumeContent({ searchQuery }: { searchQuery: string }) {
  const recentResumes = [
    { id: 1, name: "Professional Resume"},
    { id: 2, name: "Creative CV"},
    { id: 3, name: "Technical Resume" },
  ]
  const dispatch = useAppDispatch()
  const router = useRouter()

  const resumeTemplates = [
    { id: 1, name: "Classic Charm", img: "/templates/template1.png" },
    { id: 2, name: "Artistic Flair", img: "/templates/template2.jpg"  },
    { id: 3, name: "Executive Edge", img: "/templates/template3.jpg" },
    { id: 4, name: "Fresh Start", img: "/templates/template4.png" },
    { id: 5, name: "Eco Essence", img: "/templates/template5.png"}
  ]

  const filteredTemplates = resumeTemplates.filter(template =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleClick = (templateId: number) => {
    dispatch(UpdateId(templateId))
    router.push("/editor")
  }

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-bold">Recently Edited Resumes</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recentResumes.map((resume) => (
            <ResumeItem key={resume.id} resume={resume} />
          ))}
          <CreateNewButton />
        </div>
      </section>
      <section>
        <h2 className="text-2xl font-bold">Resume Templates</h2>
        {filteredTemplates.length === 0 ? (
          <p className="mt-4 text-muted-foreground">No matching templates found.</p>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {filteredTemplates.map((template) => (
              <Button key={template.id} onClick={() => handleClick(template.id)} variant="outline" className="h-auto flex-col items-start p-4 group">
                <div className="relative aspect-[3/4] w-full mb-2 overflow-hidden rounded-md">
                  <Image
                    src={template.img}
                    alt={template.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-background/10 group-hover:bg-background/20 transition-colors" />
                </div>
                <span className="font-medium">{template.name}</span>
              </Button>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function LetterContent({ searchQuery }: { searchQuery: string }) {
  const recentLetters = [
    { id: 1, name: "Job Application Letter" },
    { id: 2, name: "Networking Letter" },
  ]

  const letterTemplates = [
    { id: 1, name: "Professional Standard", img: "/templates/letter1.png" },
    { id: 2, name: "Modern Minimalist", img: "/templates/letter2.png" },
    { id: 3, name: "Formal Business", img: "/templates/letter3.png" },
    { id: 4, name: "Casual Creative", img: "/templates/letter4.png" },
  ]

  const filteredTemplates = letterTemplates.filter(template =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-bold">Recently Edited Letters</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recentLetters.map((letter) => (
            <LetterItem key={letter.id} letter={letter} />
          ))}
          <CreateNewButton />
        </div>
      </section>
      <section>
        <h2 className="text-2xl font-bold">Letter Templates</h2>
        {filteredTemplates.length === 0 ? (
          <p className="mt-4 text-muted-foreground">No matching templates found.</p>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {filteredTemplates.map((template) => (
              <Button key={template.id} variant="outline" className="h-auto flex-col items-start p-4 group">
                <div className="relative aspect-[3/4] w-full mb-2 overflow-hidden rounded-md">
                  <Image
                    src={template.img}
                    alt={template.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-background/10 group-hover:bg-background/20 transition-colors" />
                </div>
                <span className="font-medium">{template.name}</span>
              </Button>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function ResumeItem({ resume }: { resume: { id: number; name: string } }) {
  const isPhone = useMediaQuery({ maxWidth: 767 })
  const router = useRouter()

  const handleOpen = () => {
    router.push(`/editor/${resume.id}`)
  }

  const handleRename = () => {
    console.log("Rename", resume.name)
  }

  const handleDuplicate = () => {
    console.log("Duplicate", resume.name)
  }

  const handleDelete = () => {
    console.log("Delete", resume.name)
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
      <ContextMenuItem className="text-destructive hover:text-destructive border-t" onSelect={handleDelete}>
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
          <span>{resume.name}</span>
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
        <Button variant="outline" className="h-auto flex-col items-start p-4 w-full hover:bg-secondary">
          <FileText className="h-6 w-6 mb-2" />
          <span>{resume.name}</span>
        </Button>
      </ContextMenuTrigger>
      <ContextMenuContent>{menuItems}</ContextMenuContent>
    </ContextMenu>
  )
}

function LetterItem({ letter }: { letter: { id: number; name: string } }) {
  const isPhone = useMediaQuery({ maxWidth: 767 })
  const router = useRouter()

  const handleOpen = () => {
    router.push(`/editor/${letter.id}`)
  }

  const handleRename = () => {
    console.log("Rename", letter.name)
  }

  const handleDuplicate = () => {
    console.log("Duplicate", letter.name)
  }

  const handleDelete = () => {
    console.log("Delete", letter.name)
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
      <ContextMenuItem onSelect={handleDelete}>
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
          <span>{letter.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>{menuItems}</DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <Button variant="outline" className="h-auto flex-col items-start p-4 w-full">
          <FileText className="h-6 w-6 mb-2" />
          <span>{letter.name}</span>
        </Button>
      </ContextMenuTrigger>
      <ContextMenuContent>{menuItems}</ContextMenuContent>
    </ContextMenu>
  )
}

function CreateNewButtonTop() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const router = useRouter()

  const handleCreate = () => {
    if (name.trim()) {
      router.push("/editor")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          <span>Create New</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Resume/Letter</DialogTitle>
          <DialogDescription>
            Enter a name for your new resume or letter. Try to make it descriptive!
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
          <Button type="submit" onClick={handleCreate} disabled={!name.trim()}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function CreateNewButton() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const router = useRouter()

  const handleCreate = () => {
    if (name.trim()) {
      router.push("/editor")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-auto flex-col items-center justify-center p-4">
          <PlusCircle className="h-6 w-6 mb-2" />
          <span>Create New</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Resume/Letter</DialogTitle>
          <DialogDescription>
            Enter a name for your new resume or letter. Try to make it descriptive!
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
          <Button type="submit" onClick={handleCreate} disabled={!name.trim()}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}