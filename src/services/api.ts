
import { Subject, AIResult } from '../types';

// Thay bằng URL thật của bạn trên Render sau khi bạn deploy backend
const RENDER_API_URL = 'https://giaibaitap-backend.onrender.com/';

export const api = {
  solveProblem: async (
    subject: Subject, 
    image?: string, 
    voiceText?: string
  ): Promise<AIResult> => {
    
    try {
      const response = await fetch(RENDER_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject,
          image,      // Dữ liệu ảnh Base64
          voiceText,  // Văn bản từ giọng nói (nếu có)
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Các chuyên gia đang thực hiện trao đổi');
      }

      const data = await response.json();
      
      // Giả sử server trả về đúng cấu trúc { expert1, expert2, expert3 }
      return data as AIResult;
      
    } catch (error) {
      console.error("Lỗi API:", error);
      throw error;
    }
  }
};