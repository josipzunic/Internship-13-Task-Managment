DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'column_name_enum') THEN
        CREATE TYPE column_name_enum AS ENUM ('blocked', 'todo', 'in progress', 'in review', 'done');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'task_priority_enum') THEN
        CREATE TYPE task_priority_enum AS ENUM ('low', 'mid', 'high');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'task_type_enum') THEN
        CREATE TYPE task_type_enum AS ENUM ('feature', 'bugfix', 'improvement');
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS "columns" (
    column_id SERIAL PRIMARY KEY,
    column_name column_name_enum NOT NULL UNIQUE,
    column_position_order INT NOT NULL UNIQUE,
    column_created_at TIMESTAMP DEFAULT NOW(),
    column_updated_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT positive_position CHECK (column_position_order > 0)
);

CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    user_password VARCHAR(255) NOT NULL,
    user_created_at TIMESTAMP DEFAULT NOW(),
    user_updated_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT username_length CHECK(LENGTH(username) >= 5)
);

CREATE TABLE IF NOT EXISTS tasks (
    task_id SERIAL PRIMARY KEY,
    column_id INT NOT NULL REFERENCES "columns"(column_id) ON DELETE CASCADE,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    task_title VARCHAR(100) NOT NULL,
    task_description VARCHAR(500),
    task_start_date TIMESTAMP,
    task_end_date TIMESTAMP,
    task_estimated_duration INTERVAL,
    task_priority task_priority_enum NOT NULL,
    task_type task_type_enum NOT NULL, 
    task_is_archived BOOLEAN DEFAULT FALSE,
    task_archived_at TIMESTAMP DEFAULT NULL,
    task_created_at TIMESTAMP DEFAULT NOW(),
    task_updated_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT valid_date_range CHECK (task_end_date IS NULL OR task_start_date IS NULL OR task_end_date >= task_start_date),
    CONSTRAINT valid_archive_state CHECK (
        (task_is_archived = TRUE AND task_archived_at IS NOT NULL) OR
        (task_is_archived = FALSE AND task_archived_at IS NULL)
    ),
    CONSTRAINT positive_duration CHECK (task_estimated_duration IS NULL OR task_estimated_duration > INTERVAL '0')
);
