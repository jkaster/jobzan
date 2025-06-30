import { useState } from 'react';
import useGeolocation from './hooks/useGeolocation';
import useJobData from './hooks/useJobData';
import Layout from './components/Layout';
import { Typography, Button, Dialog, DialogTitle, DialogContent, Tabs, Tab, Box, TextField, MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import JobList from './components/JobList';
import JobForm from './components/JobForm';
import JobDetails from './components/JobDetails';
import EmployerList from './components/EmployerList';
import EmployerForm from './components/EmployerForm';
import type { Job } from './types/Job';
import type { Employer } from './types/Employer';

function App() {
  const { jobs, employers, addJob, updateJob, addEmployer, updateEmployer, deleteEmployer } = useJobData();
  const [open, setOpen] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | undefined>(undefined);
  const [selectedEmployer, setSelectedEmployer] = useState<Employer | undefined>(undefined);
  const [currentTab, setCurrentTab] = useState(0); // 0 for Jobs, 1 for Employers
  const { userLocation } = useGeolocation();

  // State for filtering, sorting, and searching
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCommute, setFilterCommute] = useState<string>('all');
  const [sortField, setSortField] = useState<keyof Job | 'employerName'>('title');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleLogData = () => {
    console.log('--- Current Employers Data ---');
    console.log(JSON.stringify(employers, null, 2));
    console.log('--- Current Jobs Data ---');
    console.log(JSON.stringify(jobs, null, 2));
  };

  const handleOpenJobForm = (job?: Job) => {
    setSelectedJob(job);
    setOpenDetails(false); // Close details dialog if open
    setOpen(true);
  };

  const handleOpenEmployerForm = (employer?: Employer) => {
    setSelectedEmployer(employer);
    setOpen(true); // Use the same dialog for job/employer forms
  };

  const handleViewJobDetails = (job: Job) => {
    setSelectedJob(job);
    setOpen(false); // Close edit/add dialog if open
    setOpenDetails(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setOpenDetails(false);
    setSelectedJob(undefined);
    setSelectedEmployer(undefined);
  };

  const handleSubmitJob = (job: Job) => {
    if (job.id) {
      updateJob(job);
    } else {
      addJob(job);
    }
    handleCloseDialog();
  };

  const handleSubmitEmployer = (employer: Employer) => {
    if (employer.id) {
      updateEmployer(employer);
    } else {
      addEmployer(employer);
    }
    handleCloseDialog();
  };

  const handleDeleteEmployer = (id: string) => {
    if (window.confirm('Are you sure you want to delete this employer and all associated jobs?')) {
      deleteEmployer(id);
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  // Filtering, Sorting, and Searching Logic
  const filteredJobs = jobs.filter((job) => {
    const employer = employers.find(emp => emp.id === job.employerId);
    const matchesStatus = filterStatus === 'all' || job.status === filterStatus;
    const matchesCommute = filterCommute === 'all' || job.commute === filterCommute;
    const matchesSearch = searchQuery === '' ||
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (employer && employer.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesCommute && matchesSearch;
  });

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    let compareA: string | number = '';
    let compareB: string | number = '';

    if (sortField === 'employerName') {
      compareA = employers.find(emp => emp.id === a.employerId)?.name || '';
      compareB = employers.find(emp => emp.id === b.employerId)?.name || '';
    } else if (sortField === 'salary') {
      compareA = a.salary;
      compareB = b.salary;
    } else {
      compareA = a[sortField as keyof Job] as string;
      compareB = b[sortField as keyof Job] as string;
    }

    if (compareA < compareB) {
      return sortOrder === 'asc' ? -1 : 1;
    }
    if (compareA > compareB) {
      return sortOrder === 'asc' ? 1 : -1;
    }
    return 0;
  });

  return (
    <Layout>
      <Typography variant="h4" component="h1" gutterBottom>
        Jobzan, the job hunter
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={currentTab} onChange={handleTabChange} aria-label="basic tabs example">
          <Tab label="Jobs" />
          <Tab label="Employers" />
        </Tabs>
      </Box>

      {currentTab === 0 && (
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" color="primary" onClick={() => handleOpenJobForm()}>
            Add Job
          </Button>
          <Button variant="contained" color="secondary" onClick={handleLogData} sx={{ ml: 2 }}>
            Log Data to Console
          </Button>

          <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              label="Search"
              variant="outlined"
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              sx={{ width: 200 }}
            />
            <FormControl sx={{ width: 150 }}>
              <InputLabel id="filter-status-label">Filter Status</InputLabel>
              <Select
                labelId="filter-status-label"
                value={filterStatus}
                label="Filter Status"
                onChange={(e) => setFilterStatus(e.target.value as string)}
              >
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value="lead">Lead</MenuItem>
                <MenuItem value="applied">Applied</MenuItem>
                <MenuItem value="interview">Interview</MenuItem>
                <MenuItem value="offer">Offer</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ width: 150 }}>
              <InputLabel id="filter-commute-label">Filter Commute</InputLabel>
              <Select
                labelId="filter-commute-label"
                value={filterCommute}
                label="Filter Commute"
                onChange={(e) => setFilterCommute(e.target.value as string)}
              >
                <MenuItem value="all">All Commutes</MenuItem>
                <MenuItem value="remote">Remote</MenuItem>
                <MenuItem value="hybrid">Hybrid</MenuItem>
                <MenuItem value="on-site">On-site</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ width: 150 }}>
              <InputLabel id="sort-by-label">Sort By</InputLabel>
              <Select
                labelId="sort-by-label"
                value={sortField}
                label="Sort By"
                onChange={(e) => setSortField(e.target.value as keyof Job | 'employerName')}
              >
                <MenuItem value="title">Title</MenuItem>
                <MenuItem value="employerName">Employer</MenuItem>
                <MenuItem value="salary">Salary</MenuItem>
                <MenuItem value="status">Status</MenuItem>
                <MenuItem value="commute">Commute</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ width: 150 }}>
              <InputLabel id="sort-order-label">Sort Order</InputLabel>
              <Select
                labelId="sort-order-label"
                value={sortOrder}
                label="Sort Order"
                onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
              >
                <MenuItem value="asc">Ascending</MenuItem>
                <MenuItem value="desc">Descending</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <JobList jobs={sortedJobs} onEdit={handleOpenJobForm} onViewDetails={handleViewJobDetails} userLocation={userLocation} employers={employers} />
        </Box>
      )}

      {currentTab === 1 && (
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" color="primary" onClick={() => handleOpenEmployerForm()}>
            Add Employer
          </Button>
          <EmployerList employers={employers} onEdit={handleOpenEmployerForm} onDelete={handleDeleteEmployer} />
        </Box>
      )}

      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>{selectedJob ? 'Edit Job' : selectedEmployer ? 'Edit Employer' : 'Add New'}</DialogTitle>
        <DialogContent>
          {currentTab === 0 && <JobForm job={selectedJob} onSubmit={handleSubmitJob} employers={employers} />}
          {currentTab === 1 && <EmployerForm employer={selectedEmployer} onSubmit={handleSubmitEmployer} />}
        </DialogContent>
      </Dialog>

      <Dialog open={openDetails} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Job Details</DialogTitle>
        <DialogContent>
          {selectedJob && <JobDetails job={selectedJob} employers={employers} />}
        </DialogContent>
      </Dialog>
    </Layout>
  );
}

export default App;