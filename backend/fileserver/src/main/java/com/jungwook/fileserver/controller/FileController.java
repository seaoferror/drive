package com.jungwook.fileserver.controller;


import com.jungwook.fileserver.service.FileService;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;


@RestController
@RequiredArgsConstructor
public class FileController {

  private final FileService fileService;

  @PostMapping("/fileserver/upload")
  public ResponseEntity<?> uploadFile(
      @NotNull @RequestHeader("X-User-Id") UUID memberId,
      @RequestParam("file") MultipartFile file
  ) {
    fileService.uploadMultipartFile(memberId, file);
    return ResponseEntity.ok("ok");
  }

  @GetMapping("/fileserver/file/list")
  public ResponseEntity<?> getFileList(
      @NotNull @RequestHeader("X-User-Id") UUID memberId
  ) {
    var responses = fileService.getFileList(memberId);
    return ResponseEntity.ok(responses);
  }

  @GetMapping("/fileserver/file/signed")
  public ResponseEntity<?> getSignedURL(
      @NotNull @RequestHeader("X-User-Id") UUID memberId,
      @NotNull @RequestParam UUID fileId
  ) {
    var response = fileService.getSignedURL(memberId, fileId);
    return ResponseEntity.ok(response);
  }
}
