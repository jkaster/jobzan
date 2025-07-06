-- Create the employers table if it doesn't exist
CREATE TABLE IF NOT EXISTS employers (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    latitude NUMERIC(10, 6),
    longitude NUMERIC(10, 6),
    contact_name VARCHAR(255),
    contact_phone VARCHAR(255),
    contact_email VARCHAR(255),
    website VARCHAR(255)
);

-- Create the jobs table if it doesn't exist
CREATE TABLE IF NOT EXISTS jobs (
    id VARCHAR(255) PRIMARY KEY,
    employer_id VARCHAR(255) NOT NULL REFERENCES employers(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    salary INTEGER,
    status VARCHAR(50) NOT NULL,
    commute VARCHAR(50) NOT NULL,
    description TEXT,
    notes TEXT,
    job_description_link VARCHAR(255)
);

-- Add columns to the employers table if they don't exist
ALTER TABLE employers
ADD COLUMN IF NOT EXISTS name VARCHAR(255) NOT NULL,
ADD COLUMN IF NOT EXISTS latitude NUMERIC(10, 6),
ADD COLUMN IF NOT EXISTS longitude NUMERIC(10, 6),
ADD COLUMN IF NOT EXISTS contact_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS contact_phone VARCHAR(255),
ADD COLUMN IF NOT EXISTS contact_email VARCHAR(255),
ADD COLUMN IF NOT EXISTS website VARCHAR(255);

-- Add columns to the jobs table if they don't exist
ALTER TABLE jobs
ADD COLUMN IF NOT EXISTS employer_id VARCHAR(255) NOT NULL REFERENCES employers(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS title VARCHAR(255) NOT NULL,
ADD COLUMN IF NOT EXISTS salary INTEGER,
ADD COLUMN IF NOT EXISTS status VARCHAR(50) NOT NULL,
ADD COLUMN IF NOT EXISTS commute VARCHAR(50) NOT NULL,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS notes TEXT,
ADD COLUMN IF NOT EXISTS job_description_link VARCHAR(255);

-- Create indexes for the employers table
CREATE INDEX IF NOT EXISTS idx_employers_name ON employers(name);

-- Create indexes for the jobs table
CREATE INDEX IF NOT EXISTS idx_jobs_employer_id ON jobs(employer_id);
CREATE INDEX IF NOT EXISTS idx_jobs_title ON jobs(title);
CREATE INDEX IF NOT EXISTS idx_jobs_commute ON jobs(commute);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);