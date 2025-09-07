import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QrCode, RefreshCw, Download } from 'lucide-react';

const QRCodeGenerator = () => {
  const [qrCode, setQrCode] = useState('https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=AttendanceClass2024');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateNewCode = () => {
    setIsGenerating(true);
    // Simulate QR code generation
    setTimeout(() => {
      const timestamp = new Date().toISOString();
      setQrCode(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=AttendanceClass${timestamp}`);
      setIsGenerating(false);
    }, 1000);
  };

  const downloadQR = () => {
    const link = document.createElement('a');
    link.href = qrCode;
    link.download = 'attendance-qr.png';
    link.click();
  };

  return (
    <Card className="bg-gradient-glow border-primary/20 shadow-warm">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <QrCode className="h-5 w-5 text-primary" />
          <span>Attendance QR Code</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <div className="bg-white p-4 rounded-lg inline-block shadow-card">
          <img 
            src={qrCode} 
            alt="Attendance QR Code" 
            className="w-48 h-48 mx-auto"
          />
        </div>
        
        <p className="text-sm text-muted-foreground">
          Students scan this code to mark attendance
        </p>
        
        <div className="flex gap-2 justify-center">
          <Button 
            onClick={generateNewCode} 
            disabled={isGenerating}
            variant="outline"
            className="hover:shadow-warm transition-all"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
            {isGenerating ? 'Generating...' : 'New Code'}
          </Button>
          
          <Button 
            onClick={downloadQR}
            className="bg-gradient-sunny hover:shadow-warm transition-all"
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QRCodeGenerator;