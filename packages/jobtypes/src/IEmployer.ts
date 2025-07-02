/**
 * Represents an employer.
 * @interface
 */
export interface IEmployer {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  website?: string;
}