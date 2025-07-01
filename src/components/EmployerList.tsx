
import React from 'react';
import type { Employer } from 'jobtypes';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TablePagination } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface EmployerListProps {
  employers: Employer[];
  onEdit: (employer: Employer) => void;
  onDelete: (id: string) => void;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  count: number;
}

const EmployerList = ({ employers, onEdit, onDelete, page, rowsPerPage, onPageChange, onRowsPerPageChange, count }: EmployerListProps) => {
  const { t } = useTranslation();
  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="employer table">
          <TableHead>
            <TableRow>
              <TableCell>{t('company_name')}</TableCell>
              <TableCell>{t('contact_name')}</TableCell>
              <TableCell>{t('contact_email')}</TableCell>
            <TableCell>{t('website')}</TableCell>
            <TableCell>{t('actions')}</TableCell>
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
                  {employer.website ? (
                    <a href={employer.website} target="_blank" rel="noopener noreferrer">
                      {employer.website.replace(/^(https?:\/\/)/, '')}
                    </a>
                  ) : (
                    'N/A'
                  )}
                </TableCell>
                <TableCell>
                  <Button variant="outlined" size="small" onClick={(e) => { e.stopPropagation(); onEdit(employer); }} sx={{ mr: 1 }} aria-label={t('edit_employer_aria_label', { employerName: employer.name })}>
                    {t('edit')}
                  </Button>
                  <Button variant="outlined" size="small" color="error" onClick={(e) => { e.stopPropagation(); onDelete(employer.id); }} aria-label={t('delete_employer_aria_label', { employerName: employer.name })}>
                    {t('delete')}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
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

export default EmployerList;
