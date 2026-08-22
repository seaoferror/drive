package com.jungwook.fileserver.dto;

import lombok.Builder;

@Builder
public record GetSignedURLResponse(
    String url
) {
}
