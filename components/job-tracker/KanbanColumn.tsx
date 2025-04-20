import React from "react";
import { Droppable } from "react-beautiful-dnd";
import { Job, JobState } from "@/types/job-tracker";
import { JobCard } from "./JobCard";

interface KanbanColumnProps {
  state: JobState;
  jobs: Job[];
  title: string;
}

const getColumnColor = (state: JobState) => {
  const colors = {
    bookmark: "bg-yellow-50 dark:bg-yellow-950",
    applied: "bg-blue-50 dark:bg-blue-950",
    shortlisted: "bg-purple-50 dark:bg-purple-950",
    interviewing: "bg-green-50 dark:bg-green-950",
    negotiation: "bg-orange-50 dark:bg-orange-950",
  };
  return colors[state];
};

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  state,
  jobs,
  title,
}) => {
  return (
    <div
      className={`flex flex-col h-full min-h-[600px] w-80 rounded-lg ${getColumnColor(
        state
      )} p-4`}
    >
      <h3 className="font-semibold mb-4 text-lg">
        {title} ({jobs.length})
      </h3>
      <Droppable droppableId={state}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex-1"
          >
            {jobs.map((job, index) => (
              <JobCard key={job.id} job={job} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};
