package com.jungwook.fileserver.dto;

import java.util.UUID;

public record GetBlockedExtensionsResponse(
    UUID id,
    String name
) {
}
