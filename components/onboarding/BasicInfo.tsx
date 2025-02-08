"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Basics, ResumeData } from "@/types/types";
import React from "react";

interface BasicInfoProps {
  updateFormData: (data: Partial<ResumeData>) => void;
  formData: ResumeData;
}

export default function BasicInfo({
  updateFormData,
  formData,
}: BasicInfoProps): JSX.Element {
  const basics: Basics = formData?.basics![0];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    if (name.startsWith("url.")) {
      updateFormData({
        basics: [
          {
            ...basics,
            url: { ...basics.url, [name.split(".")[1]]: value },
          },
        ],
      });
    } else {
      updateFormData({
        basics: [{ ...basics, [name]: value }],
      });
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold mb-4">Basic Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="Name"
            value={basics.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            placeholder="Email"
            type="email"
            value={basics.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            placeholder="Phone"
            value={basics.phone}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            name="location"
            placeholder="Location"
            value={basics.location}
            onChange={handleChange}
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="headLine">Headline</Label>
          <Input
            id="headLine"
            name="headLine"
            placeholder="Headline Software Engineer, Bussiness Analyst etc"
            value={basics.headLine}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="url.href">Website URL</Label>
          <Input
            id="url.href"
            name="url.href"
            placeholder="https://resumetweaker.wibblit.com"
            value={basics.url.href}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="url.label">Website Label</Label>
          <Input
            id="url.label"
            name="url.label"
            placeholder="Resume tweaker"
            value={basics.url.label}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
}
