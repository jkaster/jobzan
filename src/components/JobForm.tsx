import React, { useEffect, useRef } from "react";
import type { IJob, IEmployer } from "jobtypes";
import { Button, TextField, MenuItem, Box, Autocomplete } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useForm } from "../hooks/useForm";

/**
 * Props for the JobForm component.
 * @interface
 */
interface IJobFormProps {
  /** The job object to pre-fill the form for editing. */
  job?: IJob;
  /** Callback function to handle form submission. */
  onSubmit: (job: IJob) => void;
  /** An array of employer objects to populate the employer selection dropdown. */
  employers: IEmployer[];
}

/**
 * A form component for adding or editing job details.
 * @param {IJobFormProps} props - The component props.
 * @returns {JSX.Element} The JobForm component.
 */
const JobForm = ({ job, onSubmit, employers }: IJobFormProps) => {
  const { t } = useTranslation();
  const titleInputRef = useRef<HTMLInputElement>(null);
  const { formData, handleChange, setFormData } = useForm<IJob>({
    id: job?.id || "",
    employerId: job?.employerId || "",
    title: job?.title || "",
    salary: job?.salary || 0,
    status: job?.status || "lead",
    commute: job?.commute || "remote",
    description: job?.description || "",
    notes: job?.notes || "",
    jobDescriptionLink: job?.jobDescriptionLink || "",
  });

  useEffect(() => {
    if (job) {
      setFormData(job);
    }
    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [job, setFormData]);

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
        name="title"
        label={t("title")}
        value={formData.title}
        onChange={handleChange}
        fullWidth
        margin="normal"
        inputRef={titleInputRef}
      />
      <Autocomplete
        options={employers}
        getOptionLabel={(option: IEmployer) => option.name}
        value={employers.find((emp) => emp.id === formData.employerId) || null}
        onChange={(
          _event: React.SyntheticEvent,
          newValue: IEmployer | null,
        ) => {
          setFormData({ ...formData, employerId: newValue ? newValue.id : "" });
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={t("employer")}
            fullWidth
            margin="normal"
          />
        )}
      />
      <TextField
        name="salary"
        label={t("salary")}
        type="number"
        value={formData.salary}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        name="status"
        label={t("status")}
        select
        value={formData.status}
        onChange={handleChange}
        fullWidth
        margin="normal"
      >
        <MenuItem value="lead">{t("lead")}</MenuItem>
        <MenuItem value="applied">{t("applied")}</MenuItem>
        <MenuItem value="interview">{t("interview")}</MenuItem>
        <MenuItem value="offer">{t("offer")}</MenuItem>
        <MenuItem value="rejected">{t("rejected")}</MenuItem>
      </TextField>
      <TextField
        name="commute"
        label={t("commute")}
        select
        value={formData.commute}
        onChange={handleChange}
        fullWidth
        margin="normal"
      >
        <MenuItem value="remote">{t("remote")}</MenuItem>
        <MenuItem value="hybrid">{t("hybrid")}</MenuItem>
        <MenuItem value="on-site">{t("on_site")}</MenuItem>
      </TextField>
      <TextField
        name="description"
        label={t("description")}
        value={formData.description}
        onChange={handleChange}
        fullWidth
        margin="normal"
        multiline
        rows={4}
      />
      <TextField
        name="notes"
        label={t("notes")}
        value={formData.notes}
        onChange={handleChange}
        fullWidth
        margin="normal"
        multiline
        rows={4}
      />
      <TextField
        name="jobDescriptionLink"
        label={t("job")}
        value={formData.jobDescriptionLink}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
        {job ? t("update_job") : t("add_job")}
      </Button>
    </Box>
  );
};

export default JobForm;
