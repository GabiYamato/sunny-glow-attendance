// API Configuration
export const API_CONFIG = {
  BASE_URL: 'https://4fz7ztsn-8000.inc1.devtunnels.ms',
  ENDPOINTS: {
    // Attendance endpoints
    MARK_TEACHER_ATTENDANCE: '/attendance/t',
    MARK_STUDENT_ATTENDANCE: '/attendance/s',
    GET_ALL_ATTENDANCE: '/getattendance/t',
    GET_STUDENT_ATTENDANCE: '/getattendance',
    
    // Suggestions endpoints
    GET_ALL_SUGGESTIONS: '/suggestions/a',
    GET_STUDENT_SUGGESTIONS: '/suggestions',
    
    // Timetable endpoints
    GET_STUDENT_TIMETABLE: '/timetable/s',
    GET_TEACHER_TIMETABLE: '/timetable/t',
    
    // Scores endpoints
    GET_ALL_SCORES: '/scores/t',
    GET_STUDENT_SCORES: '/scores',
    ENTER_SCORES: '/enterscores',
  },
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  TIMEOUT: 10000, // 10 seconds
};

// Default student and teacher IDs based on actual database
export const DEFAULT_STUDENT_ID = 'S001'; // Changed from STU001 to match DB
export const DEFAULT_TEACHER_ID = 'T001'; // Changed from TEA001 to match DB
