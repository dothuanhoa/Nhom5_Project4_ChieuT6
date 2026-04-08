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

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AiServiceImpl implements AiService {
    private final RekognitionClient rekognitionClient;
    private final S3Client s3Client;
    
    @Value("${aws.s3.bucket}") private String bucketName;
    @Value("${aws.rekognition.collection}") private String collectionId;

    public AiServiceImpl(RekognitionClient rekognitionClient, S3Client s3Client) {
        this.rekognitionClient = rekognitionClient;
        this.s3Client = s3Client;
    }

    @Override
    public RegistrationResponse registerFace(MultipartFile file) {
        try {
            String s3Key = "faces/" + UUID.randomUUID() + "_" + file.getOriginalFilename();
            // Đẩy S3
            s3Client.putObject(PutObjectRequest.builder().bucket(bucketName).key(s3Key).build(),
                    RequestBody.fromBytes(file.getBytes()));
            
            // Đăng ký Rekognition
            IndexFacesRequest request = IndexFacesRequest.builder()
                    .collectionId(collectionId)
                    .image(Image.builder().s3Object(s -> s.bucket(bucketName).name(s3Key)).build())
                    .build();
            IndexFacesResponse response = rekognitionClient.indexFaces(request);
            
            String faceId = response.faceRecords().get(0).face().faceId();
            String s3Url = "https://" + bucketName + ".s3.amazonaws.com/" + s3Key;
            
            return new RegistrationResponse(faceId, s3Url);
        } catch (Exception e) { throw new RuntimeException("Lỗi AWS: " + e.getMessage()); }
    }

    @Override
    public List<RecognitionResponse> detectFaces(MultipartFile file) {
        try {
            SearchFacesByImageRequest request = SearchFacesByImageRequest.builder()
                    .collectionId(collectionId)
                    .faceMatchThreshold(60F) // Lọc độ tin cậy
                    .image(Image.builder().bytes(software.amazon.awssdk.core.SdkBytes.fromByteArray(file.getBytes())).build())
                    .build();

            SearchFacesByImageResponse response = rekognitionClient.searchFacesByImage(request);

            return response.faceMatches().stream()
                    .map(m -> new RecognitionResponse(m.face().faceId(), m.similarity()))
                    .collect(Collectors.toList());
        } catch (Exception e) { throw new RuntimeException("Lỗi nhận diện: " + e.getMessage()); }
    }
    @Override
    public String createFaceCollection() {
        try {
            CreateCollectionRequest request = CreateCollectionRequest.builder()
                    .collectionId(collectionId)
                    .build();
            CreateCollectionResponse response = rekognitionClient.createCollection(request);
            return "✅ Tuyệt vời! Đã tạo thành công Collection: " + collectionId + " (Status: " + response.statusCode() + ")";
        } catch (software.amazon.awssdk.services.rekognition.model.ResourceAlreadyExistsException e) {
            return "⚠️ Collection này đã tồn tại rồi, bạn không cần tạo lại nữa nhé!";
        } catch (Exception e) {
            return "❌ Lỗi khi tạo: " + e.getMessage();
        }
    }
}
