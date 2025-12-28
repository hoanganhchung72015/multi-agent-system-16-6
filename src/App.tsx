import React, { useState } from 'react';
import { Subject, AIResult } from './types';
import ActionButtons from './components/ActionButtons';
import ResultView from './components/ResultView';
import DiaryView from './components/DiaryView';
import CameraScanner from './components/CameraScanner'; // File đã tạo ở bước trước
import VoiceRecorder from './components/VoiceRecorder'; // File đã tạo ở bước trước
import { api } from './services/api';
import { storage } from './services/storage';

const App: React.FC = () => {
  // 1. Quản lý chuyển đổi màn hình
  const [view, setView] = useState<'MENU' | 'SUBJECT' | 'DIARY' | 'RESULT'>('MENU');
  
  // 2. Quản lý trạng thái bật/tắt Camera và Voice
  const [showCam, setShowCam] = useState(false);
  const [showVoice, setShowVoice] = useState(false);

  // 3. Quản lý dữ liệu môn học và kết quả
  const [selectedSub, setSelectedSub] = useState<Subject | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [finalResult, setFinalResult] = useState<AIResult | null>(null);

  // 4. Lưu trữ dữ liệu tạm thời (Ảnh hoặc Text) từ 3 nút chức năng
  const [tempData, setTempData] = useState<{img?: string, text?: string}>({});

  const handleGoToSubject = (sub: Subject) => {
    setSelectedSub(sub);
    setTempData({}); // Reset dữ liệu khi đổi môn
    setView('SUBJECT');
  };

  // NÚT 4: Gửi dữ liệu tổng hợp sang Render
  const handleFinalSubmit = async () => {
    if (!tempData.img && !tempData.text) {
      alert("Vui lòng chụp ảnh hoặc nói gì đó trước khi gửi!");
      return;
    }

    setIsProcessing(true);
    try {
      const result = await api.solveProblem(
        selectedSub!, 
        tempData.img, 
        tempData.text
      );

      storage.save(selectedSub!, result);
      setFinalResult(result);
      setView('RESULT'); 

    } catch (e: any) {
      alert("Lỗi: " + (e.message || "Kết nối Render thất bại"));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4">
      <header className="mb-8 text-center pt-4">
        <h1 className="text-3xl font-black text-indigo-900 tracking-tighter">SYMBIO AI</h1>
        <p className="text-gray-500 text-xs uppercase tracking-widest">Hệ thống đa chuyên gia</p>
      </header>

      {/* --- MÀN HÌNH CHÍNH --- */}
      {view === 'MENU' && (
        <div className="grid grid-cols-2 gap-4 w-full max-w-md animate-in fade-in zoom-in">
          {(['MATH', 'PHYSICS', 'CHEMISTRY'] as Subject[]).map((sub) => (
            <button 
              key={sub}
              onClick={() => handleGoToSubject(sub)}
              className="h-32 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg active:scale-95 transition"
            >
              {sub === 'MATH' ? 'TOÁN HỌC' : sub === 'PHYSICS' ? 'VẬT LÝ' : 'HÓA HỌC'}
            </button>
          ))}
          <button 
            onClick={() => setView('DIARY')}
            className="h-32 bg-white border-2 border-indigo-600 text-indigo-600 rounded-2xl font-bold shadow-md active:scale-95 transition"
          >
            📒 NHẬT KÝ
          </button>
        </div>
      )}

      {/* --- MÀN HÌNH MÔN HỌC --- */}
      {view === 'SUBJECT' && (
        <div className="w-full max-w-md flex flex-col gap-6 animate-in slide-in-from-right">
          <div className="flex items-center gap-4">
            <button onClick={() => setView('MENU')} className="text-2xl p-2 bg-white rounded-full">⬅️</button>
            <h2 className="text-xl font-bold text-indigo-900">Môn: {selectedSub}</h2>
          </div>
          
          {/* Khu vực Preview dữ liệu */}
          <div className="aspect-video bg-white rounded-2xl flex items-center justify-center border-2 border-dashed border-indigo-200 overflow-hidden relative shadow-inner">
             {tempData.img ? (
               <img src={tempData.img} className="w-full h-full object-contain" />
             ) : (
               <div className="text-center p-6 text-gray-400">
                 {tempData.text ? (
                   <div className="p-4 bg-indigo-50 rounded-lg text-indigo-800 italic">
                     " {tempData.text} "
                   </div>
                 ) : "Đang chờ dữ liệu..."}
               </div>
             )}
             {/* Nút xóa nhanh dữ liệu cũ */}
             {(tempData.img || tempData.text) && (
               <button onClick={() => setTempData({})} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full text-xs">✕</button>
             )}
          </div>

          <ActionButtons 
            onCapture={() => setShowCam(true)} // Bật Camera Modal
            onVoice={() => setShowVoice(true)} // Bật Voice Modal
            onUpload={(e) => {
               const file = e.target.files?.[0];
               if (file) {
                 const reader = new FileReader();
                 reader.onloadend = () => setTempData({...tempData, img: reader.result as string});
                 reader.readAsDataURL(file);
               }
            }}
            onSubmit={handleFinalSubmit}
            isProcessing={isProcessing}
          />
        </div>
      )}

      {/* --- CÁC CỬA SỔ NỔI (MODALS) --- */}
      {showCam && (
        <CameraScanner 
          onCapture={(img) => setTempData({...tempData, img})} 
          onClose={() => setShowCam(false)} 
        />
      )}

      {showVoice && (
        <VoiceRecorder 
          onTranscript={(text) => setTempData({...tempData, text})} 
          onClose={() => setShowVoice(false)} 
        />
      )}

      {/* --- MÀN HÌNH KẾT QUẢ & NHẬT KÝ --- */}
      {view === 'RESULT' && finalResult && (
        <ResultView result={finalResult} onBack={() => setView('MENU')} />
      )}

      {view === 'DIARY' && (
        <DiaryView onBack={() => setView('MENU')} />
      )}
    </div>
  );
};

export default App;