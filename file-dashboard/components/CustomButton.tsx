"use client";

import React from "react";
import * as stylex from "@stylexjs/stylex";
import { colors } from "@/constants/colors.stylex";

interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  size?: "medium" | "large";
  variant?: "filled" | "standard" | "outlined";
  onPress?: () => void;
}

export default function CustomButton({
  label,
  size = "large",
  variant = "filled",
  onPress,
  disabled,
  ...props
}: CustomButtonProps) {
  return (
    <button
      {...props}
      onClick={onPress}
      disabled={disabled}
      {...stylex.props(
        styles.container,
        styles[size],
        styles[variant],
        disabled && styles.disabled,
      )}
    >
      <span {...stylex.props(styles.text, styles[`${variant}Text`])}>
        {label}
      </span>
    </button>
  );
}

const styles = stylex.create({
  container: {
    borderRadius: "8px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    borderWidth: 0,
    outline: "none",
    opacity: {
      default: 1,
      ":active": 0.8,
    },
  },
  large: {
    width: "100%",
    height: "44px",
  },
  medium: {
    height: "38px",
    alignSelf: "center",
    paddingInline: "12px",
  },
  filled: {
    backgroundColor: "#000000",
  },
  standard: {
    backgroundColor: "transparent",
  },
  outlined: {
    backgroundColor: "#FFFFFF",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "#000000",
  },
  disabled: {
    backgroundColor: colors.GRAY_300,
    cursor: "not-allowed",
  },
  text: {
    fontSize: "17px",
    fontWeight: "bold",
    textAlign: "center",
  },
  standardText: {
    color: "#000000",
  },
  filledText: {
    color: "#FFFFFF",
  },
  outlinedText: {
    color: "#000000",
  },
});
