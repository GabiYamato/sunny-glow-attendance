// API configuration and service layer for backend communication
const API_BASE_URL = 'https://4fz7ztsn-8000.inc1.devtunnels.ms';

// Types based on backend response formats and actual DB schema
export interface Student {
  student_id: string; // S001, S002, etc.
  name: string;
  interests?: string;
  attendance_percent: number;
}

export interface Teacher {
  teacher_id: string; // T001, T002, etc.
  name: string;
  subject: string;
}

export interface Class {
  class_id: number;
  subject: string;
  teacher_id: string;
  date: string; // YYYY-MM-DD
  start_time: string; // HH:MM:SS
  end_time: string; // HH:MM:SS
  qr_code: string;
  status: string; // ongoing, completed, free
}

export interface AttendanceRecord {
  attendance_id: number;
  class_id: number;
  student_id: string | null; // null for teacher attendance
  present: boolean;
  teacher_present?: boolean;
  // Additional fields from joined queries
  subject?: string;
  date?: string;
  time?: string;
}

export interface Score {
  score_id: number;
  student_id: string;
  subject: string;
  marks: number;
}

export interface TimetableEntry {
  timetable_id: number;
  day_of_week: string; // Mon, Tue, Wed, etc.
  subject: string;
  teacher_id: string;
  teacher_name?: string; // Added from join query
  start_time: string; // HH:MM:SS
  end_time: string; // HH:MM:SS
}

export interface Suggestion {
  student_id: string;
  name: string;
  top_suggestions: string[];
}

export interface LoginCredentials {
  student_id?: string;  // Match backend field name
  email?: string;
  password: string;
}

export interface LoginResponse {
  status: string;
  message: string;
  student_id?: string;
  role?: string;
}

export interface ApiResponse<T> {
  status: string;
  [key: string]: any;
}

class ApiService {
  private async fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API call failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Authentication endpoints
  async loginStudent(credentials: LoginCredentials): Promise<LoginResponse> {
    return this.fetchApi<LoginResponse>('/login/student', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  // Teacher attendance endpoints
  async markTeacherAttendance(classId: number) {
    return this.fetchApi<ApiResponse<any>>('/attendance/t', {
      method: 'PUT',
      body: JSON.stringify({ class_id: classId }),
    });
  }

  // Student attendance endpoints
  async markStudentAttendance(classId: number, studentId: string) {
    return this.fetchApi<ApiResponse<any>>('/attendance/s', {
      method: 'PUT',
      body: JSON.stringify({ class_id: classId, student_id: studentId }),
    });
  }

  // Get all student suggestions (teacher view)
  async getAllSuggestions(): Promise<ApiResponse<{ students: Suggestion[] }>> {
    return this.fetchApi<ApiResponse<{ students: Suggestion[] }>>('/suggestions/a');
  }

  // Get student-specific suggestions
  async getStudentSuggestions(studentId: string): Promise<ApiResponse<{ top_suggestions: string[] }>> {
    return this.fetchApi<ApiResponse<{ top_suggestions: string[] }>>(`/suggestions/${studentId}`);
  }

  // Get student timetable
  async getStudentTimetable(studentId: string): Promise<ApiResponse<{ timetable: TimetableEntry[] }>> {
    return this.fetchApi<ApiResponse<{ timetable: TimetableEntry[] }>>(`/timetable/s/${studentId}`);
  }

  // Get teacher timetable
  async getTeacherTimetable(teacherId: string): Promise<ApiResponse<{ timetable: TimetableEntry[] }>> {
    return this.fetchApi<ApiResponse<{ timetable: TimetableEntry[] }>>(`/timetable/t/${teacherId}`);
  }

  // Get all scores (teacher view)
  async getAllScores(): Promise<ApiResponse<{ scores: Record<string, Record<string, number>> }>> {
    return this.fetchApi<ApiResponse<{ scores: Record<string, Record<string, number>> }>>('/scores/t');
  }

  // Get student scores
  async getStudentScores(studentId: string): Promise<ApiResponse<{ scores: Record<string, number> }>> {
    return this.fetchApi<ApiResponse<{ scores: Record<string, number> }>>(`/scores/${studentId}`);
  }

  // Enter scores
  async enterScores(studentId: string, scores: Record<string, number>) {
    return this.fetchApi<ApiResponse<any>>('/enterscores', {
      method: 'PUT',
      body: JSON.stringify({ student_id: studentId, scores }),
    });
  }

  // Get all attendance (teacher view)
  async getAllAttendance(): Promise<ApiResponse<{ attendance: Record<string, AttendanceRecord[]> }>> {
    return this.fetchApi<ApiResponse<{ attendance: Record<string, AttendanceRecord[]> }>>('/getattendance/t');
  }

  // Get student attendance
  async getStudentAttendance(studentId: string): Promise<ApiResponse<{ records: AttendanceRecord[] }>> {
    return this.fetchApi<ApiResponse<{ records: AttendanceRecord[] }>>(`/getattendance/${studentId}`);
  }
}

export const apiService = new ApiService();
