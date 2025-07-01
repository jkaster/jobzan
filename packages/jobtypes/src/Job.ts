export interface Job {
  id: string;
  employerId: string;
  title: string;
  salary: number;
  status: 'lead' | 'applied' | 'interview' | 'offer' | 'rejected';
  commute: 'remote' | 'hybrid' | 'on-site';
  description: string;
  notes: string;
  jobDescriptionLink?: string;
}
