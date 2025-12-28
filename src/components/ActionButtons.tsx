import React, { useState, useEffect } from 'react';

interface ActionButtonsProps {
  onCapture: (image: string) => void;
  onVoice: (text: string) => void;
  onSubmit: () => void;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isProcessing: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onCapture, onVoice, onSubmit, onUpload, isProcessing }) => {
  const [countdown, setCountdown] = useState<number | null>(null);

  // Logic Nút 1: Tự động chụp sau 10 giây
  const startCameraTimer = () => {
    setCountdown(10);
  };

  useEffect(() => {
    if (countdown === null) return;
    if (countdown === 0) {
      // Gọi hàm chụp ảnh ở đây (sẽ chi tiết ở phần CameraScanner)
      onCapture("data:image/png;base64,..."); 
      setCountdown(null);
      return;
    }
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  return (
    <div className="flex flex-col gap-4 p-4 bg-white rounded-xl shadow-lg">
      <div className="grid grid-cols-3 gap-2">
        {/* Nút 1: Camera */}
        <button 
          onClick={startCameraTimer}
          className="flex flex-col items-center p-3 bg-blue-100 rounded-lg active:scale-95 transition"
        >
          <span className="text-2xl">📸</span>
          <span className="text-xs mt-1 font-bold">
            {countdown !== null ? `Chụp sau ${countdown}s` : "Camera 10s"}
          </span>
        </button>

        {/* Nút 2: Upload */}
        <label className="flex flex-col items-center p-3 bg-green-100 rounded-lg cursor-pointer active:scale-95 transition">
          <span className="text-2xl">📁</span>
          <span className="text-xs mt-1 font-bold">Tải ảnh</span>
          <input type="file" className="hidden" onChange={onUpload} accept="image/*" />
        </label>

        {/* Nút 3: Voice */}
        <button 
          onClick={() => onVoice("Đang nghe...")}
          className="flex flex-col items-center p-3 bg-purple-100 rounded-lg active:scale-95 transition"
        >
          <span className="text-2xl">🎤</span>
          <span className="text-xs mt-1 font-bold">Giọng nói</span>
        </button>
      </div>

      {/* Nút 4: Submit (Đồng ý gửi) */}
      <button 
        onClick={onSubmit}
        disabled={isProcessing}
        className={`w-full py-4 rounded-lg font-bold text-white shadow-md transition
          ${isProcessing ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95'}`}
      >
        {isProcessing ? "ĐANG GIẢI BÀI..." : "🚀 ĐỒNG Ý GỬI"}
      </button>
    </div>
  );
};

export default ActionButtons;