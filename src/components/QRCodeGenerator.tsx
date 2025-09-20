import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QrCode, Camera, X, CheckCircle, RefreshCw, Clock } from 'lucide-react';
import BarcodeScannerComponent from 'react-qr-barcode-scanner';
import { apiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

const QRCodeGenerator = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState<string>('');
  const [lastScanTime, setLastScanTime] = useState<string>('');
  const [qrCode, setQrCode] = useState<string>('');
  const [currentClassId, setCurrentClassId] = useState<number>(1);
  const { toast } = useToast();

  // Generate QR code data for the current class
  useEffect(() => {
    const generateQRCode = () => {
      const classData = {
        classId: currentClassId,
        timestamp: new Date().toISOString(),
        action: 'mark_attendance'
      };
      setQrCode(JSON.stringify(classData));
    };

    generateQRCode();
  }, [currentClassId]);

  const handleScan = async (result: string) => {
    if (result) {
      try {
        // Try to parse the scanned data
        const scannedInfo = JSON.parse(result);
        
        if (scannedInfo.studentId) {
          // This is a student scanning their QR code for attendance
          const response = await apiService.markStudentAttendance(currentClassId, scannedInfo.studentId);
          
          if (response.status === 'success') {
            setScannedData(result);
            setLastScanTime(new Date().toLocaleString());
            setIsScanning(false);
            
            toast({
              title: "Attendance Marked",
              description: `Student ${scannedInfo.studentId} marked present`,
            });
          }
        } else {
          // Handle other types of QR codes
          setScannedData(result);
          setLastScanTime(new Date().toLocaleString());
          setIsScanning(false);
          
          toast({
            title: "QR Code Scanned",
            description: "QR code data received",
          });
        }
      } catch (error) {
        // If not JSON, treat as plain text
        setScannedData(result);
        setLastScanTime(new Date().toLocaleString());
        setIsScanning(false);
        
        toast({
          title: "QR Code Scanned",
          description: "Raw data received",
        });
      }
    }
  };

  const handleError = (error: any) => {
    console.error('QR Scanner Error:', error);
    toast({
      title: "Scanner Error",
      description: "Failed to scan QR code",
      variant: "destructive",
    });
  };

  const startScanning = () => {
    setIsScanning(true);
    setScannedData('');
  };

  const stopScanning = () => {
    setIsScanning(false);
  };

  const markTeacherPresent = async () => {
    try {
      const response = await apiService.markTeacherAttendance(currentClassId);
      if (response.status === 'success') {
        toast({
          title: "Teacher Attendance Marked",
          description: "Your attendance has been marked successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark teacher attendance",
        variant: "destructive",
      });
    }
  };

  const generateNewQR = () => {
    const newClassId = currentClassId + 1;
    setCurrentClassId(newClassId);
    toast({
      title: "QR Code Updated",
      description: `Generated new QR code for class ${newClassId}`,
    });
  };

  // Generate QR code as data URL for display
  const generateQRCodeDataUrl = (data: string) => {
    // In a real implementation, you'd use a QR code library like 'qrcode'
    // For now, we'll show the data as text
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="white"/><text x="100" y="100" text-anchor="middle" font-family="monospace" font-size="10" fill="black">QR: Class ${currentClassId}</text></svg>`;
  };

  return (
    <Card className="bg-professional-card border border-border/50 shadow-elevated">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <QrCode className="h-5 w-5 text-professional-accent" />
            <span>Class QR & Scanner</span>
          </div>
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Class {currentClassId}</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        {!isScanning ? (
          <>
            {/* QR Code Display */}
            <div className="bg-white p-4 rounded-lg shadow-card border">
              <img 
                src={generateQRCodeDataUrl(qrCode)} 
                alt="Class QR Code" 
                className="w-32 h-32 mx-auto mb-2"
              />
              <p className="text-xs text-gray-600">Students scan this QR code</p>
            </div>

            {/* Teacher Actions */}
            <div className="flex flex-col space-y-2">
              <Button 
                onClick={markTeacherPresent}
                variant="outline"
                size="sm"
                className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark Teacher Present
              </Button>
              
              <Button 
                onClick={generateNewQR}
                variant="outline"
                size="sm"
                className="hover:shadow-warm transition-all"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                New QR Code
              </Button>
            </div>
            
            {scannedData && (
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <div className="flex items-center justify-center space-x-2 text-green-700 mb-2">
                  <CheckCircle className="h-4 w-4" />
                  <span className="font-medium text-sm">Last Scan</span>
                </div>
                <p className="text-xs text-green-600">{lastScanTime}</p>
              </div>
            )}
            
            <Button 
              onClick={startScanning}
              className="w-full bg-professional-accent hover:bg-professional-accent/90 text-white shadow-professional transition-all"
              size="sm"
            >
              <Camera className="h-4 w-4 mr-2" />
              Scan Student QR
            </Button>
          </>
        ) : (
          <div className="space-y-4">
            <div className="relative bg-black rounded-lg overflow-hidden">
              <BarcodeScannerComponent
                width={280}
                height={280}
                onUpdate={(err, result) => {
                  if (result) {
                    handleScan(result.getText());
                  } else if (err) {
                    handleError(err);
                  }
                }}
              />
              <Button
                onClick={stopScanning}
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Point camera at student's QR code
            </p>
            <Button 
              onClick={stopScanning}
              variant="outline"
              className="hover:shadow-warm transition-all"
              size="sm"
            >
              Stop Scanning
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QRCodeGenerator;