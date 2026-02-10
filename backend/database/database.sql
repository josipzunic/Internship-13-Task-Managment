DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'task_priority_enum') THEN
        CREATE TYPE task_priority_enum AS ENUM ('low', 'mid', 'high');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'task_type_enum') THEN
        CREATE TYPE task_type_enum AS ENUM ('feature', 'bugfix', 'improvement');
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS "columns" (
    column_id SERIAL PRIMARY KEY,
    column_name VARCHAR(20) NOT NULL,
    column_position_order INT NOT NULL,
    column_created_at TIMESTAMP DEFAULT NOW(),
    column_updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    user_password VARCHAR(255) NOT NULL,
    user_created_at TIMESTAMP DEFAULT NOW(),
    user_updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tasks (
    task_id SERIAL PRIMARY KEY,
    column_id INT REFERENCES "columns"(column_id),
    user_id INT REFERENCES users(user_id),
    task_title VARCHAR(100) NOT NULL,
    task_description VARCHAR(500),
    task_start_date TIMESTAMP,
    task_end_date TIMESTAMP,
    task_estimated_duration INTERVAL,
    task_priority task_priority_enum,
    task_type task_type_enum,
    task_is_archived BOOLEAN DEFAULT FALSE,
    task_archived_at TIMESTAMP,
    task_created_at TIMESTAMP DEFAULT NOW(),
    task_updated_at TIMESTAMP DEFAULT NOW()
);
