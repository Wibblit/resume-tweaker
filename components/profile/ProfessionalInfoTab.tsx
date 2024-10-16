import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ResumeData } from "@/types/types"
import { Plus, Trash } from "lucide-react"

interface ProfessionalInfoTabProps {
  resumeData: ResumeData
  handleArrayInputChange: <T extends keyof ResumeData>(
    field: T,
    index: number,
    value: Partial<ResumeData[T][number]>
  ) => void
}

export default function ProfessionalInfoTab({ resumeData, handleArrayInputChange }: ProfessionalInfoTabProps) {
  const handleSkillChange = (
    categoryIndex: number,
    skillIndex: number,
    value: Partial<ResumeData['skills'][0]['categories'][0]['skills'][0]>
  ) => {
    handleArrayInputChange("skills", 0, {
      categories: resumeData.skills[0].categories.map((category, cIndex) => {
        if (cIndex === categoryIndex) {
          return {
            ...category,
            skills: category.skills.map((skill, sIndex) =>
              sIndex === skillIndex ? { ...skill, ...value } : skill
            ),
          }
        }
        return category
      }),
    })
  }

  const handleAddSkillCategory = () => {
    handleArrayInputChange("skills", 0, {
      categories: [
        ...resumeData.skills[0].categories,
        { id: Date.now().toString(), name: "", skills: [] },
      ],
    })
  }

  const handleAddSkill = (categoryIndex: number) => {
    handleArrayInputChange("skills", 0, {
      categories: resumeData.skills[0].categories.map((category, cIndex) => {
        if (cIndex === categoryIndex) {
          return {
            ...category,
            skills: [...category.skills, { name: "", level: "" }],
          }
        }
        return category
      }),
    })
  }

  const handleRemoveSkillCategory = (categoryIndex: number) => {
    handleArrayInputChange("skills", 0, {
      categories: resumeData.skills[0].categories.filter(
        (_, index) => index !== categoryIndex
      ),
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Professional Information</CardTitle>
        <CardDescription>Update your professional details here</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Summary</Label>
          <Textarea
            value={resumeData.summary[0]?.content || ""}
            onChange={(e) =>
              handleArrayInputChange("summary", 0, {
                content: e.target.value,
              })
            }
            placeholder="Write a brief summary about yourself"
          />
        </div>
        <div className="space-y-2">
          <Label className="mr-4">Skills</Label>
          {resumeData.skills[0]?.categories.map((category, categoryIndex) => (
            <div key={category.id} className="space-y-2">
              <div className="flex items-center space-x-2">
                <Input
                  value={category.name}
                  onChange={(e) => {
                    const updatedCategory = {
                      ...category,
                      name: e.target.value,
                    }
                    handleArrayInputChange("skills", 0, {
                      categories: resumeData.skills[0].categories.map((c, i) =>
                        i === categoryIndex ? updatedCategory : c
                      ),
                    })
                  }}
                  placeholder="Category Name"
                
                />
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => handleRemoveSkillCategory(categoryIndex)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
              {category.skills.map((skill, skillIndex) => (
                <div key={skillIndex} className="flex items-center space-x-2">
                  <Input
                    value={skill.name}
                    onChange={(e) =>
                      handleSkillChange(categoryIndex, skillIndex, {
                        name: e.target.value,
                      })
                    }
                    placeholder="Skill Name"
                  />
                  <Input
                    value={skill.level || ""}
                    onChange={(e) =>
                      handleSkillChange(categoryIndex, skillIndex, {
                        level: e.target.value,
                      })
                    }
                    placeholder="Skill Level"
                  />
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => {
                      const updatedSkills = category.skills.filter(
                        (_, i) => i !== skillIndex
                      )
                      const updatedCategory = {
                        ...category,
                        skills: updatedSkills,
                      }
                      handleArrayInputChange("skills", 0, {
                        categories: resumeData.skills[0].categories.map((c, i) =>
                          i === categoryIndex ? updatedCategory : c
                        ),
                      })
                    }}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button onClick={() => handleAddSkill(categoryIndex)}>
                <Plus className="mr-2 h-4 w-4" /> Add Skill
              </Button>
            </div>
          ))}
          <Button onClick={handleAddSkillCategory}>
            <Plus className="mr-2 h-4 w-4" /> Add Skill Category
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}