const axios = require('axios');

const identityService = {
  translateFaces: async (recognitions) => {
    try {
      const springApiUrl = 'https://api-backend-spring-nhom5-chieut6.onrender.com/students';
      const response = await axios.get(springApiUrl);
      const allStudents = response.data;

      const translatedList = [];
      const unrecognizedFaces = []; 

      for (const face of recognitions) {
        const matchedStudent = allStudents.find(s => s.faceId === face.faceId);
        
        if (matchedStudent) {
          translatedList.push({
            studentCode: matchedStudent.studentCode,
            similarityScore: face.similarityScore
          });
        } else {
          unrecognizedFaces.push(face.faceId);
        }
      }

      return { translatedList, unrecognizedFaces };

    } catch (error) {
      throw { status: 502, message: 'Lỗi Gateway: Không thể kết nối với Spring Boot API để dịch mã khuôn mặt.' };
    }
  }
};

module.exports = identityService;