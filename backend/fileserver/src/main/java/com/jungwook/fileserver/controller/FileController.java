package com.jungwook.fileserver.controller;


import com.jungwook.fileserver.service.FileService;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;


@RestController
@RequiredArgsConstructor
public class FileController {

  private final FileService fileService;

  @PostMapping("/upload")
  public ResponseEntity<String> uploadFile(
      @NotNull @RequestHeader("X-User-Id") UUID memberId,
      @RequestParam("file") MultipartFile file
  ) {
    fileService.uploadMultipartFile(memberId, file);
    return ResponseEntity.ok("ok");
  }
}
