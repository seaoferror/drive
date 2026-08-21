package com.jungwook.fileserver.controller;

import com.jungwook.fileserver.dto.BlockExtensionRequest;
import com.jungwook.fileserver.dto.UnblockExtensionRequest;
import com.jungwook.fileserver.service.ExtensionService;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class ExtensionController {

  private final ExtensionService extensionService;

  @GetMapping("/fileserver/extensions/blocked")
  public ResponseEntity<?> getBlockedExtensions(
      @NotNull @RequestHeader("X-User-Id") UUID memberId
  ) {
    var responses = extensionService.getBlockedExtensions(memberId);
    return ResponseEntity.ok(responses);
  }

  @PostMapping("/fileserver/extension/block")
  public ResponseEntity<?> blockExtension(
      @NotNull @RequestHeader("X-User-Id") UUID memberId,
      @NotNull @RequestHeader("X-User-Role") String role,
      @NotNull @RequestBody BlockExtensionRequest request
  ) {
    if (!role.equals("admin")){
      return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }
    extensionService.blockExtension(memberId, request.name());
    return ResponseEntity.ok("ok");
  }

  @PatchMapping("/fileserver/extension/unblock")
  public ResponseEntity<?> unblockExtension(
      @NotNull @RequestHeader("X-User-Id") UUID memberId,
      @NotNull @RequestHeader("X-User-Role") String role,
      @NotNull @RequestBody UnblockExtensionRequest request
  ) {
    if (!role.equals("admin")){
      return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }
    extensionService.unblockExtension(memberId, request.id());
    return ResponseEntity.ok("ok");
  }

}
