package com.banchan.upload.presentation;

import com.banchan.upload.application.ImageUploadService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/uploads")
@RequiredArgsConstructor
@Tag(name = "Upload", description = "이미지 업로드 API")
public class ImageUploadController {

    private final ImageUploadService imageUploadService;

    @PostMapping("/images")
    @Operation(summary = "상품 이미지 업로드", description = "상품 이미지를 S3에 업로드하고 URL을 반환합니다.")
    public ResponseEntity<ImageUploadResponse> uploadImage(@RequestParam("file") MultipartFile file) {
        String imageUrl = imageUploadService.uploadProductImage(file);
        return ResponseEntity.ok(new ImageUploadResponse(imageUrl));
    }
}
