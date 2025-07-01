import React from 'react';
import type { Job, Employer } from 'jobtypes';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TablePagination } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface JobListProps {
  jobs: Job[];
  onEdit: (job: Job) => void;
  onViewDetails: (job: Job) => void;
  userLocation: { latitude: number; longitude: number } | null;
  employers: Employer[];
  page: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  count: number;
}

const JobList = ({ jobs, onEdit, onViewDetails, userLocation, employers, page, rowsPerPage, onPageChange, onRowsPerPageChange, count }: JobListProps) => {
  const { t } = useTranslation();
  // Haversine formula to calculate distance between two lat/lng points
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 3958.8; // Radius of Earth in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance.toFixed(2);
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>{t('title')}</TableCell>
              <TableCell>{t('employer')}</TableCell>
              <TableCell>{t('salary')}</TableCell>
              <TableCell>{t('status')}</TableCell>
              <TableCell>{t('commute')}</TableCell>
              <TableCell>Distance (miles)</TableCell>
              <TableCell>{t('actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {jobs.map((job) => {
              const employer = employers.find(emp => emp.id === job.employerId);
              const distance = userLocation && employer ? 
                calculateDistance(userLocation.latitude, userLocation.longitude, employer.latitude, employer.longitude) : 'N/A';

              return (
                <TableRow
                  key={job.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 }, cursor: 'pointer' }}
                  onClick={() => onViewDetails(job)}
                >
                  <TableCell component="th" scope="row">
                    {job.title}
                  </TableCell>
                  <TableCell>{employer?.name || 'N/A'}</TableCell>
                  <TableCell>${job.salary.toLocaleString()}</TableCell>
                  <TableCell>{job.status}</TableCell>
                  <TableCell>{job.commute}</TableCell>
                  <TableCell>{distance}</TableCell>
                  <TableCell>
                    <Button variant="outlined" size="small" onClick={(e) => { e.stopPropagation(); onEdit(job); }} aria-label={t('edit_job_aria_label', { jobTitle: job.title, employerName: employer?.name || '' })}>
                    {t('edit')}
                  </Button>
                  {job.jobDescriptionLink && (
                    <Button variant="outlined" size="small" sx={{ ml: 1 }} href={job.jobDescriptionLink} target="_blank" rel="noopener noreferrer" aria-label={t('view_job_description_aria_label', { jobTitle: job.title, employerName: employer?.name || '' })}>
                      {t('job')}
                    </Button>
                  )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={count}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
      />
    </>
  );
};

export default JobList;