import { Button } from "@/components/ui/button"
import Image from "next/image"
import LetterItem from "./LetterItem"
import { CreateNewCoverButton } from "./CreateNewButton"

export default function LetterContent({ searchQuery }: { searchQuery: string }) {
  const recentLetters = [
    { id: 1, name: "Job Application Letter" },
    { id: 2, name: "Networking Letter" },
  ]

const letterTemplates = [
  { id: 1, name: "Classic Professional", image: "/templates/ctemplate1.png" },
  { id: 2, name: "Modern Header", image: "/templates/ctemplate2.png" },
  { id: 3, name: "Blue Framed", image: "/templates/ctemplate3.png" },
  { id: 4, name: "Bold Sidebar", image: "/templates/ctemplate4.png" },
  { id: 5, name: "Minimalist Centered", image: "/templates/ctemplate5.png" },
];


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
          <CreateNewCoverButton />
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
                    src={template.image}
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