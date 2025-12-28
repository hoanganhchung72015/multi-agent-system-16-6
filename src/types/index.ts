export type Subject = 'MATH' | 'PHYSICS' | 'CHEMISTRY';

export interface AIResult {
  expert1: string; // Đáp án
  expert2: string; // Giải thích
  expert3: string; // Bài tập tương tự
}

export interface DiaryEntry {
  id: string;
  time: string;
  subject: Subject;
  result: AIResult;
}