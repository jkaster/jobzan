
import React, { useEffect, useRef } from 'react';
import type { Job } from '../types/Job';
import type { Employer } from '../types/Employer';
import { Typography, Box, Paper } from '@mui/material';

interface JobDetailsProps {
  job: Job;
  employers: Employer[];
}

const JobDetails: React.FC<JobDetailsProps> = ({ job, employers }) => {
  const detailsRef = useRef<HTMLDivElement>(null);
  const employer = employers.find(emp => emp.id === job.employerId);

  useEffect(() => {
    if (detailsRef.current) {
      detailsRef.current.focus();
    }
  }, [job]);

  if (!employer) {
    return <Typography color="error">Employer not found for this job.</Typography>;
  }

  return (
    <Box sx={{ p: 2 }} ref={detailsRef} tabIndex={-1}>
      <Typography variant="h5" gutterBottom>{job.title}</Typography>
      <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6">Employer Details</Typography>
        <Typography><strong>Company:</strong> {employer.name}</Typography>
        <Typography><strong>Location:</strong> Lat: {employer.location.latitude}, Lng: {employer.location.longitude}</Typography>
        <Typography><strong>Contact:</strong> {employer.contactName} ({employer.contactEmail}, {employer.contactPhone})</Typography>
      </Paper>
      <Paper elevation={1} sx={{ p: 2 }}>
        <Typography variant="h6">Job Details</Typography>
        <Typography><strong>Salary:</strong> ${job.salary.toLocaleString()}</Typography>
        <Typography><strong>Status:</strong> {job.status}</Typography>
        <Typography><strong>Commute:</strong> {job.commute}</Typography>
        <Typography><strong>Description:</strong> {job.description}</Typography>
        <Typography><strong>Notes:</strong> {job.notes}</Typography>
      </Paper>
    </Box>
  );
};

export default JobDetails;
