const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
// Tăng giới hạn dung lượng để nhận được ảnh chất lượng cao từ Camera
app.use(cors());
app.use(express.json({ limit: '20mb' })); 

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/solve', async (req, res) => {
  const { subject, image, voiceText } = req.body;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 1. Chuẩn bị nội dung gửi cho Gemini
    const prompt = `
      Bạn là một hệ thống gia sư AI đa chuyên gia cho môn ${subject}.
      Nhiệm vụ: Phân tích đề bài từ hình ảnh hoặc văn bản và trả về kết quả chính xác.
      
      YÊU CẦU ĐỊNH DẠNG TRẢ VỀ:
      Bạn PHẢI trả về một chuỗi JSON thuần túy (không kèm dấu nháy code block), có cấu trúc như sau:
      {
        "expert1": "Chỉ ghi đáp án cuối cùng. Ví dụ: x = 5 hoặc Đáp án C.",
        "expert2": "Giải thích chi tiết các bước giải bài toán này một cách dễ hiểu nhất.",
        "expert3": "Đưa ra 2 bài tập tương tự khác kèm lời giải cực ngắn gọn để học sinh luyện tập."
      }
      Lưu ý: Nếu có công thức toán học, hãy sử dụng định dạng LaTeX.
    `;

    const parts = [{ text: prompt }];

    // Nếu có ảnh từ Camera/Upload, đưa vào mảng gửi đi
    if (image) {
      const imageData = image.split(',')[1]; // Loại bỏ phần header của base64
      parts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: imageData
        }
      });
    }

    // Nếu có text từ giọng nói, bổ sung thêm vào prompt
    if (voiceText) {
      parts[0].text += `\nCâu hỏi bổ sung từ người dùng: ${voiceText}`;
    }

    // 2. Gọi Gemini AI
    const result = await model.generateContent(parts);
    const response = await result.response;
    let text = response.text();

    // 3. Xử lý chuỗi để đảm bảo là JSON sạch (phòng trường hợp AI trả về thừa ký tự)
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}') + 1;
    const jsonStr = text.substring(jsonStart, jsonEnd);

    res.json(JSON.parse(jsonStr));

  } catch (error) {
    console.error("Lỗi Server:", error);
    res.status(500).json({ message: "AI đang bận, vui lòng thử lại sau ít giây!" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend chạy tại port ${PORT}`));