
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { Employer } from 'jobtypes';
import { Button, TextField, Box } from '@mui/material';

interface EmployerFormProps {
  employer?: Employer;
  onSubmit: (employer: Employer) => void;
}

const EmployerForm = ({ employer, onSubmit }: EmployerFormProps) => {
  const { t } = useTranslation();
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<Employer>({
    id: employer?.id || '',
    name: employer?.name || '',
    location: employer?.location || { latitude: 0, longitude: 0 },
    contactName: employer?.contactName || '',
    contactPhone: employer?.contactPhone || '',
    contactEmail: employer?.contactEmail || '',
  });

  useEffect(() => {
    if (employer) {
      setFormData(employer);
    }
    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [employer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, location: { ...formData.location, [name]: parseFloat(value) } });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <TextField name="name" label="Company Name" value={formData.name} onChange={handleChange} fullWidth margin="normal" inputRef={nameInputRef} />
      <TextField name="latitude" label="Latitude" type="number" value={formData.location.latitude} onChange={handleLocationChange} fullWidth margin="normal" />
      <TextField name="longitude" label="Longitude" type="number" value={formData.location.longitude} onChange={handleLocationChange} fullWidth margin="normal" />
      <TextField name="contactName" label="Contact Name" value={formData.contactName} onChange={handleChange} fullWidth margin="normal" />
      <TextField name="contactPhone" label="Contact Phone" value={formData.contactPhone} onChange={handleChange} fullWidth margin="normal" />
      <TextField name="contactEmail" label="Contact Email" value={formData.contactEmail} onChange={handleChange} fullWidth margin="normal" />
      <TextField name="website" label="Website" value={formData.website} onChange={handleChange} fullWidth margin="normal" />
      <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
        {employer ? t('update_employer') : t('add_employer')}
      </Button>
    </Box>
  );
};

export default EmployerForm;
