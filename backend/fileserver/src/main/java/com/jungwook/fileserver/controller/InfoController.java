package com.jungwook.fileserver.controller;

import com.jungwook.fileserver.dto.GetMyProfileResponse;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class InfoController {


  @GetMapping("/fileserver/profile/my")
  public ResponseEntity<?> getMyProfile(
      @NotNull @RequestHeader("X-User-Id") UUID memberId,
      @NotNull @RequestHeader("X-User-Role") String role
  ) {
    return ResponseEntity.ok(GetMyProfileResponse.builder().id(memberId).role(role).build());
  }
}
