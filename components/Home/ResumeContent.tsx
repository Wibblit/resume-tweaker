import { useAppDispatch } from "@/hooks/hooks"
import { UpdateId } from "@/slices/rightsidebarSlice"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import ResumeItem from "./ResumeItem"
import CreateNewButton from "./CreateNewButton"

export default function ResumeContent({ searchQuery }: { searchQuery: string }) {
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