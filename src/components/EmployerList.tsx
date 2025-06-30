
import React from 'react';
import type { Employer } from '../types/Employer';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';

interface EmployerListProps {
  employers: Employer[];
  onEdit: (employer: Employer) => void;
  onDelete: (id: string) => void;
}

const EmployerList: React.FC<EmployerListProps> = ({ employers, onEdit, onDelete }) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="employer table">
        <TableHead>
          <TableRow>
            <TableCell>Company Name</TableCell>
            <TableCell>Contact Name</TableCell>
            <TableCell>Contact Email</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {employers.map((employer) => (
            <TableRow
              key={employer.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {employer.name}
              </TableCell>
              <TableCell>{employer.contactName}</TableCell>
              <TableCell>{employer.contactEmail}</TableCell>
              <TableCell>
                <Button variant="outlined" size="small" onClick={(e) => { e.stopPropagation(); onEdit(employer); }} sx={{ mr: 1 }}>
                  Edit
                </Button>
                <Button variant="outlined" size="small" color="error" onClick={(e) => { e.stopPropagation(); onDelete(employer.id); }}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default EmployerList;
