package com.jungwook.fileserver.dto;

import lombok.Builder;

import java.util.UUID;

@Builder
public record GetMyProfileResponse(
    UUID id,
    String role
) {
}
