"use client";

import React, { ForwardedRef, forwardRef, ReactNode, useState } from "react";
import * as stylex from "@stylexjs/stylex";
import { colors } from "@/constants/colors.stylex";

interface InputFieldProps extends React.InputHTMLAttributes<
  HTMLInputElement | HTMLTextAreaElement
> {
  label?: string;
  variant?: "filled" | "standard" | "outlined";
  error?: string;
  customHeight?: number;
  rightChild?: ReactNode;
  leftChild?: ReactNode;
  multiline?: boolean;
}

export default forwardRef(function InputField(
  {
    label,
    variant = "filled",
    error = "",
    leftChild = null,
    rightChild = null,
    customHeight,
    multiline = false,
    ...props
  }: InputFieldProps,
  ref: ForwardedRef<any>
) {
  const [adjustedHeight, setAdjustedHeight] = useState(44);

  const handleInput = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    if (multiline) {
      const target = e.target as HTMLTextAreaElement;
      target.style.height = "auto";
      const h = target.scrollHeight;

      if (h > 44) {
        setAdjustedHeight(h + 10);
      } else {
        setAdjustedHeight(44);
      }
    }
    if (props.onChange) {
      props.onChange(e);
    }
  };

  const InputElement = multiline ? "textarea" : "input";

  return (
    <div {...stylex.props(styles.wrapper)}>
      {label && <label {...stylex.props(styles.label)}>{label}</label>}

      <div
        {...stylex.props(
          styles.container,
          styles[variant],
          Boolean(error) && styles.inputError,
          multiline && styles.dynamicHeight(adjustedHeight),
          !!customHeight && styles.dynamicHeight(customHeight)
        )}
      >
        {leftChild}

        <InputElement
          ref={ref}
          autoCapitalize="none"
          spellCheck={false}
          autoCorrect="off"
          onChange={handleInput}
          {...(props as any)}
          {...stylex.props(
            styles.input,
            styles[`${variant}Text`],
            props.style as any
          )}
        />

        {rightChild}
      </div>

      {Boolean(error) && <span {...stylex.props(styles.error)}>{error}</span>}
    </div>
  );
});

const styles = stylex.create({
  wrapper: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  label: {
    fontSize: "12px",
    color: colors.GRAY_700,
    marginBottom: "5px",
    display: "block",
  },
  container: {
    minHeight: "44px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: "10px",
    boxSizing: "border-box",
    transitionProperty: "background-color, border-color",
    transitionDuration: "0.2s",
  },
  filled: {
    backgroundColor: colors.GRAY_100,
    borderWidth: 0,
  },
  standard: {
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: colors.GRAY_200,
    backgroundColor: "#FFFFFF", // colors.WHITE
  },
  outlined: {
    backgroundColor: "#FFFFFF", // colors.WHITE
    borderWidth: "1px", // StyleSheet.hairlineWidth
    borderStyle: "solid",
    borderColor: colors.GRAY_700,
  },
  dynamicHeight: (height: number) => ({
    height: `${height}px`,
  }),
  input: {
    paddingLeft: 10,
    paddingInline: "0px",
    flexGrow: 1,
    borderWidth: 0,
    outline: "none",
    backgroundColor: "transparent",
    width: "100%",
    resize: "none", // Prevents manual resizing of textareas
    fontFamily: "inherit",
    // Matches React Native's placeholderTextColor logic
    "::placeholder": {
      color: colors.GRAY_400,
    },
  },
  standardText: {
    color: "#000000",
  },
  outlinedText: {
    color: "#000000",
  },
  filledText: {
    color: "inherit",
  },
  error: {
    fontSize: "12px",
    marginTop: "5px",
    color: colors.RED_500,
    display: "block",
  },
  inputError: {
    backgroundColor: colors.RED_100,
  },
});
