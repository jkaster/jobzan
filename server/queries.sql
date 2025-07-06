-- This query calculates the average salary for each combination of job title and commute type.
-- It uses a pivot table to display the results with job titles as rows and commute types as columns.

SELECT
  title,
  ROUND(COALESCE(AVG(CASE WHEN commute = 'remote' THEN salary END), 0), 2) AS "Remote",
  ROUND(COALESCE(AVG(CASE WHEN commute = 'hybrid' THEN salary END), 0), 2) AS "Hybrid",
  ROUND(COALESCE(AVG(CASE WHEN commute = 'on-site' THEN salary END), 0), 2) AS "On-Site",
  ROUND(COALESCE(AVG(salary), 0), 2) AS "Overall Average"
FROM jobs
GROUP BY title
ORDER BY title;

-- This function dynamically creates a pivot table for average salaries
-- based on all existing commute types in the 'jobs' table.

CREATE OR REPLACE FUNCTION get_average_salary_pivot()
RETURNS TABLE(title TEXT, "Remote" NUMERIC, "Hybrid" NUMERIC, "On-Site" NUMERIC, "Overall Average" NUMERIC) AS $$
DECLARE
    dynamic_columns TEXT;
    final_query TEXT;
BEGIN
    -- Step 1: Build the dynamic part of the query.
    -- For each distinct commute type, create a column definition string.
    SELECT
        string_agg(
            format(
                'ROUND(COALESCE(AVG(CASE WHEN commute = %L THEN salary END), 0), 2) AS %I',
                commute,
                commute
            ),
            ', '
        )
    INTO
        dynamic_columns
    FROM
        (SELECT DISTINCT commute FROM jobs ORDER BY commute) AS commutes;

    -- Step 2: Construct the final query string using the dynamic columns.
    final_query := format('
        SELECT
            title,
            %s,
            ROUND(COALESCE(AVG(salary), 0), 2) AS "Overall Average"
        FROM
            jobs
        GROUP BY
            title
        ORDER BY
            title;',
        dynamic_columns
    );

    -- Optional: You can use RAISE NOTICE to print and debug the generated query.
    -- RAISE NOTICE '%', final_query;

    -- Step 3: Execute the dynamically generated query.
    RETURN QUERY EXECUTE final_query;
END;
$$ LANGUAGE plpgsql;

-- To use the function, you would simply call it like this:
-- SELECT * FROM get_average_salary_pivot();