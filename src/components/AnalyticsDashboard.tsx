import useSWR from 'swr';
import { useTranslation } from 'react-i18next';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from '@mui/material';
import { fetcher } from '../utils/fetcher';

interface IAnalyticsData {
  title: string;
  Remote: number;
  Hybrid: number;
  'On-Site': number;
  'Overall Average': number;
  [key: string]: string | number;
}

const AnalyticsDashboard = () => {
  const { t } = useTranslation();
  const {
    data: analyticsData,
    isLoading,
    error,
  } = useSWR<IAnalyticsData[]>('/api/analytics', fetcher);

  if (isLoading) {
    return <Typography>{t('loading_analytics')}</Typography>;
  }

  if (error) {
    return (
      <Typography color="error">
        {t('error_loading_analytics')}: {error.message}
      </Typography>
    );
  }

  if (!analyticsData || analyticsData.length === 0) {
    return <Typography>{t('no_analytics_data')}</Typography>;
  }

  const headers = Object.keys(analyticsData[0]).filter(
    (key) => key !== 'title',
  );

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="analytics table">
        <TableHead>
          <TableRow>
            <TableCell>{t('job_title')}</TableCell>
            {headers.map((header) => (
              <TableCell key={header}>
                {t(header.toLowerCase().replace(/ /g, '_')) || header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {analyticsData.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.title}</TableCell>
              {headers.map((header) => (
                <TableCell key={header}>
                  {typeof row[header] === 'number'
                    ? `$${row[header].toLocaleString()}`
                    : row[header]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AnalyticsDashboard;
