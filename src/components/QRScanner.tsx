import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Square, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Simple QR code detection using canvas
declare global {
  interface Window {
    BarcodeDetector?: any;
  }
}

interface QRScannerProps {
  onQRScanned: (data: string) => void;
  expectedFormat?: string; // e.g., "CLASS:" prefix
  title?: string;
  isActive?: boolean;
}

const QRScanner: React.FC<QRScannerProps> = ({ 
  onQRScanned, 
  expectedFormat = "CLASS:", 
  title = "QR Scanner",
  isActive = false 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>('');
  const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');
  const { toast } = useToast();

  // QR code detection using modern Barcode Detection API or fallback
  const detectQRCode = async (imageData: ImageData): Promise<string | null> => {
    try {
      // Try modern BarcodeDetector API if available
      if ('BarcodeDetector' in window) {
        const barcodeDetector = new window.BarcodeDetector({ formats: ['qr_code'] });
        const canvas = canvasRef.current;
        if (!canvas) return null;

        const results = await barcodeDetector.detect(canvas);
        if (results && results.length > 0) {
          return results[0].rawValue;
        }
      }
      
      // Fallback: Use a simple pattern detection (basic implementation)
      // In production, you'd use a library like jsQR
      return null;
    } catch (err) {
      console.error('QR detection error:', err);
      return null;
    }
  };

  // Load jsQR library dynamically for QR detection
  const loadJsQR = async () => {
    try {
      // Add jsQR script if not already loaded
      if (!window.jsQR) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js';
        script.onload = () => console.log('jsQR loaded');
        document.head.appendChild(script);
        
        // Wait for script to load
        return new Promise((resolve) => {
          script.onload = resolve;
        });
      }
    } catch (err) {
      console.error('Failed to load jsQR:', err);
    }
  };

  // Scan QR code from video frame
  const scanFrame = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (!video || !canvas || !isScanning) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw current video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    try {
      // Get image data for QR detection
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      
      // Try jsQR library if loaded
      if (window.jsQR) {
        const code = window.jsQR(imageData.data, imageData.width, imageData.height);
        if (code) {
          const qrData = code.data;
          
          // Validate QR format if expected format is provided
          if (expectedFormat && !qrData.startsWith(expectedFormat)) {
            setScanStatus('error');
            toast({
              title: "Invalid QR Code",
              description: `Expected format: ${expectedFormat}`,
              variant: "destructive",
            });
            return;
          }

          // Extract actual data (remove prefix)
          const actualData = expectedFormat ? qrData.replace(expectedFormat, '') : qrData;
          
          setScanStatus('success');
          toast({
            title: "QR Code Detected!",
            description: `Scanned: ${actualData}`,
          });
          
          stopScanning();
          onQRScanned(actualData);
          return;
        }
      }

      // Continue scanning if no QR code detected
      if (isScanning) {
        requestAnimationFrame(scanFrame);
      }
    } catch (err) {
      console.error('Frame scan error:', err);
    }
  };

  // Start camera and scanning
  const startScanning = async () => {
    try {
      setError('');
      setScanStatus('scanning');
      
      // Load jsQR library first
      await loadJsQR();

      // Request camera access
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Use back camera if available
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      });

      setStream(mediaStream);
      setIsScanning(true);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        
        // Wait for video to be ready
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current.play();
            // Start scanning frames
            setTimeout(scanFrame, 1000); // Give camera time to adjust
          }
        };
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setError('Failed to access camera. Please allow camera permissions.');
      setScanStatus('error');
      toast({
        title: "Camera Error",
        description: "Failed to access camera. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  // Stop scanning and camera
  const stopScanning = () => {
    setIsScanning(false);
    setScanStatus('idle');
    
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  // Auto-start if active prop is true
  useEffect(() => {
    if (isActive && !isScanning) {
      startScanning();
    } else if (!isActive && isScanning) {
      stopScanning();
    }
  }, [isActive]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Camera View */}
        <div className="relative">
          <video
            ref={videoRef}
            className="w-full h-64 bg-black rounded-lg object-cover"
            playsInline
            muted
            style={{ display: isScanning ? 'block' : 'none' }}
          />
          
          {/* Hidden canvas for QR detection */}
          <canvas
            ref={canvasRef}
            style={{ display: 'none' }}
          />

          {/* Scanning overlay */}
          {isScanning && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-48 h-48 border-2 border-primary border-dashed rounded-lg flex items-center justify-center animate-pulse">
                <Square className="h-8 w-8 text-primary" />
              </div>
            </div>
          )}

          {/* Placeholder when not scanning */}
          {!isScanning && (
            <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Camera will appear here</p>
              </div>
            </div>
          )}
        </div>

        {/* Status */}
        <div className="flex items-center justify-center gap-2 text-sm">
          {scanStatus === 'scanning' && (
            <>
              <RotateCcw className="h-4 w-4 animate-spin text-blue-500" />
              <span className="text-blue-500">Scanning for QR code...</span>
            </>
          )}
          {scanStatus === 'success' && (
            <>
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-green-500">QR code detected!</span>
            </>
          )}
          {scanStatus === 'error' && (
            <>
              <XCircle className="h-4 w-4 text-red-500" />
              <span className="text-red-500">Invalid QR code</span>
            </>
          )}
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Controls */}
        <div className="flex gap-2">
          {!isScanning ? (
            <Button 
              onClick={startScanning}
              className="flex-1"
              disabled={scanStatus === 'success'}
            >
              <Camera className="h-4 w-4 mr-2" />
              Start Scanning
            </Button>
          ) : (
            <Button 
              onClick={stopScanning}
              variant="outline"
              className="flex-1"
            >
              Stop Scanning
            </Button>
          )}
        </div>

        {/* Instructions */}
        <div className="text-xs text-muted-foreground text-center">
          <p>Point camera at QR code</p>
          <p>Expected format: {expectedFormat}...</p>
        </div>
      </CardContent>
    </Card>
  );
};

// Add jsQR type declaration
declare global {
  interface Window {
    jsQR: any;
  }
}

export default QRScanner;
