import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ResumeData } from "@/types/types"

interface PersonalInfoTabProps {
  resumeData: ResumeData
  handleBasicsChange: (field: keyof ResumeData['basics'][0], value: any) => void
}

export default function PersonalInfoTab({ resumeData, handleBasicsChange }: PersonalInfoTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>Update your personal details here</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              value={resumeData.basics[0].name}
              onChange={(e) => handleBasicsChange("name", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Contact Number</Label>
            <Input
              id="phone"
              placeholder="+1 (555) 123-4567"
              value={resumeData.basics[0].phone}
              onChange={(e) => handleBasicsChange("phone", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="johndoe@example.com"
              value={resumeData.basics[0].email}
              onChange={(e) => handleBasicsChange("email", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="New York, NY"
              value={resumeData.basics[0].location}
              onChange={(e) => handleBasicsChange("location", e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="headLine">Headline</Label>
          <Input
            id="headLine"
            placeholder="Experienced Software Engineer | AI Enthusiast"
            value={resumeData.basics[0].headLine}
            onChange={(e) => handleBasicsChange("headLine", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="url">Website URL</Label>
          <Input
            id="url"
            placeholder="https://www.johndoe.com"
            value={resumeData.basics[0].url.href}
            onChange={(e) =>
              handleBasicsChange("url", {
                href: e.target.value,
                label: resumeData.basics[0].url.label,
              })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="urlLabel">Website Label</Label>
          <Input
            id="urlLabel"
            placeholder="Personal Portfolio"
            value={resumeData.basics[0].url.label}
            onChange={(e) =>
              handleBasicsChange("url", {
                href: resumeData.basics[0].url.href,
                label: e.target.value,
              })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="picture">Profile Picture</Label>
          <Input
            id="picture"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) {
                handleBasicsChange("picture", file)
              }
            }}
          />
        </div>
      </CardContent>
    </Card>
  )
}