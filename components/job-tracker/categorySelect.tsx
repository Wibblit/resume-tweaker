"use client";
import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppSelector, useAppDispatch } from "@/hooks/hooks";
import { JobStorage } from "@/lib/services/JobStorage";
import { setJobs } from "@/slices/job-tracker/job-slice";

export function CategorySelect() {
  const jobs = useAppSelector((state) => state.jobs.items);
  const dispatch = useAppDispatch();

  const handleValueChange = async (value: string) => {
    let jobs = await JobStorage.getJobs();
    if (value === "both") {
      dispatch(setJobs(jobs));
    } else if (value === "jobs") {
      jobs = jobs.filter((jobs) => jobs.source !== "email");
      dispatch(setJobs(jobs));
    } else if (value === "email") {
      jobs = jobs.filter((jobs) => jobs.source === "email");
      dispatch(setJobs(jobs));
    }
  };

  return (
    <Select defaultValue="both" onValueChange={handleValueChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Jobs" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Filter Kanban</SelectLabel>
          <SelectItem value="email">Emails</SelectItem>
          <SelectItem value="jobs">Jobs</SelectItem>
          <SelectItem value="both">Jobs & Emails</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
