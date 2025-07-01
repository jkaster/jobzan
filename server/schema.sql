-- Create the employers table
CREATE TABLE employers (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    latitude NUMERIC(10, 6),
    longitude NUMERIC(10, 6),
    contact_name VARCHAR(255),
    contact_phone VARCHAR(255),
    contact_email VARCHAR(255),
    website VARCHAR(255)
);

-- Create the jobs table
CREATE TABLE jobs (
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