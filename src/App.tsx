import { useState } from 'react';
import useGeolocation from './hooks/useGeolocation';
import useJobData from './hooks/useJobData';
import Layout from './components/Layout';
import { Typography, Button, Dialog, DialogTitle, DialogContent, Tabs, Tab, Box } from '@mui/material';
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
          <JobList jobs={jobs} onEdit={handleOpenJobForm} onViewDetails={handleViewJobDetails} userLocation={userLocation} employers={employers} />
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
