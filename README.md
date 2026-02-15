# Internship-13-Task-Managment

TaskManagment is full-stack lightweight task organization application. The application 
allows users to manage tasks for individual or multi-person projects. 

## Key Features

- Task organisation into multiple columns according to task status
- Creating and assigning tasks to users as well as updating, deleting, and archiving tasks
- Click a task to view detailed information
- Drag-and-drop feature for moving tasks between status columns
- Light and dark mode for better user experience

## Technologies used

- **Frontend**: Vanilla JS, HTML, and CSS
- **Backend**: Node JS with PostgreSQL

## Usage

1. Clone or download the repository from GitHub
2. Inside a terminal (recommend using VS code and opening terminal using CTRL+J or Cmd+J on MacOS) run the following command to install all the dependencies
```
npm install

```
3. Set up backend. To do this, create a PostgreSQL database (in PgAdmin for example) and enter the database and server information into .env file using .env.example as a reference
4. After creating a database you will need to run the following command to create initial users and tasks (This will delete everything that was stored in the database and is only to be used when setting up the project for the first time)
```
npm run seed

``` 
5. Now enter the command which will start up the server. Keep the server open as long as
you are using the application
```
npm run start

```
6. To open frontend you can go to `http://localhost:PORT` in your browser


