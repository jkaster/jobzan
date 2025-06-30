import React, { useState, useEffect, useRef } from 'react';
import type { Job } from '../types/Job';
import type { Employer } from '../types/Employer';
import { Button, TextField, MenuItem, Box, Autocomplete } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface JobFormProps {
  job?: Job;
  onSubmit: (job: Job) => void;
  employers: Employer[];
}

const JobForm = ({ job, onSubmit, employers }: JobFormProps) => {
  const { t } = useTranslation();
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
    jobDescriptionLink: job?.jobDescriptionLink || '',
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
      <TextField name="title" label={t('title')} value={formData.title} onChange={handleChange} fullWidth margin="normal" inputRef={titleInputRef} />
      <Autocomplete
        options={employers}
        getOptionLabel={(option: Employer) => option.name}
        value={employers.find(emp => emp.id === formData.employerId) || null}
        onChange={(_event: React.SyntheticEvent, newValue: Employer | null) => {
          setFormData({ ...formData, employerId: newValue ? newValue.id : '' });
        }}
        renderInput={(params) => <TextField {...params} label={t('employer')} fullWidth margin="normal" />}
      />
      <TextField name="salary" label={t('salary')} type="number" value={formData.salary} onChange={handleChange} fullWidth margin="normal" />
      <TextField name="status" label={t('status')} select value={formData.status} onChange={handleChange} fullWidth margin="normal">
        <MenuItem value="lead">{t('lead')}</MenuItem>
        <MenuItem value="applied">{t('applied')}</MenuItem>
        <MenuItem value="interview">{t('interview')}</MenuItem>
        <MenuItem value="offer">{t('offer')}</MenuItem>
        <MenuItem value="rejected">{t('rejected')}</MenuItem>
      </TextField>
      <TextField name="commute" label={t('commute')} select value={formData.commute} onChange={handleChange} fullWidth margin="normal">
        <MenuItem value="remote">{t('remote')}</MenuItem>
        <MenuItem value="hybrid">{t('hybrid')}</MenuItem>
        <MenuItem value="on-site">{t('on_site')}</MenuItem>
      </TextField>
      <TextField name="description" label={t('description')} value={formData.description} onChange={handleChange} fullWidth margin="normal" multiline rows={4} />
      <TextField name="notes" label={t('notes')} value={formData.notes} onChange={handleChange} fullWidth margin="normal" multiline rows={4} />
      <TextField name="jobDescriptionLink" label={t('job')} value={formData.jobDescriptionLink} onChange={handleChange} fullWidth margin="normal" />
      <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
        {job ? t('update_job') : t('add_job')}
      </Button>
    </Box>
  );
};

export default JobForm;