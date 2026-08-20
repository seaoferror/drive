package com.jungwook.fileserver.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class ExtensionController {

  @GetMapping("/fileserver/extension/block")
  public ResponseEntity<?> getBlockedExtensions() {
    return null;
  }
}
