"use client";

import React from "react";
import * as stylex from "@stylexjs/stylex";
import { useLoginWithEmail } from "@/hooks/useAuth";
import { FormProvider, useForm } from "react-hook-form";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import EmailInput from "@/components/EmailInput";
import PasswordInput from "@/components/PasswordInput";
import CustomButton from "@/components/CustomButton";
import { colors } from "@/constants/colors.stylex";

interface FormValue {
  email: string;
  password: string;
}

export default function LoginPage() {
  const loginWithEmailMutation = useLoginWithEmail();
  const { setAccessToken } = useAuth();
  const router = useRouter();

  const emailLoginForm = useForm<FormValue>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (formValues: FormValue) => {
    const { email, password } = formValues;
    loginWithEmailMutation.mutate(
      {
        email,
        password,
      },
      {
        onSuccess: async (data) => {
          console.log(data);
          setAccessToken(data.accessToken);
          router.replace("/policy");
        },
      },
    );
  };

  return (
    <FormProvider {...emailLoginForm}>
      <div {...stylex.props(styles.container)}>
        <div {...stylex.props(styles.content)}>
          <EmailInput />
          <PasswordInput />
          <div {...stylex.props(styles.actionContainer)}>
            <CustomButton
              label="login"
              onPress={emailLoginForm.handleSubmit(onSubmit)}
              disabled={loginWithEmailMutation.isPending}
            />
          </div>
        </div>
      </div>
    </FormProvider>
  );
}

const styles = stylex.create({
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    maxWidth: "400px",
    gap: "16px",
    paddingInline: "20px",
  },
  actionContainer: {
    display: "flex",
    flexDirection: "column",
    marginTop: "30px",
    gap: "40px",
    alignItems: "center",
  },
  link: {
    color: colors.GRAY_500,
    textDecorationLine: "underline",
  },
});
