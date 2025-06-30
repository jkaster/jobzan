
export interface Employer {
  id: string;
  name: string;
  location: {
    latitude: number;
    longitude: number;
  };
  contactName: string;
  contactPhone: string;
  contactEmail: string;
}
