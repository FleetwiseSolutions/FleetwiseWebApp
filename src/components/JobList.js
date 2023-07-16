import React, { useState } from "react";
import ReassignForm from "./Forms/ReassignForm";
import "./JobList.css";
import { Button } from "react-bootstrap";

const JobList = ({
  jobs,
  status,
  onJobClick,
  title,
  reassignJob,
  employees,
}) => {
  const [showReassignForm, setShowReassignForm] = useState(false);
  const [jobToReassign, setJobToReassign] = useState(null);

  const filteredJobs = jobs.filter((job) => job.status === status);

  const latestRejection = (job) => {
    if (job.assignedStatus === "reassigned") return null;
    return job.history
      ? job.history
          .filter((entry) => entry.status === "rejected")
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0]
      : null;
  };
  const handleReassign = (job) => {
    setJobToReassign(job);
    setShowReassignForm(true);
  };

  const handleReassignSubmit = (employeeId) => {
    reassignJob(jobToReassign.id, employeeId);
    setShowReassignForm(false);
  };

  const handleReassignCancel = () => {
    setShowReassignForm(false);
  };

  return (
    <div className="job-list">
      <h3>{title}</h3>
      <div className="job-list-items">
        {filteredJobs.map((job) => (
          <div key={job.id} className="job-item">
            <Button onClick={() => onJobClick(job)} style={{margin: "10px"}}>View</Button>
            {job.jobID}: {job.pickupDate} {job.customer}
            {latestRejection(job) && (
              <div className="job-item-rejection-details">
                <p>
                  Reason: {latestRejection(job).reason}
                  {latestRejection(job).otherReason &&
                    ` - ${latestRejection(job).otherReason}`}
                  <br></br>
                  Timestamp:{" "}
                  {new Date(latestRejection(job).timestamp).toLocaleString()}
                </p>
              </div>
            )}
            {job.history &&
              job.assignedStatus !== "reassigned" &&
              job.history.some((entry) => entry.status === "rejected") &&
              !job.history.some((entry) => entry.status === "reassigned") && (
                <span className="job-item-rejected">
                  (Unassigned)
                  <Button onClick={() => handleReassign(job)}>Reassign</Button>
                </span>
              )}

            <hr></hr>
          </div>
        ))}
      </div>
      {showReassignForm && (
        <ReassignForm
          employees={employees}
          onSubmit={handleReassignSubmit}
          onCancel={handleReassignCancel}
        />
      )}
    </div>
  );
};
export default JobList;
