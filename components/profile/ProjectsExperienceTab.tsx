import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ResumeData } from "@/types/types"
import { CustomDatePicker as DatePicker } from "@/components/DatePicker"
import { Plus, Trash } from "lucide-react"

interface ProjectsExperienceTabProps {
  resumeData: ResumeData
  handleArrayInputChange: <T extends keyof ResumeData>(
    field: T,
    index: number,
    value: Partial<ResumeData[T][number]>
  ) => void
  handleAddArrayItem: <T extends keyof ResumeData>(field: T) => void
  handleRemoveArrayItem: <T extends keyof ResumeData>(field: T, index: number) => void
}

export default function ProjectsExperienceTab({
  resumeData,
  handleArrayInputChange,
  handleAddArrayItem,
  handleRemoveArrayItem,
}: ProjectsExperienceTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Projects & Experience</CardTitle>
        <CardDescription>Update your projects and work experience</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="mr-4">Projects</Label>
          {resumeData.projects.map((project, index) => (
            <div key={index} className="space-y-2">
              <Input
                placeholder="Project Name"
                value={project.name}
                onChange={(e) =>
                  handleArrayInputChange("projects", index, {
                    name: e.target.value,
                  })
                }
              />
              <Textarea
                placeholder="Summary"
                value={project.summary}
                onChange={(e) =>
                  handleArrayInputChange("projects", index, {
                    summary: e.target.value,
                  })
                }
              />
              <div className="grid gap-4 md:grid-cols-2">
                <DatePicker
                  placeholder="Start Date"
                  date={project.startDate ? new Date(project.startDate) : undefined}
                  setDate={(date) =>
                    handleArrayInputChange("projects", index, {
                      startDate: date?.toISOString(),
                    })
                  }
                />
                <DatePicker
                  placeholder="End Date"
                  date={project.endDate ? new Date(project.endDate) : undefined}
                  setDate={(date) =>
                    handleArrayInputChange("projects", index, {
                      endDate: date?.toISOString(),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`project-url-${index}`}>Project URL</Label>
                <Input
                  id={`project-url-${index}`}
                  placeholder="Project URL"
                  value={project.url?.href}
                  onChange={(e) =>
                    handleArrayInputChange("projects", index, {
                      url: {
                        href: e.target.value,
                        label: project.url?.label || e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`project-url-label-${index}`}>URL Label</Label>
                <Input
                  id={`project-url-label-${index}`}
                  placeholder="URL Label"
                  value={project.url?.label}
                  onChange={(e) =>
                    handleArrayInputChange("projects", index, {
                      url: {
                        href: project.url?.href || "",
                        label: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <Button
                variant="outline"
                onClick={() => handleRemoveArrayItem("projects", index)}
              >
                <Trash className="mr-2 h-4 w-4" /> Remove Project
              </Button>
            </div>
          ))}
          <Button onClick={() => handleAddArrayItem("projects")}>
            <Plus className="mr-2 h-4 w-4" /> Add Project
          </Button>
        </div>
        <div className="space-y-2">
          <Label className="mr-4">Work Experience</Label>
          {resumeData.experience.map((exp, index) => (
            <div key={index} className="space-y-2">
              <Input
                placeholder="Organization"
                value={exp.organization}
                onChange={(e) =>
                  handleArrayInputChange("experience", index, {
                    organization: e.target.value,
                  })
                }
              />
              <Input
                placeholder="Role"
                value={exp.role}
                onChange={(e) =>
                  handleArrayInputChange("experience", index, {
                    role: e.target.value,
                  })
                }
              />
              <Textarea
                placeholder="Summary"
                value={exp.summary}
                onChange={(e) =>
                  handleArrayInputChange("experience", index, {
                    summary: e.target.value,
                  })
                }
              />
              <div className="grid gap-4 md:grid-cols-2">
                <DatePicker
                  placeholder="Start Date"
                  date={exp.startDate ? new Date(exp.startDate) : undefined}
                  setDate={(date) =>
                    handleArrayInputChange("experience", index, {
                      startDate: date?.toISOString(),
                    })
                  }
                />
                <DatePicker
                  placeholder="End Date"
                  date={exp.endDate ? new Date(exp.endDate) : undefined}
                  setDate={(date) =>
                    handleArrayInputChange("experience", index, {
                      endDate: date?.toISOString(),
                    })
                  }
                />
              </div>
              <Input
                placeholder="Location"
                value={exp.location}
                onChange={(e) =>
                  handleArrayInputChange("experience", index, {
                    location: e.target.value,
                  })
                }
              />
              <Button
                variant="outline"
                onClick={() => handleRemoveArrayItem("experience", index)}
              >
                <Trash className="mr-2 h-4 w-4" /> Remove Experience
              </Button>
            </div>
          ))}
          <Button onClick={() => handleAddArrayItem("experience")}>
            <Plus className="mr-2 h-4 w-4" /> Add Experience
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}