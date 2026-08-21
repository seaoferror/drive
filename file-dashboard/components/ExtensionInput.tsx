"use client";

import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import InputField from "@/components/InputField";

const MAX_LENGTH = 20;
const EXTENSION_PATTERN = /^[a-zA-Z0-9]+$/;

export default function ExtensionInput() {
  const { control } = useFormContext();

  return (
    <Controller
      name="extension"
      control={control}
      rules={{
        maxLength: {
          value: MAX_LENGTH,
          message: `확장자 길이는 ${MAX_LENGTH}자를 넘을 수 없습니다`,
        },
        pattern: {
          value: EXTENSION_PATTERN,
          message: "확장자는 영문자와 숫자만 입력 가능합니다",
        },
      }}
      render={({ field: { ref, onChange, value }, fieldState: { error } }) => (
        <InputField
          ref={ref}
          variant="standard"
          placeholder="e.g. sh, py, config"
          maxLength={MAX_LENGTH}
          value={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange(e.target.value)
          }
          error={error?.message}
        />
      )}
    />
  );
}
