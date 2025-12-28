import React from 'react';
import { AIResult } from '../types';

interface ResultViewProps {
  result: AIResult;
  onBack: () => void;
}

const ResultView: React.FC<ResultViewProps> = ({ result, onBack }) => {
  return (
    <div className="w-full max-w-md flex flex-col gap-4 animate-fade-in">
      <button onClick={onBack} className="text-left text-indigo-600 font-bold mb-2">
        ⬅️ Giải bài khác
      </button>

      {/* Chuyên gia 1: Đáp án */}
      <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg shadow-sm">
        <h3 className="text-blue-700 font-black flex items-center gap-2">
          🎯 CHUYÊN GIA ĐÁP ÁN
        </h3>
        <p className="mt-2 text-lg font-semibold text-gray-800">{result.expert1}</p>
      </div>

      {/* Chuyên gia 2: Giải thích */}
      <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg shadow-sm">
        <h3 className="text-green-700 font-black flex items-center gap-2">
          🧠 CHUYÊN GIA GIẢI THÍCH
        </h3>
        <div className="mt-2 text-gray-700 leading-relaxed whitespace-pre-wrap">
          {result.expert2}
        </div>
      </div>

      {/* Chuyên gia 3: Tương tự */}
      <div className="p-4 bg-purple-50 border-l-4 border-purple-500 rounded-r-lg shadow-sm">
        <h3 className="text-purple-700 font-black flex items-center gap-2">
          📚 BÀI TẬP TƯƠNG TỰ
        </h3>
        <div className="mt-2 text-sm text-gray-600 italic">
          {result.expert3}
        </div>
      </div>
    </div>
  );
};

export default ResultView;