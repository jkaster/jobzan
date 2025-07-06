import { useState, Suspense, lazy } from "react";
import useGeolocation from "./hooks/useGeolocation";
import useJobData from "./hooks/useJobData";
import Layout from "./components/Layout";
import {
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Tabs,
  Tab,
  Box,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  type SelectChangeEvent,
} from "@mui/material";
import type { IJob, IEmployer } from "jobtypes";
import { useTranslation } from "react-i18next";

const JobList = lazy(() => import("./components/JobList"));
const JobForm = lazy(() => import("./components/JobForm"));
const JobDetails = lazy(() => import("./components/JobDetails"));
const EmployerList = lazy(() => import("./components/EmployerList"));
const EmployerForm = lazy(() => import("./components/EmployerForm"));

/**
 * Main application component.
 * Manages global state, routing (via tabs), and data flow for jobs and employers.
 * @returns {JSX.Element} The root App component.
 */
function App() {
  const {
    jobs,
    employers,
    addJob,
    updateJob,
    addEmployer,
    updateEmployer,
    deleteEmployer,
  } = useJobData();
  /**
   * State for controlling the visibility of the job/employer form dialog.
   * @type {boolean}
   */
  const [open, setOpen] = useState(false);
  /**
   * State for controlling the visibility of the job details dialog.
   * @type {boolean}
   */
  const [openDetails, setOpenDetails] = useState(false);
  /**
   * State for the currently selected job to be edited or viewed.
   * @type {IJob | undefined}
   */
  const [selectedJob, setSelectedJob] = useState<IJob | undefined>(undefined);
  /**
   * State for the currently selected employer to be edited.
   * @type {IEmployer | undefined}
   */
  const [selectedEmployer, setSelectedEmployer] = useState<
    IEmployer | undefined
  >(undefined);
  /**
   * State for the currently active tab (0 for Jobs, 1 for Employers).
   * @type {number}
   */
  const [currentTab, setCurrentTab] = useState(0); // 0 for Jobs, 1 for Employers
  const { userLocation } = useGeolocation();
  const { t } = useTranslation();

  // Pagination state for Jobs
  /**
   * Current page number for the jobs list.
   * @type {number}
   */
  const [jobsPage, setJobsPage] = useState(0);
  /**
   * Number of rows per page for the jobs list.
   * @type {number}
   */
  const [jobsRowsPerPage, setJobsRowsPerPage] = useState(10);

  // Pagination state for Employers
  /**
   * Current page number for the employers list.
   * @type {number}
   */
  const [employersPage, setEmployersPage] = useState(0);
  /**
   * Number of rows per page for the employers list.
   * @type {number}
   */
  const [employersRowsPerPage, setEmployersRowsPerPage] = useState(10);

  // State for filtering, sorting, and searching
  /**
   * Filter status for jobs.
   * @type {string}
   */
  const [filterStatus, setFilterStatus] = useState<string>("all");
  /**
   * Filter commute type for jobs.
   * @type {string}
   */
  const [filterCommute, setFilterCommute] = useState<string>("all");
  /**
   * Field to sort jobs by.
   * @type {keyof IJob | 'employerName'}
   */
  const [sortField, setSortField] = useState<keyof IJob | "employerName">(
    "title",
  );
  /**
   * Sort order for jobs.
   * @type {'asc' | 'desc'}
   */
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  /**
   * Search query for jobs.
   * @type {string}
   */
  const [searchQuery, setSearchQuery] = useState<string>("");

  /**
   * Logs current employer and job data to the console for debugging.
   */
  const handleLogData = () => {
    console.log("--- Current Employers Data ---");
    console.log(JSON.stringify(employers, null, 2));
    console.log("--- Current Jobs Data ---");
    console.log(JSON.stringify(jobs, null, 2));
  };

  /**
   * Opens the job form dialog, optionally pre-filling with job data for editing.
   * @param {IJob} [job] - The job object to edit. If undefined, a new job form is opened.
   */
  const handleOpenJobForm = (job?: IJob) => {
    setSelectedJob(job);
    setOpenDetails(false); // Close details dialog if open
    setOpen(true);
  };

  /**
   * Opens the employer form dialog, optionally pre-filling with employer data for editing.
   * @param {IEmployer} [employer] - The employer object to edit. If undefined, a new employer form is opened.
   */
  const handleOpenEmployerForm = (employer?: IEmployer) => {
    setSelectedEmployer(employer);
    setOpen(true); // Use the same dialog for job/employer forms
  };

  /**
   * Opens the job details dialog for a selected job.
   * @param {IJob} job - The job object to view details for.
   */
  const handleViewJobDetails = (job: IJob) => {
    setSelectedJob(job);
    setOpen(false); // Close edit/add dialog if open
    setOpenDetails(true);
  };

  /**
   * Closes all dialogs and resets selected job/employer states.
   */
  const handleCloseDialog = () => {
    setOpen(false);
    setOpenDetails(false);
    setSelectedJob(undefined);
    setSelectedEmployer(undefined);
  };

  /**
   * Handles submission of the job form. Adds a new job or updates an existing one.
   * @param {IJob} job - The job object to submit.
   */
  const handleSubmitJob = (job: IJob) => {
    if (job.id) {
      updateJob(job);
    } else {
      addJob(job);
    }
    handleCloseDialog();
  };

  /**
   * Handles submission of the employer form. Adds a new employer or updates an existing one.
   * @param {IEmployer} employer - The employer object to submit.
   */
  const handleSubmitEmployer = (employer: IEmployer) => {
    if (employer.id) {
      updateEmployer(employer);
    } else {
      addEmployer(employer);
    }
    handleCloseDialog();
  };

  /**
   * Handles deletion of an employer.
   * @param {string} id - The ID of the employer to delete.
   */
  const handleDeleteEmployer = (id: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this employer and all associated jobs?",
      )
    ) {
      deleteEmployer(id);
    }
  };

  /**
   * Handles tab changes.
   * @param {React.SyntheticEvent} _event - The event object.
   * @param {number} newValue - The new tab value (0 for Jobs, 1 for Employers).
   */
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
    // Reset pagination when switching tabs
    setJobsPage(0);
    setEmployersPage(0);
  };

  // Handlers for Jobs pagination
  /**
   * Handles page change for the jobs list.
   * @param {unknown} _event - The event object.
   * @param {number} newPage - The new page number.
   */
  const handleChangeJobsPage = (_event: unknown, newPage: number) => {
    setJobsPage(newPage);
  };

  /**
   * Handles rows per page change for the jobs list.
   * @param {React.ChangeEvent<HTMLInputElement>} event - The change event.
   */
  const handleChangeJobsRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setJobsRowsPerPage(parseInt(event.target.value, 10));
    setJobsPage(0);
  };

  // Handlers for Employers pagination
  /**
   * Handles page change for the employers list.
   * @param {unknown} _event - The event object.
   * @param {number} newPage - The new page number.
   */
  const handleChangeEmployersPage = (_event: unknown, newPage: number) => {
    setEmployersPage(newPage);
  };

  /**
   * Handles rows per page change for the employers list.
   * @param {React.ChangeEvent<HTMLInputElement>} event - The change event.
   */
  const handleChangeEmployersRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setEmployersRowsPerPage(parseInt(event.target.value, 10));
    setEmployersPage(0);
  };

  // Filtering, Sorting, and Searching Logic
  /**
   * Filters jobs based on status, commute, and search query.
   * @type {IJob[]}
   */
  const filteredJobs = jobs.filter((job: IJob) => {
    const employer = employers.find((emp) => emp.id === job.employerId);
    const matchesStatus = filterStatus === "all" || job.status === filterStatus;
    const matchesCommute =
      filterCommute === "all" || job.commute === filterCommute;
    const matchesSearch =
      searchQuery === "" ||
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (employer &&
        employer.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesCommute && matchesSearch;
  });

  /**
   * Sorts filtered jobs based on the selected sort field and order.
   * @type {IJob[]}
   */
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    let compareA: string | number = "";
    let compareB: string | number = "";

    if (sortField === "employerName") {
      compareA =
        employers.find((emp: IEmployer) => emp.id === a.employerId)?.name || "";
      compareB =
        employers.find((emp: IEmployer) => emp.id === b.employerId)?.name || "";
    } else if (sortField === "salary") {
      compareA = a.salary;
      compareB = b.salary;
    } else {
      compareA = a[sortField as keyof IJob] as string;
      compareB = b[sortField as keyof IJob] as string;
    }

    if (compareA < compareB) {
      return sortOrder === "asc" ? -1 : 1;
    }
    if (compareA > compareB) {
      return sortOrder === "asc" ? 1 : -1;
    }
    return 0;
  });

  return (
    <Layout>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        data-testid="app-title"
      >
        {t("app_title")}
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          aria-label="basic tabs example"
        >
          <Tab label={t("jobs")} />
          <Tab label={t("employers")} />
        </Tabs>
      </Box>

      {currentTab === 0 && (
        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpenJobForm()}
          >
            {t("add_job")}
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleLogData}
            sx={{ ml: 2 }}
          >
            {t("log_data_to_console")}
          </Button>

          <Box sx={{ mt: 2, display: "flex", gap: 2, flexWrap: "wrap" }}>
            <TextField
              label={t("search")}
              variant="outlined"
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchQuery(e.target.value)
              }
              sx={{ width: 200 }}
            />
            <FormControl sx={{ width: 150 }}>
              <InputLabel id="filter-status-label">
                {t("filter_status")}
              </InputLabel>
              <Select
                labelId="filter-status-label"
                value={filterStatus}
                label={t("filter_status")}
                onChange={(e) => setFilterStatus(e.target.value as string)}
              >
                <MenuItem value="all">{t("all_statuses")}</MenuItem>
                <MenuItem value="lead">{t("lead")}</MenuItem>
                <MenuItem value="applied">{t("applied")}</MenuItem>
                <MenuItem value="interview">{t("interview")}</MenuItem>
                <MenuItem value="offer">{t("offer")}</MenuItem>
                <MenuItem value="rejected">{t("rejected")}</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ width: 150 }}>
              <InputLabel id="filter-commute-label">
                {t("filter_commute")}
              </InputLabel>
              <Select
                labelId="filter-commute-label"
                value={filterCommute}
                label={t("filter_commute")}
                onChange={(e) => setFilterCommute(e.target.value as string)}
              >
                <MenuItem value="all">{t("all_commutes")}</MenuItem>
                <MenuItem value="remote">{t("remote")}</MenuItem>
                <MenuItem value="hybrid">{t("hybrid")}</MenuItem>
                <MenuItem value="on-site">{t("on_site")}</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ width: 150 }}>
              <InputLabel id="sort-by-label">{t("sort_by")}</InputLabel>
              <Select
                labelId="sort-by-label"
                value={sortField}
                label={t("sort_by")}
                onChange={(e) =>
                  setSortField(e.target.value as keyof IJob | "employerName")
                }
              >
                <MenuItem value="title">{t("title")}</MenuItem>
                <MenuItem value="employerName">{t("employer")}</MenuItem>
                <MenuItem value="salary">{t("salary")}</MenuItem>
                <MenuItem value="status">{t("status")}</MenuItem>
                <MenuItem value="commute">{t("commute")}</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ width: 150 }}>
              <InputLabel id="sort-order-label">{t("sort_order")}</InputLabel>
              <Select
                labelId="sort-order-label"
                value={sortOrder}
                label={t("sort_order")}
                onChange={(e: SelectChangeEvent) =>
                  setSortOrder(e.target.value as "asc" | "desc")
                }
              >
                <MenuItem value="asc">{t("ascending")}</MenuItem>
                <MenuItem value="desc">{t("descending")}</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <JobList
            jobs={sortedJobs.slice(
              jobsPage * jobsRowsPerPage,
              jobsPage * jobsRowsPerPage + jobsRowsPerPage,
            )}
            onEdit={handleOpenJobForm}
            onViewDetails={handleViewJobDetails}
            userLocation={userLocation}
            employers={employers}
            page={jobsPage}
            rowsPerPage={jobsRowsPerPage}
            onPageChange={handleChangeJobsPage}
            onRowsPerPageChange={handleChangeJobsRowsPerPage}
            count={sortedJobs.length}
          />
        </Box>
      )}

      {currentTab === 1 && (
        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpenEmployerForm()}
          >
            {t("add_employer")}
          </Button>
          <Suspense fallback={<div>Loading Employers...</div>}>
            <EmployerList
              employers={employers.slice(
                employersPage * employersRowsPerPage,
                employersPage * employersRowsPerPage + employersRowsPerPage,
              )}
              onEdit={handleOpenEmployerForm}
              onDelete={handleDeleteEmployer}
              page={employersPage}
              rowsPerPage={employersRowsPerPage}
              onPageChange={handleChangeEmployersPage}
              onRowsPerPageChange={handleChangeEmployersRowsPerPage}
              count={employers.length}
            />
          </Suspense>
        </Box>
      )}

      <Dialog
        open={open}
        onClose={handleCloseDialog}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          {selectedJob
            ? t("edit_job")
            : selectedEmployer
              ? t("edit_employer")
              : t("add_new")}
        </DialogTitle>
        <DialogContent>
          <Suspense fallback={<div>Loading Form...</div>}>
            {currentTab === 0 && (
              <JobForm
                job={selectedJob}
                onSubmit={handleSubmitJob}
                employers={employers}
              />
            )}
            {currentTab === 1 && (
              <EmployerForm
                employer={selectedEmployer}
                onSubmit={handleSubmitEmployer}
              />
            )}
          </Suspense>
        </DialogContent>
      </Dialog>

      <Dialog
        open={openDetails}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        aria-labelledby="details-dialog-title"
      >
        <DialogTitle id="details-dialog-title">{t("job_details")}</DialogTitle>
        <DialogContent>
          <Suspense fallback={<div>Loading Details...</div>}>
            {selectedJob && (
              <JobDetails job={selectedJob} employers={employers} />
            )}
          </Suspense>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}

export default App;
