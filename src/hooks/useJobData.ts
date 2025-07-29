import { useState, useEffect } from 'react';
import type { IJob, IEmployer } from 'jobtypes';
import { fetchWithRetry } from '../utils/fetchWithRetry';

const API_BASE_URL = '/api'; // Use proxy for backend URL

/**
 * A custom React hook for managing job and employer data, including fetching, adding, updating, and deleting.
 * It uses `fetchWithRetry` for all API interactions.
 * @returns An object containing job data, employer data, and functions to manipulate them.
 */
const useJobData = () => {
  const [jobs, setJobs] = useState<IJob[]>([]);
  const [employers, setEmployers] = useState<IEmployer[]>([]);

  // Fetch initial data
  useEffect(() => {
    /**
     * Fetches all job data from the backend API.
     */
    const fetchJobs = async () => {
      try {
        const response = await fetchWithRetry(`${API_BASE_URL}/jobs`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setJobs(data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    /**
     * Fetches all employer data from the backend API.
     */
    const fetchEmployers = async () => {
      try {
        const response = await fetchWithRetry(`${API_BASE_URL}/employers`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setEmployers(data);
      } catch (error) {
        console.error('Error fetching employers:', error);
      }
    };

    fetchJobs();
    fetchEmployers();
  }, []);

  /**
   * Adds a new job to the backend API.
   * @param job The job object to add.
   */
  const addJob = async (job: IJob) => {
    try {
      const response = await fetchWithRetry(`${API_BASE_URL}/jobs`, {
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
      console.error('Error adding job:', error);
    }
  };

  /**
   * Updates an existing job in the backend API.
   * @param job The job object with updated data.
   */
  const updateJob = async (job: IJob) => {
    try {
      const response = await fetchWithRetry(`${API_BASE_URL}/jobs/${job.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(job),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const updatedJob = await response.json();
      setJobs((prevJobs) =>
        prevJobs.map((j) => (j.id === updatedJob.id ? updatedJob : j)),
      );
    } catch (error) {
      console.error('Error updating job:', error);
    }
  };

  /**
   * Adds a new employer to the backend API.
   * @param employer The employer object to add.
   */
  const addEmployer = async (employer: IEmployer) => {
    try {
      const response = await fetchWithRetry(`${API_BASE_URL}/employers`, {
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
      console.error('Error adding employer:', error);
    }
  };

  /**
   * Updates an existing employer in the backend API.
   * @param employer The employer object with updated data.
   */
  const updateEmployer = async (employer: IEmployer) => {
    try {
      const response = await fetchWithRetry(
        `${API_BASE_URL}/employers/${employer.id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(employer),
        },
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const updatedEmployer = await response.json();
      setEmployers((prevEmployers) =>
        prevEmployers.map((e) =>
          e.id === updatedEmployer.id ? updatedEmployer : e,
        ),
      );
    } catch (error) {
      console.error('Error updating employer:', error);
    }
  };

  /**
   * Deletes an employer from the backend API.
   * @param id The ID of the employer to delete.
   */
  const deleteEmployer = async (id: string) => {
    if (
      window.confirm(
        'Are you sure you want to delete this employer and all associated jobs?',
      )
    ) {
      try {
        const response = await fetchWithRetry(
          `${API_BASE_URL}/employers/${id}`,
          {
            method: 'DELETE',
          },
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        setEmployers((prevEmployers) =>
          prevEmployers.filter((e) => e.id !== id),
        );
        setJobs((prevJobs) => prevJobs.filter((job) => job.employerId !== id));
      } catch (error) {
        console.error('Error deleting employer:', error);
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
