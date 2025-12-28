import { DiaryEntry, AIResult, Subject } from '../types';

const DIARY_KEY = 'symbio_ai_diary';

export const storage = {
  // Lưu một bản ghi mới vào nhật ký
  save: (subject: Subject, result: AIResult) => {
    const history = storage.getDiary();
    
    const newEntry: DiaryEntry = {
      id: Date.now().toString(), // Dùng timestamp làm ID duy nhất
      time: new Date().toLocaleString('vi-VN'), // Thời gian thực Việt Nam
      subject: subject,
      result: result
    };

    // Thêm vào đầu danh sách (để bài mới nhất hiện lên trên cùng)
    const updatedHistory = [newEntry, ...history];
    
    // Lưu lại vào LocalStorage (giới hạn khoảng 50 bài để tránh nặng máy)
    localStorage.setItem(DIARY_KEY, JSON.stringify(updatedHistory.slice(0, 50)));
    return newEntry;
  },

  // Lấy toàn bộ danh sách nhật ký
  getDiary: (): DiaryEntry[] => {
    const data = localStorage.getItem(DIARY_KEY);
    return data ? JSON.parse(data) : [];
  },

  // Xóa nhật ký nếu cần
  clear: () => {
    localStorage.removeItem(DIARY_KEY);
  }
};