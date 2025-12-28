import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';

interface CameraScannerProps {
  onCapture: (image: string) => void;
  onClose: () => void;
}

const CameraScanner: React.FC<CameraScannerProps> = ({ onCapture, onClose }) => {
  const webcamRef = useRef<Webcam>(null);
  const [timer, setTimer] = useState(10);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          capture();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      onCapture(imageSrc);
      onClose(); // Đóng camera sau khi chụp xong
    }
  }, [webcamRef, onCapture, onClose]);

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center p-4">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border-4 border-indigo-500 shadow-2xl">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={{ facingMode: "environment" }} // Ưu tiên camera sau
          className="w-full h-full object-cover"
        />
        
        {/* Lớp phủ đếm ngược */}
        <div className="absolute top-4 right-4 bg-red-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-black text-xl animate-pulse">
          {timer}
        </div>

        <div className="absolute bottom-6 inset-x-0 flex justify-center">
          <p className="bg-black/50 text-white px-4 py-1 rounded-full text-sm">
            Tự động chụp sau {timer} giây...
          </p>
        </div>
      </div>
      
      <button 
        onClick={onClose}
        className="mt-8 text-white underline font-bold"
      >
        HỦY BỎ
      </button>
    </div>
  );
};

export default CameraScanner;