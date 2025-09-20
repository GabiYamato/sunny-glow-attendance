import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QrCode, Camera, X, CheckCircle, User } from 'lucide-react';
import BarcodeScannerComponent from 'react-qr-barcode-scanner';

const StudentQRScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState<string>('');
  const [lastScanTime, setLastScanTime] = useState<string>('');
  const [attendanceMarked, setAttendanceMarked] = useState(false);

  const handleScan = (result: string) => {
    if (result) {
      setScannedData(result);
      setLastScanTime(new Date().toLocaleString());
      setIsScanning(false);
      setAttendanceMarked(true);
      
      // Here you can add logic to process the scanned attendance data
      console.log('Student scanned QR Code:', result);
      
      // TODO: Send scanned data to backend for student attendance marking
      // Example: markStudentAttendance(result);
    }
  };

  const handleError = (error: any) => {
    console.error('Student QR Scanner Error:', error);
  };

  const startScanning = () => {
    setIsScanning(true);
    setScannedData('');
    setAttendanceMarked(false);
  };

  const stopScanning = () => {
    setIsScanning(false);
  };

  return (
    <Card className="bg-gradient-glow border-primary/20 shadow-warm">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <User className="h-5 w-5 text-primary" />
          <span>Mark Attendance</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        {!isScanning ? (
          <>
            <div className="bg-white p-8 rounded-lg inline-block shadow-card border-2 border-dashed border-primary/30">
              <QrCode className="w-20 h-20 mx-auto text-primary/60 mb-4" />
              <p className="text-gray-600 font-medium">Scan class QR code to mark attendance</p>
            </div>
            
            {attendanceMarked && scannedData && (
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center justify-center space-x-2 text-green-700 mb-2">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-semibold">Attendance Marked Successfully!</span>
                </div>
                <p className="text-sm text-green-600">
                  Marked at: {lastScanTime}
                </p>
                <p className="text-xs text-green-500 mt-2">
                  ✓ You have been marked present for this class
                </p>
              </div>
            )}
            
            <p className="text-sm text-muted-foreground">
              {attendanceMarked 
                ? "You can scan again if needed for other classes" 
                : "Point your camera at the teacher's QR code"
              }
            </p>
            
            <Button 
              onClick={startScanning}
              className="bg-primary hover:bg-primary/90 text-white shadow-professional transition-all"
            >
              <Camera className="h-4 w-4 mr-2" />
              {attendanceMarked ? 'Scan Again' : 'Scan QR Code'}
            </Button>
          </>
        ) : (
          <div className="space-y-4">
            <div className="relative bg-black rounded-lg overflow-hidden">
              <BarcodeScannerComponent
                width={300}
                height={300}
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
            <p className="text-sm text-muted-foreground animate-pulse">
              📱 Point camera at QR code to mark attendance
            </p>
            <Button 
              onClick={stopScanning}
              variant="outline"
              className="hover:shadow-warm transition-all"
            >
              Cancel Scanning
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StudentQRScanner;