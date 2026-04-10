package com.banchan.upload.application;

import com.banchan.common.exception.FileUploadException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.time.LocalDate;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ImageUploadService {

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024;
    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif"
    );

    private final S3Client s3Client;

    @Value("${aws.s3.bucket-name}")
    private String bucketName;

    @Value("${aws.s3.region}")
    private String region;

    public String uploadProductImage(MultipartFile file) {
        validateFile(file);

        String key = buildObjectKey(file.getOriginalFilename());

        try {
            PutObjectRequest request = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .contentType(file.getContentType())
                    .build();

            s3Client.putObject(request, RequestBody.fromBytes(file.getBytes()));
            return String.format("https://%s.s3.%s.amazonaws.com/%s", bucketName, region, key);
        } catch (IOException e) {
            throw new FileUploadException("이미지 업로드 중 파일을 읽지 못했습니다.");
        } catch (Exception e) {
            throw new FileUploadException("S3 이미지 업로드에 실패했습니다.");
        }
    }

    private void validateFile(MultipartFile file) {
        if (bucketName == null || bucketName.isBlank()) {
            throw new FileUploadException("S3_BUCKET_NAME 설정이 비어 있습니다.");
        }

        if (file.isEmpty()) {
            throw new FileUploadException("업로드할 이미지 파일이 비어 있습니다.");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new FileUploadException("이미지 파일은 5MB 이하만 업로드할 수 있습니다.");
        }

        if (!ALLOWED_CONTENT_TYPES.contains(file.getContentType())) {
            throw new FileUploadException("jpg, png, webp, gif 형식의 이미지만 업로드할 수 있습니다.");
        }
    }

    private String buildObjectKey(String originalFilename) {
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf('.'));
        }

        LocalDate today = LocalDate.now();
        return String.format(
                "products/%d/%02d/%02d/%s%s",
                today.getYear(),
                today.getMonthValue(),
                today.getDayOfMonth(),
                UUID.randomUUID(),
                extension
        );
    }
}
