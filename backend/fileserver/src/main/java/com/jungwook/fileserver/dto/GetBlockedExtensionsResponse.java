package com.jungwook.fileserver.dto;

import lombok.Builder;

import java.util.UUID;

@Builder
public record GetBlockedExtensionsResponse(
    UUID id,
    String name
) {
}
