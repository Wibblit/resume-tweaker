'use client'

import { useState } from "react"
import { motion } from "framer-motion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ResumeData } from "@/types/types"
import { emptyResumeData } from "@/lib/constants"
import Credits from "./Credits"
import PersonalInfoTab from "./PersonalInfoTab"
import ProfessionalInfoTab from "./ProfessionalInfoTab"
import EducationTab from "./EducationTab"
import ProjectsExperienceTab from "./ProjectsExperienceTab"

export default function ProfileContent() {
  const [resumeData, setResumeData] = useState<ResumeData>(emptyResumeData)
  const [credits, setCredits] = useState({ current: 12, max: 100 })
  const [activeTab, setActiveTab] = useState("personal")

  const handleBasicsChange = (field: keyof ResumeData['basics'][0], value: any) => {
    setResumeData((prevData) => ({
      ...prevData,
      basics: [{ ...prevData.basics[0], [field]: value }],
    }))
  }

  const handleArrayInputChange = <T extends keyof ResumeData>(
    field: T,
    index: number,
    value: Partial<ResumeData[T][number]>
  ) => {
    setResumeData((prevData) => ({
      ...prevData,
      [field]: prevData[field].map((item, i) =>
        i === index ? { ...item, ...value } : item
      ),
    }))
  }

  const handleAddArrayItem = <T extends keyof ResumeData>(field: T) => {
    setResumeData((prevData) => ({
      ...prevData,
      [field]: [...prevData[field], {} as ResumeData[T][number]],
    }))
  }

  const handleRemoveArrayItem = <T extends keyof ResumeData>(
    field: T,
    index: number
  ) => {
    setResumeData((prevData) => ({
      ...prevData,
      [field]: prevData[field].filter((_, i) => i !== index),
    }))
  }

  const renderTabContent = (tab: string) => {
    switch (tab) {
      case "personal":
        return <PersonalInfoTab resumeData={resumeData} handleBasicsChange={handleBasicsChange} />
      case "professional":
        return <ProfessionalInfoTab resumeData={resumeData} handleArrayInputChange={handleArrayInputChange} />
      case "education":
        return <EducationTab 
          resumeData={resumeData} 
          handleArrayInputChange={handleArrayInputChange}
          handleAddArrayItem={handleAddArrayItem}
          handleRemoveArrayItem={handleRemoveArrayItem}
        />
      case "projects":
        return <ProjectsExperienceTab 
          resumeData={resumeData} 
          handleArrayInputChange={handleArrayInputChange}
          handleAddArrayItem={handleAddArrayItem}
          handleRemoveArrayItem={handleRemoveArrayItem}
        />
      default:
        return null
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Credits credits={credits} />

      {/* Desktop view */}
      <div className="hidden md:block">
        <Tabs defaultValue="personal" className="space-y-4">
          <TabsList>
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="professional">Professional Info</TabsTrigger>
            <TabsTrigger value="education">Education & Skills</TabsTrigger>
            <TabsTrigger value="projects">Projects & Experience</TabsTrigger>
          </TabsList>

          <TabsContent value="personal">{renderTabContent("personal")}</TabsContent>
          <TabsContent value="professional">{renderTabContent("professional")}</TabsContent>
          <TabsContent value="education">{renderTabContent("education")}</TabsContent>
          <TabsContent value="projects">{renderTabContent("projects")}</TabsContent>
        </Tabs>
      </div>

      {/* Mobile view */}
      <div className="md:hidden">
        <Select value={activeTab} onValueChange={(value) => setActiveTab(value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a section" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="personal">Personal Info</SelectItem>
            <SelectItem value="professional">Professional Info</SelectItem>
            <SelectItem value="education">Education & Skills</SelectItem>
            <SelectItem value="projects">Projects & Experience</SelectItem>
          </SelectContent>
        </Select>
        <div className="mt-4">{renderTabContent(activeTab)}</div>
      </div>
    </motion.div>
  )
}