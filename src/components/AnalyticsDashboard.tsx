import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import { fetchWithRetry } from '../utils/fetchWithRetry';

interface IAnalyticsData {
  title: string;
  "Remote": number;
  "Hybrid": number;
  "On-Site": number;
  "Overall Average": number;
  [key: string]: string | number; // For dynamic commute columns
}

const AnalyticsDashboard = () => {
  const { t } = useTranslation();
  const [analyticsData, setAnalyticsData] = useState<IAnalyticsData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await fetchWithRetry('/api/analytics');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: IAnalyticsData[] = await response.json();
        setAnalyticsData(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return <Typography>{t('loading_analytics')}</Typography>;
  }

  if (error) {
    return <Typography color="error">{t('error_loading_analytics')}: {error}</Typography>;
  }

  if (analyticsData.length === 0) {
    return <Typography>{t('no_analytics_data')}</Typography>;
  }

  // Extract dynamic column headers from the first data row
  const headers = Object.keys(analyticsData[0]).filter(key => key !== 'title');

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="analytics table">
        <TableHead>
          <TableRow>
            <TableCell>{t('job_title')}</TableCell>
            {headers.map(header => (
              <TableCell key={header}>{t(header.toLowerCase().replace(/ /g, '_')) || header}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {analyticsData.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.title}</TableCell>
              {headers.map(header => (
                <TableCell key={header}>{typeof row[header] === 'number' ? `$${row[header].toLocaleString()}` : row[header]}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AnalyticsDashboard;
