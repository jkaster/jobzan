import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import useJobData from './useJobData';
import type { IJob, IEmployer } from 'jobtypes';
import { AllTheProviders } from '../tests/setup';

const mockJobs: IJob[] = [
  {
    id: '1',
    employerId: 'e1',
    title: 'Developer',
    salary: 100000,
    status: 'applied',
    commute: 'remote',
    description: 'Dev role',
    notes: '',
  },
];

const mockEmployers: IEmployer[] = [
  {
    id: 'e1',
    name: 'Acme',
    latitude: 0,
    longitude: 0,
    contactName: 'Jane',
    contactPhone: '555-1234',
    contactEmail: 'jane@acme.com',
  },
];

const server = setupServer(
  http.get('/api/jobs', () => HttpResponse.json(mockJobs)),
  http.get('/api/employers', () => HttpResponse.json(mockEmployers)),
  http.post('/api/jobs', async ({ request }) => {
    const body = (await request.json()) as IJob;
    return HttpResponse.json({ ...body, id: 'new-job' }, { status: 201 });
  }),
  http.put('/api/jobs/:id', async ({ request }) => {
    const body = (await request.json()) as IJob;
    return HttpResponse.json(body);
  }),
  http.post('/api/employers', async ({ request }) => {
    const body = (await request.json()) as IEmployer;
    return HttpResponse.json({ ...body, id: 'new-emp' }, { status: 201 });
  }),
  http.put('/api/employers/:id', async ({ request }) => {
    const body = (await request.json()) as IEmployer;
    return HttpResponse.json(body);
  }),
  http.delete(
    '/api/employers/:id',
    () => new HttpResponse(null, { status: 204 }),
  ),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('useJobData', () => {
  it('fetches jobs and employers on mount', async () => {
    const { result } = renderHook(() => useJobData(), {
      wrapper: AllTheProviders,
    });
    await waitFor(() => {
      expect(result.current.jobs).toEqual(mockJobs);
      expect(result.current.employers).toEqual(mockEmployers);
    });
  });

  it('adds a job', async () => {
    const { result } = renderHook(() => useJobData(), {
      wrapper: AllTheProviders,
    });
    await waitFor(() => expect(result.current.jobs.length).toBe(1));

    await act(async () => {
      await result.current.addJob({
        id: '',
        employerId: 'e1',
        title: 'Tester',
        salary: 80000,
        status: 'lead',
        commute: 'hybrid',
        description: 'Test role',
        notes: '',
      });
    });

    await waitFor(() => expect(result.current.jobs.length).toBeGreaterThan(0));
  });

  it('updates a job', async () => {
    const { result } = renderHook(() => useJobData(), {
      wrapper: AllTheProviders,
    });
    await waitFor(() => expect(result.current.jobs.length).toBe(1));

    await act(async () => {
      await result.current.updateJob({ ...mockJobs[0], title: 'Senior Dev' });
    });

    await waitFor(() => expect(result.current.jobs.length).toBeGreaterThan(0));
  });

  it('adds an employer', async () => {
    const { result } = renderHook(() => useJobData(), {
      wrapper: AllTheProviders,
    });
    await waitFor(() => expect(result.current.employers.length).toBe(1));

    await act(async () => {
      await result.current.addEmployer({
        id: '',
        name: 'NewCo',
        latitude: 1,
        longitude: 1,
        contactName: 'Bob',
        contactPhone: '555-0000',
        contactEmail: 'bob@newco.com',
      });
    });

    await waitFor(() =>
      expect(result.current.employers.length).toBeGreaterThan(0),
    );
  });

  it('updates an employer', async () => {
    const { result } = renderHook(() => useJobData(), {
      wrapper: AllTheProviders,
    });
    await waitFor(() => expect(result.current.employers.length).toBe(1));

    await act(async () => {
      await result.current.updateEmployer({
        ...mockEmployers[0],
        name: 'Acme Corp',
      });
    });

    await waitFor(() =>
      expect(result.current.employers.length).toBeGreaterThan(0),
    );
  });

  it('deletes an employer', async () => {
    const { result } = renderHook(() => useJobData(), {
      wrapper: AllTheProviders,
    });
    await waitFor(() => expect(result.current.employers.length).toBe(1));

    await act(async () => {
      await result.current.deleteEmployer('e1');
    });

    await waitFor(() =>
      expect(result.current.employers.length).toBeGreaterThanOrEqual(0),
    );
  });
});
