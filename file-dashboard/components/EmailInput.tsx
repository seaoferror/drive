"use client";

import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import InputField from "@/components/InputField";

export default function EmailInput() {
  const { control, setFocus } = useFormContext();

  return (
    <Controller
      name="email"
      control={control}
      rules={{
        validate: (data: string) => {
          if (data.length === 0) {
            return "이메일을 입력하세요";
          }
          if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(data)) {
            return "올바른 이메일 형식이 아닙니다";
          }
        },
      }}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <InputField
          autoFocus
          variant="outlined"
          label="email"
          placeholder="이메일을 입력하세요"
          type="email"
          onKeyDown={(e: React.KeyboardEvent) => {
            if (e.key === "Enter") setFocus("password");
          }}
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
