
import { useState } from 'react';
import type { Job } from '../types/Job';
import type { Employer } from '../types/Employer';
import { mockJobs, mockEmployers } from '../mockData';

const useJobData = () => {
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [employers, setEmployers] = useState<Employer[]>(mockEmployers);

  const addJob = (job: Job) => {
    setJobs((prevJobs) => [...prevJobs, { ...job, id: new Date().toISOString() }]);
  };

  const updateJob = (job: Job) => {
    setJobs((prevJobs) => prevJobs.map((j) => (j.id === job.id ? job : j)));
  };

  const addEmployer = (employer: Employer) => {
    setEmployers((prevEmployers) => [...prevEmployers, { ...employer, id: new Date().toISOString() }]);
  };

  const updateEmployer = (employer: Employer) => {
    setEmployers((prevEmployers) => prevEmployers.map((e) => (e.id === employer.id ? employer : e)));
  };

  const deleteEmployer = (id: string) => {
    if (window.confirm('Are you sure you want to delete this employer and all associated jobs?')) {
      setEmployers((prevEmployers) => prevEmployers.filter((e) => e.id !== id));
      setJobs((prevJobs) => prevJobs.filter((job) => job.employerId !== id));
    }
  };

  return {
    jobs,
    employers,
    addJob,
    updateJob,
    addEmployer,
    updateEmployer,
    deleteEmployer,
  };
};

export default useJobData;
