// // Namespace: VoVanSy_DH52201379
// const axios = require('axios');

// const identityService = {
//   verifyFromSpringBoot: async (faceData) => {
//     try {
//       // Gọi qua API Gateway của bạn
//       const gatewayUrl = 'https://nhom5-project4-chieut6-jy3r.onrender.com/api/spring/faces/translate';
      
//       const response = await axios.post(gatewayUrl, { faceData });
      
//       // Giả sử Spring Boot trả về object có trường studentCode
//       return response.data.studentCode; 
      
//     } catch (error) {
//       console.error('Lỗi khi gọi Gateway/Spring Boot:', error.message);
      
//       // Tạm thời fallback về mã hardcode để dự án không bị sập khi Spring Boot đang lỗi
//       return "DH52200988"; 
//     }
//   }
// };

// module.exports = identityService;