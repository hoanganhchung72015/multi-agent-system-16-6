import React, { useEffect, useState } from 'react';
import { DiaryEntry } from '../types';
import { storage } from '../services/storage';

interface DiaryViewProps {
  onBack: () => void;
}

const DiaryView: React.FC<DiaryViewProps> = ({ onBack }) => {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);

  useEffect(() => {
    setEntries(storage ());
  }, []);

  return (
    <div className="w-full max-w-md flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-2xl">⬅️</button>
        <h2 className="text-xl font-black text-indigo-900">NHẬT KÝ HỌC TẬP</h2>
        <div className="w-8"></div>
      </div>

      {entries.length === 0 ? (
        <div className="text-center py-10 text-gray-400 italic">
          Chưa có bài giải nào được lưu.
        </div>
      ) : (
        entries.map((item) => (
          <div key={item.id} className="p-4 bg-white rounded-xl shadow-md border border-gray-100">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] bg-gray-100 px-2 py-1 rounded text-gray-500">
                {item.time}
              </span>
              <span className="text-xs font-bold text-indigo-600">
                {item.subject}
              </span>
            </div>
            <p className="text-sm font-bold text-gray-800 truncate">
              Đáp án: {item.result.expert1}
            </p>
            <button 
              className="mt-2 text-xs text-indigo-500 underline"
              onClick={() => alert("Xem chi tiết tính năng đang phát triển")}
            >
              Xem lại chi tiết
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default DiaryView;