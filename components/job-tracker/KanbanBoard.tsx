import type React from "react";
import { DragDropContext, type DropResult } from "react-beautiful-dnd";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { updateJobState } from "@/slices/job-tracker/job-slice";
import { KanbanColumn } from "./KanbanColumn";
import type { JobState } from "@/types/job-tracker";
import { JobStorage } from "@/lib/services/JobStorage";

const columns: { state: JobState; title: string }[] = [
  { state: "bookmark", title: "Bookmarked" },
  { state: "applied", title: "Applied" },
  { state: "shortlisted", title: "Shortlisted" },
  { state: "interviewing", title: "Interviewing" },
  { state: "negotiation", title: "Negotiation" },
];

export const KanbanBoard: React.FC = () => {
  const dispatch = useAppDispatch();
  const jobs = useAppSelector((state) => state.jobs.items);

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    dispatch(
      updateJobState({
        jobId: draggableId,
        newState: destination.droppableId as JobState,
      })
    );
  
    const job = jobs.find((job) => job.id === draggableId);
    if (job) {
      await JobStorage.updateJob(job);
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-4 p-6 min-w-max">
        {columns.map(({ state, title }) => (
          <KanbanColumn
            key={state}
            state={state}
            title={title}
            jobs={jobs.filter((job) => job.state === state)}
          />
        ))}
      </div>
    </DragDropContext>
  );
};
