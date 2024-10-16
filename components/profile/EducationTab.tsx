import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ResumeData } from "@/types/types"
import { DatePicker } from "@/components/DatePicker"
import { Plus, Trash } from "lucide-react"

interface EducationTabProps {
  resumeData: ResumeData
  handleArrayInputChange: <T extends keyof ResumeData>(
    field: T,
    index: number,
    value: Partial<ResumeData[T][number]>
  ) => void
  handleAddArrayItem: <T extends keyof ResumeData>(field: T) => void
  handleRemoveArrayItem: <T extends keyof ResumeData>(field: T, index: number) => void
}

export default function EducationTab({
  resumeData,
  handleArrayInputChange,
  handleAddArrayItem,
  handleRemoveArrayItem,
}: EducationTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Education</CardTitle>
        <CardDescription>Update your educational background</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {resumeData.education.map((edu, index) => (
          <div key={index} className="space-y-2">
            <Label>Education {index + 1}</Label>
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                placeholder="Institution"
                value={edu.institution}
                onChange={(e) =>
                  handleArrayInputChange("education", index, {
                    institution: e.target.value,
                  })
                }
              />
              <Input
                placeholder="Degree"
                value={edu.degree}
                onChange={(e) =>
                  handleArrayInputChange("education", index, {
                    degree: e.target.value,
                  })
                }
              />
              <Input
                placeholder="Field of Study"
                value={edu.field}
                onChange={(e) =>
                  handleArrayInputChange("education", index, {
                    field: e.target.value,
                  })
                }
              />
              <Input
                placeholder="Specialization"
                value={edu.specialization}
                onChange={(e) =>
                  handleArrayInputChange("education", index, {
                    specialization: e.target.value,
                  })
                }
              />
              <Input
                placeholder="Score"
                value={edu.score}
                onChange={(e) =>
                  handleArrayInputChange("education", index, {
                    score: e.target.value,
                  })
                }
              />
              <DatePicker
                placeholder="Start Date"
                date={edu.startDate ? new Date(edu.startDate) : undefined}
                setDate={(date) =>
                  handleArrayInputChange("education", index, {
                    startDate: date?.toISOString(),
                  })
                }
              />
              <DatePicker
                placeholder="End Date"
                date={edu.endDate ? new Date(edu.endDate) : undefined}
                setDate={(date) =>
                  handleArrayInputChange("education", index, {
                    endDate: date?.toISOString(),
                  })
                }
              />
            </div>
            <Button
              variant="outline"
              onClick={() => handleRemoveArrayItem("education", index)}
            >
              <Trash className="mr-2 h-4 w-4" /> Remove Education
            </Button>
          </div>
        ))}
        <Button onClick={() => handleAddArrayItem("education")}>
          <Plus className="mr-2 h-4 w-4" /> Add Education
        </Button>
      </CardContent>
    </Card>
  )
}