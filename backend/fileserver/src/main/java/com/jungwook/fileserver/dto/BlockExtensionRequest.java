package com.jungwook.fileserver.dto;

import jakarta.validation.constraints.NotBlank;
import org.hibernate.validator.constraints.Length;

public record BlockExtensionRequest(
    @NotBlank @Length(min = 1, max = 20) String name
) {
}
