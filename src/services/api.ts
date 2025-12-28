import { Subject, AIResult } from '../types';

// Lấy link Backend từ cấu hình Environment Variables của Vercel
const BASE_URL = import.meta.env.VITE_API_URL;

export const api = {
  solveProblem: async (subject: Subject, image?: string, voiceText?: string): Promise<AIResult> => {
    try {
      // Gọi chính xác vào đường dẫn /solve của Render
      const response = await fetch(`${BASE_URL}/solve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, image, voiceText }),
      });

      if (!response.ok) {
        throw new Error('Server Render đang bận hoặc lỗi');
      }

      return await response.json();
    } catch (error) {
      console.error("Lỗi kết nối AI:", error);
      throw error;
    }
  }
};
