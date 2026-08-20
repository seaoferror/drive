package com.jungwook.fileserver.dto;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record UnblockExtensionRequest(
    @NotNull UUID id
) {
}
