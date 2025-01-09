'use client'

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from 'lucide-react'
import { ResumeData } from "@/types/types"
import React from 'react'

interface SummaryProfilesProps {
  updateFormData: (data: Partial<ResumeData>) => void
  formData: ResumeData
}

export default function SummaryProfiles({ updateFormData, formData }: SummaryProfilesProps): JSX.Element {
  const summary = formData.summary![0]?.content || ''
  const profiles = formData.profiles || []

  const handleSummaryChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    updateFormData({ summary: [{ content: e.target.value }] })
  }

  const handleProfileChange = (index: number, field: string, value: string): void => {
    const updatedProfiles = [...profiles]
    updatedProfiles[index] = {
      ...updatedProfiles[index],
      url: { ...updatedProfiles[index].url, [field]: value }
    }
    updateFormData({ profiles: updatedProfiles })
  }

  const addProfile = (): void => {
    updateFormData({ profiles: [...profiles, { url: { href: '', label: '' } }] })
  }

  const removeProfile = (index: number): void => {
    const updatedProfiles = profiles.filter((_, i) => i !== index)
    updateFormData({ profiles: updatedProfiles })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Summary</h2>
        <Textarea
          value={summary}
          onChange={handleSummaryChange}
          placeholder="Write a brief summary of your professional background and goals"
          rows={4}
        />
      </div>
      <div>
        <h2 className="text-2xl font-semibold mb-4">Profiles</h2>
        {profiles.map((profile, index) => (
          <div key={index} className="flex items-center space-x-2 mb-2">
            <Input
              placeholder="Profile URL"
              value={profile.url.href}
              onChange={(e) => handleProfileChange(index, 'href', e.target.value)}
            />
            <Input
              placeholder="Profile Label"
              value={profile.url.label}
              onChange={(e) => handleProfileChange(index, 'label', e.target.value)}
            />
            <Button variant="ghost" size="icon" onClick={() => removeProfile(index)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button onClick={addProfile} variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" /> Add Profile
        </Button>
      </div>
    </div>
  )
}

