import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface ReportDialogProps {
  report: any 
  onClose: () => void
}

export default function ReportDialog({ report, onClose }: ReportDialogProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Interview Report</DialogTitle>
              </DialogHeader>
        <div className="mt-4">
          {/* Display report content here */}
          <p>{JSON.stringify(report, null, 2)}</p>
        </div>
        <Button onClick={onClose} className="mt-4">Close</Button>
      </DialogContent>
    </Dialog>
  )
}