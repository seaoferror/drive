package com.jungwook.fileserver.dto;

import lombok.Builder;

import java.util.UUID;

@Builder
public record GetFileListResponse(
    UUID id,
    String name,
    String url
) {
}
