"use client";

import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import InputField from "@/components/InputField";

export default function PasswordInput() {
  const { control, setFocus } = useFormContext();

  return (
    <Controller
      name="password"
      control={control}
      rules={{
        validate: (data: string) => {
          if (data.length === 0) {
            return "패스워드를 입력하세요";
          }
          if (data.length < 8) {
            return "패스워드는 8자 이상입니다";
          }
        },
      }}
      render={({ field: { ref, onChange, value }, fieldState: { error } }) => (
        <InputField
          ref={ref}
          variant="outlined"
          label="password"
          placeholder="패스워드를 입력하세요"
          type="password"
          value={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange(e.target.value)
          }
          error={error?.message}
          onKeyDown={(e: React.KeyboardEvent) => {
            if (e.key === "Enter") setFocus("passwordConfirm");
          }}
        />
      )}
    />
  );
}
