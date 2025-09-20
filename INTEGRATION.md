# Frontend Integration with Backend API

This document describes how the frontend has been updated to connect to the live backend API.

## Backend URL
The frontend now connects to: `https://4fz7ztsn-8000.inc1.devtunnels.ms`

## Updated Components

### 1. API Service Layer (`src/services/api.ts`)
- Centralized API communication
- Handles all backend endpoints
- Type-safe response handling
- Error handling and fallback data

### 2. Personal Suggestions (`src/components/PersonalSuggestions.tsx`)
- Fetches student-specific suggestions from `/suggestions/{student_id}`
- Maps API subjects to detailed study recommendations
- Loading states and error handling
- Falls back to sample data on API failure

### 3. Attendance Table (`src/components/AttendanceTable.tsx`)
- Fetches all attendance data from `/getattendance/t`
- Displays real student attendance records
- Shows attendance statistics and ratios
- Real-time refresh capability

### 4. Teacher Dashboard (`src/pages/TeacherDashboard.tsx`)
- Integrates with attendance and suggestions APIs
- Real-time statistics calculation
- Dynamic charts based on live data
- Loading states for better UX

### 5. Student Score Management (`src/pages/StudentScoreEdit.tsx`)
- Fetches individual student scores from `/scores/{student_id}`
- Updates scores via `/enterscores` endpoint
- Real-time score validation
- Progress tracking and analytics

### 6. QR Code Generator (`src/components/QRCodeGenerator.tsx`)
- Generates QR codes for class attendance
- Handles student attendance marking via `/attendance/s`
- Teacher attendance via `/attendance/t`
- Real-time feedback on successful scans

### 7. Student Schedule (`src/components/StudentSchedule.tsx`)
- Fetches timetable from `/timetable/s/{student_id}`
- Shows current day's schedule
- Real-time class status updates
- Handles time formatting and status calculation

### 8. Attendance Status (`src/components/AttendanceStatus.tsx`)
- Shows individual student attendance from `/getattendance/{student_id}`
- Calculates attendance streaks and percentages
- Recent attendance history
- Visual status indicators

## API Endpoints Used

### Attendance
- `PUT /attendance/t` - Mark teacher attendance
- `PUT /attendance/s` - Mark student attendance  
- `GET /getattendance/t` - Get all attendance (teacher view)
- `GET /getattendance/{student_id}` - Get student attendance

### Suggestions
- `GET /suggestions/a` - Get all student suggestions (teacher view)
- `GET /suggestions/{student_id}` - Get student-specific suggestions

### Timetable
- `GET /timetable/s/{student_id}` - Get student timetable
- `GET /timetable/t/{teacher_id}` - Get teacher timetable

### Scores
- `GET /scores/t` - Get all scores (teacher view)
- `GET /scores/{student_id}` - Get student scores
- `PUT /enterscores` - Update student scores

## Error Handling
- All components have loading states
- Fallback to sample data if API fails
- User-friendly error messages
- Retry mechanisms where appropriate

## Data Flow
1. Components fetch data on mount using useEffect
2. API service handles HTTP requests and error handling
3. Loading states shown during fetch
4. Data displayed when available
5. Error states with fallback data if needed

## Configuration
- Backend URL configured in `src/services/api.ts`
- Default student/teacher IDs in `src/config/api.ts`
- Centralized API configuration for easy updates

## Testing
The integration includes:
- Mock data fallbacks for offline development
- Error boundary handling
- Loading state management
- Real-time data updates

## Future Enhancements
- WebSocket integration for real-time updates
- Offline data caching
- Enhanced error recovery
- Batch API operations for better performance
