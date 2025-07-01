import { useState, useEffect } from 'react';
import type { Job, Employer } from 'jobtypes';

const API_BASE_URL = '/api'; // Use proxy for backend URL

const useJobData = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [employers, setEmployers] = useState<Employer[]>([]);

  // Fetch initial data
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/jobs`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setJobs(data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    const fetchEmployers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/employers`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setEmployers(data);
      } catch (error) {
        console.error("Error fetching employers:", error);
      }
    };

    fetchJobs();
    fetchEmployers();
  }, []);

  const addJob = async (job: Job) => {
    try {
      const response = await fetch(`${API_BASE_URL}/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(job),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const newJob = await response.json();
      setJobs((prevJobs) => [...prevJobs, newJob]);
    } catch (error) {
      console.error("Error adding job:", error);
    }
  };

  const updateJob = async (job: Job) => {
    try {
      const response = await fetch(`${API_BASE_URL}/jobs/${job.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(job),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const updatedJob = await response.json();
      setJobs((prevJobs) => prevJobs.map((j) => (j.id === updatedJob.id ? updatedJob : j)));
    } catch (error) {
      console.error("Error updating job:", error);
    }
  };

  const addEmployer = async (employer: Employer) => {
    try {
      const response = await fetch(`${API_BASE_URL}/employers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employer),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const newEmployer = await response.json();
      setEmployers((prevEmployers) => [...prevEmployers, newEmployer]);
    } catch (error) {
      console.error("Error adding employer:", error);
    }
  };

  const updateEmployer = async (employer: Employer) => {
    try {
      const response = await fetch(`${API_BASE_URL}/employers/${employer.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employer),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const updatedEmployer = await response.json();
      setEmployers((prevEmployers) => prevEmployers.map((e) => (e.id === updatedEmployer.id ? updatedEmployer : e)));
    } catch (error) {
      console.error("Error updating employer:", error);
    }
  };

  const deleteEmployer = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this employer and all associated jobs?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/employers/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        setEmployers((prevEmployers) => prevEmployers.filter((e) => e.id !== id));
        setJobs((prevJobs) => prevJobs.filter((job) => job.employerId !== id));
      } catch (error) {
        console.error("Error deleting employer:", error);
      }
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