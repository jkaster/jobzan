import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import type { IEmployer } from "jobtypes";
import { Button, TextField, Box } from "@mui/material";

/**
 * Props for the EmployerForm component.
 * @interface
 */
interface IEmployerFormProps {
  /** The employer object to pre-fill the form for editing. */
  employer?: IEmployer;
  /** Callback function to handle form submission. */
  onSubmit: (employer: IEmployer) => void;
}

/**
 * A form component for adding or editing employer details.
 * @param {IEmployerFormProps} props - The component props.
 * @returns {JSX.Element} The EmployerForm component.
 */
const EmployerForm = ({ employer, onSubmit }: IEmployerFormProps) => {
  const { t } = useTranslation();
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<IEmployer>({
    id: employer?.id || "",
    name: employer?.name || "",
    latitude: employer?.latitude || 0,
    longitude: employer?.longitude || 0,
    contactName: employer?.contactName || "",
    contactPhone: employer?.contactPhone || "",
    contactEmail: employer?.contactEmail || "",
    website: employer?.website || "",
  });

  useEffect(() => {
    if (employer) {
      setFormData(employer);
    }
    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [employer]);

  /**
   * Handles changes to form input fields.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The change event.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]:
        name === "latitude" || name === "longitude" ? parseFloat(value) : value,
    });
  };

  /**
   * Handles form submission.
   * @param {React.FormEvent} e - The form submission event.
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <TextField
        name="name"
        label="Company Name"
        value={formData.name}
        onChange={handleChange}
        fullWidth
        margin="normal"
        inputRef={nameInputRef}
      />
      <TextField
        name="latitude"
        label="Latitude"
        type="number"
        value={formData.latitude}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        name="longitude"
        label="Longitude"
        type="number"
        value={formData.longitude}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        name="contactName"
        label="Contact Name"
        value={formData.contactName}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        name="contactPhone"
        label="Contact Phone"
        value={formData.contactPhone}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        name="contactEmail"
        label="Contact Email"
        value={formData.contactEmail}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        name="website"
        label="Website"
        value={formData.website}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
        {employer ? t("update_employer") : t("add_employer")}
      </Button>
    </Box>
  );
};

export default EmployerForm;
