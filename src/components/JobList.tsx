
import React from 'react';
import type { Job } from '../types/Job';
import type { Employer } from '../types/Employer';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';

interface JobListProps {
  jobs: Job[];
  onEdit: (job: Job) => void;
  onViewDetails: (job: Job) => void;
  userLocation: { latitude: number; longitude: number } | null;
  employers: Employer[];
}

const JobList: React.FC<JobListProps> = ({ jobs, onEdit, onViewDetails, userLocation, employers }) => {
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
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Employer</TableCell>
            <TableCell>Salary</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Commute</TableCell>
            <TableCell>Distance (miles)</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {jobs.map((job) => {
            const employer = employers.find(emp => emp.id === job.employerId);
            const distance = userLocation && employer ? 
              calculateDistance(userLocation.latitude, userLocation.longitude, employer.location.latitude, employer.location.longitude) : 'N/A';

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
                  <Button variant="outlined" size="small" onClick={(e) => { e.stopPropagation(); onEdit(job); }}>
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default JobList;
