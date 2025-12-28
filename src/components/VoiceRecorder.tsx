import React, { useState, useEffect } from 'react';

interface VoiceRecorderProps {
  onTranscript: (text: string) => void;
  onClose: () => void;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onTranscript, onClose }) => {
  const [isListening, setIsListening] = useState(false);
  const [text, setText] = useState('');

  // Khởi tạo Speech Recognition
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  if (recognition) {
    recognition.lang = 'vi-VN'; // Đặt ngôn ngữ tiếng Việt
    recognition.continuous = false;
    recognition.interimResults = true;
  }

  const startListening = () => {
    if (!recognition) return alert("Trình duyệt của bạn không hỗ trợ giọng nói.");
    setIsListening(true);
    recognition.start();

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setText(transcript);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  };

  return (
    <div className="fixed inset-0 bg-indigo-900/90 z-50 flex flex-col items-center justify-center p-6 text-white">
      <div className="text-6xl mb-8 animate-bounce">🎤</div>
      
      <h2 className="text-2xl font-bold mb-4">
        {isListening ? "Đang lắng nghe..." : "Sẵn sàng ghi âm"}
      </h2>

      <div className="w-full max-w-sm bg-white/20 p-6 rounded-2xl mb-8 min-h-[100px] text-center italic">
        {text || "Hãy nói đề bài của bạn (ví dụ: Giải phương trình bậc 2...)"}
      </div>

      <div className="flex gap-4">
        {!isListening ? (
          <button 
            onClick={startListening}
            className="bg-red-500 px-8 py-3 rounded-full font-bold shadow-lg"
          >
            BẮT ĐẦU NÓI
          </button>
        ) : (
          <div className="flex gap-2">
            <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-white rounded-full animate-bounce [animation-delay:-.3s]"></div>
            <div className="w-3 h-3 bg-white rounded-full animate-bounce [animation-delay:-.5s]"></div>
          </div>
        )}
      </div>

      <button 
        onClick={() => {
          onTranscript(text);
          onClose();
        }}
        className="mt-12 bg-green-500 text-white px-10 py-4 rounded-xl font-black shadow-xl"
      >
        XÁC NHẬN VĂN BẢN
      </button>
      
      <button onClick={onClose} className="mt-4 opacity-50 underline">Đóng</button>
    </div>
  );
};

export default VoiceRecorder;