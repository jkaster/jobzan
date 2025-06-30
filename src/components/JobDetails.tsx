import { useEffect, useRef } from 'react';
import type { Job } from '../types/Job';
import type { Employer } from '../types/Employer';
import { Typography, Box, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface JobDetailsProps {
  job: Job;
  employers: Employer[];
}

const JobDetails = ({ job, employers }: JobDetailsProps) => {
  const { t } = useTranslation();
  const detailsRef = useRef<HTMLDivElement>(null);
  const employer = employers.find(emp => emp.id === job.employerId);

  useEffect(() => {
    if (detailsRef.current) {
      detailsRef.current.focus();
    }
  }, [job]);

  if (!employer) {
    return <Typography color="error">{t('employer_not_found')}</Typography>;
  }

  return (
    <Box sx={{ p: 2 }} ref={detailsRef} tabIndex={-1}>
      <Typography variant="h5" gutterBottom>{job.title}</Typography>
      <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6">{t('employer_details')}</Typography>
        <Typography><strong>{t('company_name')}:</strong> {employer.name}</Typography>
        <Typography><strong>{t('latitude')}:</strong> {employer.location.latitude}</Typography>
        <Typography><strong>{t('longitude')}:</strong> {employer.location.longitude}</Typography>
        <Typography><strong>{t('contact_name')}:</strong> {employer.contactName}</Typography>
        <Typography><strong>{t('contact_phone')}:</strong> {employer.contactPhone}</Typography>
        <Typography><strong>{t('contact_email')}:</strong> {employer.contactEmail}</Typography>
        {employer.website && (
          <Typography><strong>{t('website')}:</strong> <a href={employer.website} target="_blank" rel="noopener noreferrer">{employer.website}</a></Typography>
        )}
      </Paper>
      <Paper elevation={1} sx={{ p: 2 }}>
        <Typography variant="h6">{t('job_details')}</Typography>
        <Typography><strong>{t('salary')}:</strong> ${job.salary.toLocaleString()}</Typography>
        <Typography><strong>{t('status')}:</strong> {job.status}</Typography>
        <Typography><strong>{t('commute')}:</strong> {job.commute}</Typography>
        <Typography><strong>{t('description')}:</strong> {job.description}</Typography>
        <Typography><strong>{t('notes')}:</strong> {job.notes}</Typography>
        {job.jobDescriptionLink && (
          <Typography><strong>{t('job')}:</strong> <a href={job.jobDescriptionLink} target="_blank" rel="noopener noreferrer">{job.jobDescriptionLink}</a></Typography>
        )}
      </Paper>
    </Box>
  );
};

export default JobDetails;