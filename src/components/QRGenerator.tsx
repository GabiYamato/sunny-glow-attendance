import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { QrCode, RefreshCw, Clock, Users, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiService, QRCodeResponse } from '@/services/api';

interface QRGeneratorProps {
  teacherId?: string;
  availableClasses?: Array<{
    class_id: number;
    subject: string;
    start_time: string;
    end_time: string;
  }>;
}

const QRGenerator: React.FC<QRGeneratorProps> = ({ 
  teacherId = "T001", 
  availableClasses = [
    { class_id: 1, subject: "Mathematics", start_time: "09:00", end_time: "10:00" },
    { class_id: 2, subject: "Physics", start_time: "10:00", end_time: "11:00" },
    { class_id: 3, subject: "Chemistry", start_time: "11:00", end_time: "12:00" }
  ]
}) => {
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [qrData, setQrData] = useState<QRCodeResponse | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const { toast } = useToast();

  // Countdown timer for QR expiry
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (qrData && qrData.expires_at) {
      interval = setInterval(() => {
        const now = Date.now() / 1000;
        const remaining = Math.max(0, qrData.expires_at - now);
        setTimeRemaining(remaining);
        
        if (remaining <= 0) {
          toast({
            title: "QR Code Expired",
            description: "Please generate a new QR code for attendance",
            variant: "destructive",
          });
          setQrData(null);
        }
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [qrData, toast]);

  const generateQR = async () => {
    if (!selectedClass) {
      toast({
        title: "No Class Selected",
        description: "Please select a class to generate QR code",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const response = await apiService.generateQRCode({
        class_id: selectedClass,
        teacher_id: teacherId
      });
      
      if (response.status === 'success') {
        setQrData(response);
        setTimeRemaining(300); // 5 minutes
        
        toast({
          title: "QR Code Generated! 🎯",
          description: `Students can now scan to mark attendance for ${response.subject}`,
        });
      } else {
        throw new Error('Failed to generate QR code');
      }
    } catch (error) {
      console.error('QR Generation error:', error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate QR code",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const refreshQR = () => {
    generateQR();
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const selectedClassInfo = availableClasses.find(c => c.class_id === selectedClass);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            Generate Attendance QR Code
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Class Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Class</label>
            <Select onValueChange={(value) => setSelectedClass(parseInt(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a class to generate QR code" />
              </SelectTrigger>
              <SelectContent>
                {availableClasses.map((classItem) => (
                  <SelectItem key={classItem.class_id} value={classItem.class_id.toString()}>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      <span>{classItem.subject}</span>
                      <span className="text-muted-foreground">
                        ({classItem.start_time} - {classItem.end_time})
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Selected Class Info */}
          {selectedClassInfo && (
            <div className="p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                <BookOpen className="h-4 w-4 text-primary" />
                <span className="font-medium">{selectedClassInfo.subject}</span>
                <span className="text-muted-foreground">
                  • {selectedClassInfo.start_time} - {selectedClassInfo.end_time}
                </span>
              </div>
            </div>
          )}

          {/* Generate Button */}
          <Button 
            onClick={generateQR}
            disabled={!selectedClass || isGenerating}
            className="w-full"
            size="lg"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Generating QR Code...
              </>
            ) : (
              <>
                <QrCode className="h-4 w-4 mr-2" />
                Generate QR Code
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* QR Code Display */}
      {qrData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Active QR Code - {qrData.subject}
              </span>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4" />
                <span className={timeRemaining < 60 ? "text-red-500" : "text-green-500"}>
                  {formatTime(timeRemaining)}
                </span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* QR Code Image */}
            <div className="flex justify-center">
              <div className="p-4 bg-white rounded-lg border-2 border-dashed border-primary">
                <img 
                  src={`data:image/png;base64,${qrData.qr_code}`}
                  alt="Attendance QR Code"
                  className="w-64 h-64 object-contain"
                />
              </div>
            </div>

            {/* QR Info */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Class:</span>
                <p className="font-medium">{qrData.subject}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Teacher:</span>
                <p className="font-medium">{qrData.teacher_name}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Class ID:</span>
                <p className="font-medium">{qrData.class_id}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Status:</span>
                <p className={`font-medium ${timeRemaining > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {timeRemaining > 0 ? 'Active' : 'Expired'}
                </p>
              </div>
            </div>

            {/* Refresh Button */}
            <div className="flex gap-2">
              <Button 
                onClick={refreshQR}
                variant="outline"
                className="flex-1"
                disabled={isGenerating}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh QR Code
              </Button>
            </div>

            {/* Instructions */}
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Instructions for Students:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Open the attendance app and log in</li>
                <li>• Navigate to QR Scanner</li>
                <li>• Point camera at this QR code</li>
                <li>• Attendance will be marked automatically</li>
                <li>• QR code expires in 5 minutes</li>
              </ul>
            </div>

            {/* Warning for expiry */}
            {timeRemaining < 60 && timeRemaining > 0 && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-amber-800 text-sm font-medium">
                  ⚠️ QR code will expire in less than 1 minute!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QRGenerator;
