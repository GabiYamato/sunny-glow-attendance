import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Clock, BookOpen, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiService, QRValidationResponse } from '@/services/api';
import QRScanner from './QRScanner';

interface StudentQRAttendanceProps {
  studentId?: string;
  studentName?: string;
}

const StudentQRAttendance: React.FC<StudentQRAttendanceProps> = ({ 
  studentId = 'S001', 
  studentName = 'Student' 
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [attendanceResult, setAttendanceResult] = useState<QRValidationResponse | null>(null);
  const [scanHistory, setScanHistory] = useState<QRValidationResponse[]>([]);
  const { toast } = useToast();

  // Load scan history from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(`attendance_history_${studentId}`);
    if (stored) {
      try {
        setScanHistory(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to load scan history:', error);
      }
    }
  }, [studentId]);

  // Save scan history to localStorage
  const saveToHistory = (result: QRValidationResponse) => {
    const newHistory = [result, ...scanHistory.slice(0, 9)]; // Keep last 10 scans
    setScanHistory(newHistory);
    localStorage.setItem(`attendance_history_${studentId}`, JSON.stringify(newHistory));
  };

  const handleQRScanned = async (qrData: string) => {
    setIsScanning(false);
    
    try {
      const response = await apiService.validateQRCode({
        qr_data: qrData,
        student_id: studentId
      });
      
      setAttendanceResult(response);
      saveToHistory(response);
      
      if (response.status === 'success') {
        toast({
          title: "Attendance Marked! ✅",
          description: `Present for ${response.subject} class`,
        });
      } else if (response.status === 'already_marked') {
        toast({
          title: "Already Present ℹ️",
          description: response.message,
          variant: "default",
        });
      } else {
        toast({
          title: "Attendance Failed",
          description: response.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('QR Validation error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to mark attendance';
      
      toast({
        title: "Scanning Failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      setAttendanceResult({
        status: 'error',
        message: errorMessage,
        student_name: studentName
      });
    }
  };

  const startScanning = () => {
    setIsScanning(true);
    setAttendanceResult(null);
  };

  const stopScanning = () => {
    setIsScanning(false);
  };

  const formatDateTime = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'already_marked':
        return <Clock className="h-5 w-5 text-blue-500" />;
      default:
        return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'already_marked':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-red-200 bg-red-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Student Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Attendance Scanner
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Logged in as:</span>
            <span className="font-medium text-foreground">{studentName} ({studentId})</span>
          </div>
        </CardContent>
      </Card>

      {/* QR Scanner */}
      {isScanning ? (
        <div className="space-y-4">
          <QRScanner
            onQRScanned={handleQRScanned}
            expectedFormat="CLASS:"
            title="Scan Class QR Code"
            isActive={true}
          />
          
          <Button 
            onClick={stopScanning}
            variant="outline"
            className="w-full"
          >
            Cancel Scanning
          </Button>
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Ready to Mark Attendance</h3>
                <p className="text-muted-foreground">
                  Scan the QR code displayed by your teacher to mark your attendance
                </p>
              </div>
              <Button 
                onClick={startScanning}
                size="lg"
                className="w-full"
              >
                Start QR Scanner
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Attendance Result */}
      {attendanceResult && (
        <Card className={`border-2 ${getStatusColor(attendanceResult.status)}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getStatusIcon(attendanceResult.status)}
              Attendance Result
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="font-medium">{attendanceResult.message}</p>
            </div>
            
            {attendanceResult.subject && (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Subject:</span>
                  <p className="font-medium">{attendanceResult.subject}</p>
                </div>
                {attendanceResult.class_id && (
                  <div>
                    <span className="text-muted-foreground">Class ID:</span>
                    <p className="font-medium">{attendanceResult.class_id}</p>
                  </div>
                )}
              </div>
            )}
            
            {attendanceResult.marked_at && (
              <div className="text-xs text-muted-foreground">
                Marked at: {formatDateTime(attendanceResult.marked_at)}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Scan History */}
      {scanHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Attendance ({scanHistory.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {scanHistory.map((record, index) => (
                <div key={index} className={`p-3 rounded-lg border ${getStatusColor(record.status)}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(record.status)}
                      <div>
                        <p className="font-medium text-sm">
                          {record.subject || 'Unknown Subject'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {record.marked_at ? formatDateTime(record.marked_at) : 'Recently'}
                        </p>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {record.status === 'success' ? 'Present' : 
                       record.status === 'already_marked' ? 'Already Marked' : 'Failed'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">How to Use</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="text-sm text-muted-foreground space-y-2">
            <li>1. Wait for your teacher to display the class QR code</li>
            <li>2. Click "Start QR Scanner" button above</li>
            <li>3. Point your camera at the QR code</li>
            <li>4. Wait for automatic attendance marking</li>
            <li>5. Check the result message for confirmation</li>
          </ol>
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 <strong>Tip:</strong> QR codes expire after 5 minutes for security. 
              If scanning fails, ask your teacher to generate a new code.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentQRAttendance;
