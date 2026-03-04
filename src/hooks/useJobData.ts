import useSWR from 'swr';
import type { IJob, IEmployer } from 'jobtypes';
import { fetcher, apiFetch } from '../utils/fetcher';

const API_BASE_URL = '/api';

const useJobData = () => {
  const {
    data: jobs = [],
    isLoading: isLoadingJobs,
    error: jobsError,
    mutate: mutateJobs,
  } = useSWR<IJob[]>(`${API_BASE_URL}/jobs`, fetcher);

  const {
    data: employers = [],
    isLoading: isLoadingEmployers,
    error: employersError,
    mutate: mutateEmployers,
  } = useSWR<IEmployer[]>(`${API_BASE_URL}/employers`, fetcher);

  const addJob = async (job: IJob) => {
    try {
      await apiFetch(`${API_BASE_URL}/jobs`, { method: 'POST', body: job });
      await mutateJobs();
    } catch (error) {
      console.error('Error adding job:', error);
    }
  };

  const updateJob = async (job: IJob) => {
    try {
      await apiFetch(`${API_BASE_URL}/jobs/${job.id}`, {
        method: 'PUT',
        body: job,
      });
      await mutateJobs();
    } catch (error) {
      console.error('Error updating job:', error);
    }
  };

  const addEmployer = async (employer: IEmployer) => {
    try {
      await apiFetch(`${API_BASE_URL}/employers`, {
        method: 'POST',
        body: employer,
      });
      await mutateEmployers();
    } catch (error) {
      console.error('Error adding employer:', error);
    }
  };

  const updateEmployer = async (employer: IEmployer) => {
    try {
      await apiFetch(`${API_BASE_URL}/employers/${employer.id}`, {
        method: 'PUT',
        body: employer,
      });
      await mutateEmployers();
    } catch (error) {
      console.error('Error updating employer:', error);
    }
  };

  const deleteEmployer = async (id: string) => {
    try {
      await apiFetch(`${API_BASE_URL}/employers/${id}`, { method: 'DELETE' });
      await Promise.all([mutateEmployers(), mutateJobs()]);
    } catch (error) {
      console.error('Error deleting employer:', error);
    }
  };

  return {
    jobs,
    employers,
    isLoading: isLoadingJobs || isLoadingEmployers,
    error: jobsError || employersError,
    addJob,
    updateJob,
    addEmployer,
    updateEmployer,
    deleteEmployer,
  };
};

export default useJobData;
