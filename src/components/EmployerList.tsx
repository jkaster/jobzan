import React from 'react';
import type { IEmployer } from 'jobtypes';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TablePagination,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

/**
 * Props for the EmployerList component.
 * @interface
 */
interface IEmployerListProps {
  /** An array of employer objects to display. */
  employers: IEmployer[];
  /** Callback function for when an employer is to be edited. */
  onEdit: (employer: IEmployer) => void;
  /** Callback function for when an employer is to be deleted. */
  onDelete: (id: string) => void;
  /** The current page number for pagination. */
  page: number;
  /** The number of rows to display per page for pagination. */
  rowsPerPage: number;
  /** Callback function for page changes in pagination. */
  onPageChange: (event: unknown, newPage: number) => void;
  /** Callback function for rows per page changes in pagination. */
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  /** The total count of employers for pagination. */
  count: number;
}

/**
 * A component that displays a list of employers in a table format.
 * It includes features for editing and deleting employers, and pagination.
 * @param {IEmployerListProps} props - The component props.
 * @returns {JSX.Element} The EmployerList component.
 */
const EmployerList = ({
  employers,
  onEdit,
  onDelete,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  count,
}: IEmployerListProps) => {
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
            {employers.map((employer: IEmployer) => (
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
                    <a
                      href={employer.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {employer.website.replace(/^(https?:\/\/\/)/, '')}
                    </a>
                  ) : (
                    'N/A'
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(employer);
                    }}
                    sx={{ mr: 1 }}
                    aria-label={t('edit_employer_aria_label', {
                      employerName: employer.name,
                    })}
                  >
                    {t('edit')}
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    color="error"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(employer.id);
                    }}
                    aria-label={t('delete_employer_aria_label', {
                      employerName: employer.name,
                    })}
                  >
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
