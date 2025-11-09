# Health Community Hub

A full-stack web application that connects Patients, Doctors, and Admins for healthcare management.

## Features

### Patients
- User registration and login
- Search doctors by location (8 divisions of Bangladesh) and specialist
- Book appointments with doctors
- View appointment history

### Doctors
- Doctor registration and login
- Approve or cancel patient appointments
- View patient appointments
- Automatically added to patient search after registration

### Admin
- Manage all users and appointments
- View system statistics and analytics
- Access admin dashboard

## Technology Stack

- **Frontend**: React.js + Tailwind CSS
- **Backend**: Django + Django REST Framework
- **Database**: SQLite (development) / PostgreSQL (production)
- **Authentication**: JWT (JSON Web Tokens)
- **API Communication**: Axios

## Project Structure

```
health-community-hub/
├── backend/
│   ├── healthhub/          # Django project settings
│   ├── accounts/           # User management app
│   ├── appointments/       # Appointment management app
│   ├── manage.py
│   └── requirements.txt
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/      # React contexts
│   │   ├── pages/         # Page components
│   │   └── App.js
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

## Installation and Setup

### Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   ```

3. **Activate virtual environment**
   - Windows:
     ```bash
     venv\Scripts\activate
     ```
   - macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

4. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

5. **Run migrations**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

6. **Create superuser (optional)**
   ```bash
   python manage.py createsuperuser
   ```

7. **Start Django development server**
   ```bash
   python manage.py runserver
   ```

   The backend will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start React development server**
   ```bash
   npm start
   ```

   The frontend will be available at `http://localhost:3000`

## Running the Project

### Development Mode

#### Option 1: Single Command (Recommended)
```bash
npm run dev
```
This will start both backend and frontend servers simultaneously.

#### Option 2: Separate Terminals
1. **Start Backend Server**
   ```bash
   cd backend
   python manage.py runserver
   ```

2. **Start Frontend Server** (in a new terminal)
   ```bash
   cd frontend
   npm start
   ```

#### Option 3: Platform-Specific Scripts
- **Windows**: Double-click `run-dev.bat` or run `run-dev.bat` in terminal
- **macOS/Linux**: Run `chmod +x run-dev.sh && ./run-dev.sh`

3. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - Django Admin: http://localhost:8000/admin

### Production Deployment

1. **Build Frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Configure Django for Production**
   - Update `settings.py` with production database
   - Set `DEBUG = False`
   - Configure static files serving
   - Set up environment variables

3. **Deploy Backend**
   ```bash
   cd backend
   python manage.py collectstatic
   python manage.py migrate
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register/patient/` - Register patient
- `POST /api/auth/register/doctor/` - Register doctor
- `POST /api/auth/login/` - User login
- `GET /api/auth/profile/` - Get user profile
- `GET /api/auth/doctors/` - List doctors (with filters)
- `GET /api/auth/doctors/{id}/` - Get doctor details

### Appointments
- `GET /api/appointments/` - List appointments
- `POST /api/appointments/` - Create appointment
- `GET /api/appointments/{id}/` - Get appointment details
- `PATCH /api/appointments/{id}/update-status/` - Update appointment status
- `GET /api/appointments/my-appointments/` - Get user's appointments

## Database Models

### User
- `username`, `email`, `password`, `user_type` (patient/doctor/admin)
- `first_name`, `last_name`, `is_active`

### Doctor
- `user` (OneToOne), `specialist`, `location`
- `phone`, `experience_years`, `consultation_fee`, `bio`
- `is_available`, `created_at`

### Patient
- `user` (OneToOne), `phone`, `date_of_birth`
- `address`, `emergency_contact`, `created_at`

### Appointment
- `patient`, `doctor`, `status` (pending/approved/cancelled/completed)
- `appointment_date`, `appointment_time`, `reason`, `notes`
- `created_at`, `updated_at`

## Usage Guide

### For Patients

1. **Register**: Create an account as a patient
2. **Find Doctors**: Browse doctors by specialist and location
3. **Book Appointment**: Select date, time, and provide reason
4. **View Appointments**: Check appointment status and history

### For Doctors

1. **Register**: Create an account as a doctor with specialist information
2. **Manage Appointments**: Approve or cancel patient requests
3. **View Schedule**: See all upcoming appointments

### For Admins

1. **Access Admin Panel**: Use superuser credentials
2. **Manage Users**: View and manage all users
3. **Monitor System**: Check statistics and recent activity

## Development Notes

- The project uses JWT for authentication
- CORS is configured for frontend-backend communication
- SQLite is used for development (easily switchable to PostgreSQL)
- Tailwind CSS provides responsive design
- React Router handles client-side routing

## Future Enhancements

- Real-time notifications
- Video consultation features
- Health records management
- Payment integration
- Mobile app development
- Advanced analytics and reporting

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure Django CORS settings are configured
2. **Database Issues**: Run migrations if models are updated
3. **Authentication**: Check JWT token expiration and refresh
4. **Port Conflicts**: Ensure ports 3000 and 8000 are available

### Support

For issues and questions, please check the code comments or create an issue in the repository.

## License

This project is for educational purposes. Please ensure compliance with healthcare regulations in your jurisdiction.
