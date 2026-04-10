package com.example.nhom5thu6.service.impl;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.nhom5thu6.dto.response.RecognitionResponse;
import com.example.nhom5thu6.dto.response.RegistrationResponse;
import com.example.nhom5thu6.service.AiService;

import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.rekognition.RekognitionClient;
import software.amazon.awssdk.services.rekognition.model.*;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.ByteArrayInputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;

@Service
public class AiServiceImpl implements AiService {
    private final RekognitionClient rekognitionClient;
    private final S3Client s3Client;

    @Value("${aws.s3.bucket}")
    private String bucketName;
    @Value("${aws.rekognition.collection}")
    private String collectionId;

    public AiServiceImpl(RekognitionClient rekognitionClient, S3Client s3Client) {
        this.rekognitionClient = rekognitionClient;
        this.s3Client = s3Client;
    }

    @Override
    public RegistrationResponse registerFace(MultipartFile file) {
        try {

            String s3Key = "faces/" + UUID.randomUUID() + ".jpg";
            s3Client.putObject(PutObjectRequest.builder().bucket(bucketName).key(s3Key).build(),
                    RequestBody.fromBytes(file.getBytes()));

            String s3Url = "https://" + bucketName + ".s3.amazonaws.com/" + s3Key;

            IndexFacesRequest request = IndexFacesRequest.builder()
                    .collectionId(collectionId)
                    .image(Image.builder().bytes(software.amazon.awssdk.core.SdkBytes.fromByteArray(file.getBytes()))
                            .build())
                    .build();
            IndexFacesResponse response = rekognitionClient.indexFaces(request);

            String faceId = response.faceRecords().get(0).face().faceId();

            return new RegistrationResponse(faceId, s3Url);
        } catch (Exception e) {
            throw new RuntimeException("Lỗi AWS: " + e.getMessage());
        }
    }

    @Override
    public List<RecognitionResponse> detectFaces(MultipartFile file) {
        List<RecognitionResponse> allResults = new ArrayList<>();
        try {
            // 1. Chuyển file ảnh thành đối tượng BufferedImage để Java có thể cắt ảnh
            byte[] imageBytes = file.getBytes();
            BufferedImage originalImage = ImageIO.read(new ByteArrayInputStream(imageBytes));
            int width = originalImage.getWidth();
            int height = originalImage.getHeight();

            // 2. Gọi API DetectFaces để lấy tọa độ của TẤT CẢ khuôn mặt trong ảnh
            DetectFacesRequest detectRequest = DetectFacesRequest.builder()
                    .image(Image.builder().bytes(software.amazon.awssdk.core.SdkBytes.fromByteArray(imageBytes))
                            .build())
                    .build();
            DetectFacesResponse detectResponse = rekognitionClient.detectFaces(detectRequest);

            // 3. Vòng lặp bóc tách và cắt từng khuôn mặt
            for (FaceDetail faceDetail : detectResponse.faceDetails()) {
                BoundingBox box = faceDetail.boundingBox();

                // Tính toán pixel thực tế (AWS trả về tỷ lệ phần trăm 0.0 -> 1.0)
                int left = (int) (box.left() * width);
                int top = (int) (box.top() * height);
                int faceWidth = (int) (box.width() * width);
                int faceHeight = (int) (box.height() * height);

                // Mẹo nhỏ: Đảm bảo nhát cắt không bị tràn ra ngoài viền ảnh gây lỗi
                left = Math.max(0, left);
                top = Math.max(0, top);
                faceWidth = Math.min(width - left, faceWidth);
                faceHeight = Math.min(height - top, faceHeight);

                // Cắt ảnh mặt của sinh viên này ra
                BufferedImage croppedImage = originalImage.getSubimage(left, top, faceWidth, faceHeight);
                ByteArrayOutputStream baos = new ByteArrayOutputStream();
                ImageIO.write(croppedImage, "jpg", baos);
                byte[] croppedBytes = baos.toByteArray();

                // 4. Gửi riêng cái mặt vừa cắt cho Rekognition để truy tìm danh tính
                SearchFacesByImageRequest searchRequest = SearchFacesByImageRequest.builder()
                        .collectionId(collectionId)
                        .faceMatchThreshold(60F) // Chỉ lấy ai giống > 60%
                        .image(Image.builder().bytes(software.amazon.awssdk.core.SdkBytes.fromByteArray(croppedBytes))
                                .build())
                        .build();

                try {
                    SearchFacesByImageResponse searchResponse = rekognitionClient.searchFacesByImage(searchRequest);

                    // Nếu tìm thấy người khớp trong Database
                    if (!searchResponse.faceMatches().isEmpty()) {
                        FaceMatch match = searchResponse.faceMatches().get(0);
                        allResults.add(new RecognitionResponse(match.face().faceId(), match.similarity()));
                    }
                } catch (Exception e) {
                    // Bỏ qua âm thầm nếu cái mặt này bị mờ, nhòe hoặc không có trong hệ thống
                }
            }

            // Trả về danh sách cả lớp!
            return allResults;

        } catch (Exception e) {
            throw new RuntimeException("Lỗi nhận diện nhiều mặt: " + e.getMessage());
        }
    }

    @Override
    public String createFaceCollection() {
        try {
            CreateCollectionRequest request = CreateCollectionRequest.builder()
                    .collectionId(collectionId)
                    .build();
            CreateCollectionResponse response = rekognitionClient.createCollection(request);
            return "✅ Tuyệt vời! Đã tạo thành công Collection: " + collectionId + " (Status: " + response.statusCode()
                    + ")";
        } catch (software.amazon.awssdk.services.rekognition.model.ResourceAlreadyExistsException e) {
            return "⚠️ Collection này đã tồn tại rồi, bạn không cần tạo lại nữa nhé!";
        } catch (Exception e) {
            return "❌ Lỗi khi tạo: " + e.getMessage();
        }
    }
}
