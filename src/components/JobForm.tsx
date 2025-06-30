
import React, { useState, useEffect, useRef } from 'react';
import type { Job } from '../types/Job';
import type { Employer } from '../types/Employer';
import { mockEmployers } from '../mockData';
import { Button, TextField, MenuItem, Box } from '@mui/material';

interface JobFormProps {
  job?: Job;
  onSubmit: (job: Job) => void;
}

const JobForm: React.FC<JobFormProps> = ({ job, onSubmit }) => {
  const titleInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<Job>({
    id: job?.id || '',
    employerId: job?.employerId || '',
    title: job?.title || '',
    salary: job?.salary || 0,
    status: job?.status || 'lead',
    commute: job?.commute || 'remote',
    description: job?.description || '',
    notes: job?.notes || '',
  });

  useEffect(() => {
    if (job) {
      setFormData(job);
    }
    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [job]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <TextField name="title" label="Title" value={formData.title} onChange={handleChange} fullWidth margin="normal" inputRef={titleInputRef} />
      <TextField name="employerId" label="Employer" select value={formData.employerId} onChange={handleChange} fullWidth margin="normal">
        {mockEmployers.map((employer) => (
          <MenuItem key={employer.id} value={employer.id}>
            {employer.name}
          </MenuItem>
        ))}
      </TextField>
      <TextField name="salary" label="Salary" type="number" value={formData.salary} onChange={handleChange} fullWidth margin="normal" />
      <TextField name="status" label="Status" select value={formData.status} onChange={handleChange} fullWidth margin="normal">
        <MenuItem value="lead">Lead</MenuItem>
        <MenuItem value="applied">Applied</MenuItem>
        <MenuItem value="interview">Interview</MenuItem>
        <MenuItem value="offer">Offer</MenuItem>
        <MenuItem value="rejected">Rejected</MenuItem>
      </TextField>
      <TextField name="commute" label="Commute" select value={formData.commute} onChange={handleChange} fullWidth margin="normal">
        <MenuItem value="remote">Remote</MenuItem>
        <MenuItem value="hybrid">Hybrid</MenuItem>
        <MenuItem value="on-site">On-site</MenuItem>
      </TextField>
      <TextField name="description" label="Description" value={formData.description} onChange={handleChange} fullWidth margin="normal" multiline rows={4} />
      <TextField name="notes" label="Notes" value={formData.notes} onChange={handleChange} fullWidth margin="normal" multiline rows={4} />
      <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
        {job ? 'Update Job' : 'Add Job'}
      </Button>
    </Box>
  );
};

export default JobForm;
