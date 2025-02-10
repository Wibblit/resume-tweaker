"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import { ResumeData } from "@/types/types";
import { CustomDatePicker } from "@/components/DatePicker";
import React from "react";

interface AdditionalInfoProps {
  updateFormData: (data: Partial<ResumeData>) => void;
  formData: ResumeData;
}

export default function AdditionalInfo({
  updateFormData,
  formData,
}: AdditionalInfoProps): JSX.Element {
  const languages = formData.languages || [];
  const volunteer = formData.volunteer || [];
  const awards = formData.awards || [];
  const publications = formData.publications || [];
  const certifications = formData.certifications || [];
  const references = formData.references || [];

  const addLanguage = (): void => {
    updateFormData({ languages: [...languages, { name: "", level: "" }] });
  };

  const updateLanguage = (
    index: number,
    field: string,
    value: string
  ): void => {
    const updatedLanguages = [...languages];
    updatedLanguages[index] = { ...updatedLanguages[index], [field]: value };
    updateFormData({ languages: updatedLanguages });
  };

  const removeLanguage = (index: number): void => {
    updateFormData({ languages: languages.filter((_, i) => i !== index) });
  };

  const addVolunteer = (): void => {
    updateFormData({
      volunteer: [
        ...volunteer,
        {
          organization: "",
          role: "",
          startDate: "",
          endDate: "",
          location: "",
        },
      ],
    });
  };

  const updateVolunteer = (
    index: number,
    field: string,
    value: string
  ): void => {
    const updatedVolunteer = [...volunteer];
    updatedVolunteer[index] = { ...updatedVolunteer[index], [field]: value };
    updateFormData({ volunteer: updatedVolunteer });
  };

  const removeVolunteer = (index: number): void => {
    updateFormData({ volunteer: volunteer.filter((_, i) => i !== index) });
  };

  const addAward = (): void => {
    updateFormData({
      awards: [...awards, { title: "", awarder: "", date: "", summary: "" }],
    });
  };

  const updateAward = (index: number, field: string, value: string): void => {
    const updatedAwards = [...awards];
    updatedAwards[index] = { ...updatedAwards[index], [field]: value };
    updateFormData({ awards: updatedAwards });
  };

  const removeAward = (index: number): void => {
    updateFormData({ awards: awards.filter((_, i) => i !== index) });
  };

  const addPublication = (): void => {
    updateFormData({
      publications: [
        ...publications,
        {
          name: "",
          publisher: "",
          publishedIn: "",
          url: { href: "", label: "" },
          date: "",
        },
      ],
    });
  };

  const updatePublication = (
    index: number,
    field: string,
    value: string
  ): void => {
    const updatedPublications = [...publications];
    if (field.startsWith("url.")) {
      updatedPublications[index].url = {
        ...updatedPublications[index].url,
        [field.split(".")[1]]: value,
      };
    } else {
      updatedPublications[index] = {
        ...updatedPublications[index],
        [field]: value,
      };
    }
    updateFormData({ publications: updatedPublications });
  };

  const removePublication = (index: number): void => {
    updateFormData({
      publications: publications.filter((_, i) => i !== index),
    });
  };

  const addCertification = (): void => {
    updateFormData({
      certifications: [
        ...certifications,
        { name: "", issuer: "", date: "", url: { href: "", label: "" } },
      ],
    });
  };

  const updateCertification = (
    index: number,
    field: string,
    value: string
  ): void => {
    const updatedCertifications = [...certifications];
    if (field.startsWith("url.")) {
      updatedCertifications[index].url = {
        ...updatedCertifications[index].url,
        [field.split(".")[1]]: value,
      };
    } else {
      updatedCertifications[index] = {
        ...updatedCertifications[index],
        [field]: value,
      };
    }
    updateFormData({ certifications: updatedCertifications });
  };

  const removeCertification = (index: number): void => {
    updateFormData({
      certifications: certifications.filter((_, i) => i !== index),
    });
  };

  const addReference = (): void => {
    updateFormData({
      references: [...references, { name: "", phone: "", email: "" }],
    });
  };

  const updateReference = (
    index: number,
    field: string,
    value: string
  ): void => {
    const updatedReferences = [...references];
    updatedReferences[index] = { ...updatedReferences[index], [field]: value };
    updateFormData({ references: updatedReferences });
  };

  const removeReference = (index: number): void => {
    updateFormData({ references: references.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Languages</h2>
        {languages.map((lang, index) => (
          <div key={index} className="flex items-center space-x-2 mb-2">
            <Input
              value={lang.name}
              onChange={(e) => updateLanguage(index, "name", e.target.value)}
              placeholder="Language"
            />
            <Input
              value={lang.level}
              onChange={(e) => updateLanguage(index, "level", e.target.value)}
              placeholder="Proficiency Level"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeLanguage(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button onClick={addLanguage} variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" /> Add Language
        </Button>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Volunteer Experience</h2>
        {volunteer.map((vol, index) => (
          <div key={index} className="mb-4 p-4 border rounded-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                value={vol.organization}
                onChange={(e) =>
                  updateVolunteer(index, "organization", e.target.value)
                }
                placeholder="Organization"
              />
              <Input
                value={vol.role}
                onChange={(e) => updateVolunteer(index, "role", e.target.value)}
                placeholder="Role"
              />
              <div>
                <Label>Start Date</Label>
                <CustomDatePicker
                  date={
                    vol.startDate === "Present"
                      ? new Date(1970, 0, 1)
                      : vol.startDate
                      ? new Date(vol.startDate)
                      : undefined
                  }
                  onSelect={(date) =>
                    updateVolunteer(
                      index,
                      "startDate",
                      date
                        ? date.getTime() === new Date(1970, 0, 1).getTime()
                          ? "Present"
                          : date.toISOString()
                        : ""
                    )
                  }
                />
              </div>
              <div>
                <Label>End Date</Label>
                <CustomDatePicker
                  date={
                    vol.startDate === "Present"
                      ? new Date(1970, 0, 1)
                      : vol.endDate
                      ? new Date(vol.endDate)
                      : undefined
                  }
                  onSelect={(date) =>
                    updateVolunteer(
                      index,
                      "endDate",
                      date
                        ? date.getTime() === new Date(1970, 0, 1).getTime()
                          ? "Present"
                          : date.toISOString()
                        : ""
                    )
                  }
                />
              </div>
              <Input
                value={vol.location}
                onChange={(e) =>
                  updateVolunteer(index, "location", e.target.value)
                }
                placeholder="Location"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeVolunteer(index)}
              className="mt-2"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button onClick={addVolunteer} variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" /> Add Volunteer Experience
        </Button>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Awards</h2>
        {awards.map((award, index) => (
          <div key={index} className="mb-4 p-4 border rounded-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                value={award.title}
                onChange={(e) => updateAward(index, "title", e.target.value)}
                placeholder="Award Title"
              />
              <Input
                value={award.awarder}
                onChange={(e) => updateAward(index, "awarder", e.target.value)}
                placeholder="Awarder"
              />
              <div>
                <Label>Date Received</Label>
                <CustomDatePicker
                  date={award.date === "Present" ? new Date(1970, 0, 1) : award.date ? new Date(award.date) : undefined}
                  onSelect={(date) =>
                    updateAward(
                      index,
                      "date",
                      date
                        ? date.getTime() === new Date(1970, 0, 1).getTime()
                          ? "Present"
                          : date.toISOString()
                        : ""
                    )
                  }
                />
              </div>
              <Textarea
                value={award.summary}
                onChange={(e) => updateAward(index, "summary", e.target.value)}
                placeholder="Award Summary"
                className="md:col-span-2"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeAward(index)}
              className="mt-2"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button onClick={addAward} variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" /> Add Award
        </Button>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Publications</h2>
        {publications.map((pub, index) => (
          <div key={index} className="mb-4 p-4 border rounded-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                value={pub.name}
                onChange={(e) =>
                  updatePublication(index, "name", e.target.value)
                }
                placeholder="Publication Name"
              />
              <Input
                value={pub.publisher}
                onChange={(e) =>
                  updatePublication(index, "publisher", e.target.value)
                }
                placeholder="Publisher"
              />
              <Input
                value={pub.publishedIn}
                onChange={(e) =>
                  updatePublication(index, "publishedIn", e.target.value)
                }
                placeholder="Published In"
              />
              <div>
                <Label>Publication Date</Label>
                <CustomDatePicker
                  date={pub.date === "Present" ? new Date(1970, 0, 1) : pub.date ? new Date(pub.date) : undefined}
                  onSelect={(date) =>
                    updatePublication(
                      index,
                      "date",
                      date
                        ? date.getTime() === new Date(1970, 0, 1).getTime()
                          ? "Present"
                          : date.toISOString()
                        : ""
                    )
                  }
                />
              </div>
              <Input
                value={pub.url.href}
                onChange={(e) =>
                  updatePublication(index, "url.href", e.target.value)
                }
                placeholder="Publication URL"
              />
              <Input
                value={pub.url.label}
                onChange={(e) =>
                  updatePublication(index, "url.label", e.target.value)
                }
                placeholder="Publication URL Label"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removePublication(index)}
              className="mt-2"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button onClick={addPublication} variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" /> Add Publication
        </Button>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Certifications</h2>
        {certifications.map((cert, index) => (
          <div key={index} className="mb-4 p-4 border rounded-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                value={cert.name}
                onChange={(e) =>
                  updateCertification(index, "name", e.target.value)
                }
                placeholder="Certification Name"
              />
              <Input
                value={cert.issuer}
                onChange={(e) =>
                  updateCertification(index, "issuer", e.target.value)
                }
                placeholder="Issuer"
              />
              <div>
                <Label>Date Received</Label>
                <CustomDatePicker
                  date={cert.date ? new Date(1970, 0, 1) : cert.date ? new Date(cert.date) : undefined}
                  onSelect={(date) =>
                    updateCertification(
                      index,
                      "date",
                      date
                        ? date.getTime() === new Date(1970, 0, 1).getTime()
                          ? "Present"
                          : date.toISOString()
                        : ""
                    )
                  }
                />
              </div>
              <Input
                value={cert.url.href}
                onChange={(e) =>
                  updateCertification(index, "url.href", e.target.value)
                }
                placeholder="Certification URL"
              />
              <Input
                value={cert.url.label}
                onChange={(e) =>
                  updateCertification(index, "url.label", e.target.value)
                }
                placeholder="Certification URL Label"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeCertification(index)}
              className="mt-2"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button onClick={addCertification} variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" /> Add Certification
        </Button>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">References</h2>
        {references.map((ref, index) => (
          <div key={index} className="mb-4 p-4 border rounded-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                value={ref.name}
                onChange={(e) => updateReference(index, "name", e.target.value)}
                placeholder="Reference Name"
              />
              <Input
                value={ref.phone}
                onChange={(e) =>
                  updateReference(index, "phone", e.target.value)
                }
                placeholder="Phone Number"
              />
              <Input
                value={ref.email}
                onChange={(e) =>
                  updateReference(index, "email", e.target.value)
                }
                placeholder="Email Address"
                className="md:col-span-2"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeReference(index)}
              className="mt-2"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button onClick={addReference} variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" /> Add Reference
        </Button>
      </div>
    </div>
  );
}
