import { Subject, AIResult } from '../types';

/**
 * LẤY URL BACKEND:
 * Ưu tiên lấy từ biến môi trường Vercel (VITE_API_URL).
 * Nếu không có, sẽ dùng link Render mặc định của bạn.
 */
const BASE_URL = (import.meta as any).env?.VITE_API_URL || 'https://multi-agent-system-16-6-1.onrender.com';

export const api = {
  solveProblem: async (
    subject: Subject, 
    image?: string, 
    voiceText?: string
  ): Promise<AIResult> => {
    
    try {
      // QUAN TRỌNG: Phải thêm /solve vào sau URL gốc để gọi đúng hàm xử lý ở Backend
      const response = await fetch(`${BASE_URL}/solve`, {
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

      // Nếu server trả về lỗi (404, 500, v.v.)
      if (!response.ok) {
        let errorMessage = 'Các chuyên gia đang bận, vui lòng thử lại sau.';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // Trường hợp phản hồi không phải JSON (ví dụ lỗi HTML 404)
          console.error("Không thể đọc lỗi từ Server:", e);
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      // Trả về dữ liệu cho giao diện hiển thị
      return data as AIResult;
      
    } catch (error: any) {
      console.error("Lỗi API chi tiết:", error);
      // Ném lỗi ra để UI có thể bắt được và tắt trạng thái "Đang giải bài..."
      throw error;
    }
  }
};

