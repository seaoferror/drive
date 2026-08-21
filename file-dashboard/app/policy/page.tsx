"use client";

import React from "react";
import * as stylex from "@stylexjs/stylex";
import { useBlockExtension, useGetBlockedExtensions, useUnblockExtension } from "@/hooks/useFile";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import ExtensionInput from "@/components/ExtensionInput";

const FIXED_EXTENSIONS: string[] = [
  "bat",
  "cmd",
  "com",
  "cpl",
  "exe",
  "scr",
  "js"
];
const MAX_CUSTOM_EXTENSIONS = 200;
const MAX_LENGTH = 20;

interface FormValue {
  extension: string;
}

export default function ExtensionManager() {
  const { data, isLoading } = useGetBlockedExtensions();
  const blockExtensionMutation = useBlockExtension();
  const unblockExtensionMutation = useUnblockExtension();

  const extensionForm = useForm<FormValue>({
    defaultValues: { extension: "" }
  });

  const isMutating =
    blockExtensionMutation.isPending || unblockExtensionMutation.isPending;

  const blockedExtensions = data ?? [];

  const fixedBlockedNames = new Set(
    blockedExtensions
      .filter((item) => FIXED_EXTENSIONS.includes(item.name))
      .map((item) => item.name)
  );

  const customExtensions = blockedExtensions.filter(
    (item) => !FIXED_EXTENSIONS.includes(item.name)
  );

  const handleFixedToggle = (ext: string) => {
    if (fixedBlockedNames.has(ext)) {
      const target = blockedExtensions.find((item) => item.name === ext);
      if (!target) return;
      unblockExtensionMutation.mutate({ id: target.id });
      return;
    }
    blockExtensionMutation.mutate({ name: ext });
  };

  const handleDeleteCustom = (id: string) => {
    unblockExtensionMutation.mutate({ id });
  };

  const onSubmit = (formValue: FormValue) => {
    const trimmed = formValue.extension.trim().toLowerCase();

    if (!trimmed) return;

    if (trimmed.length > MAX_LENGTH) {
      toast.error(`확장자 길이는 ${MAX_LENGTH}자를 넘을 수 없습니다`);
      return;
    }
    if (FIXED_EXTENSIONS.includes(trimmed)) {
      toast.error(`'${trimmed}'는 고정 확장자입니다`);
      return;
    }
    if (customExtensions.some((item) => item.name === trimmed)) {
      toast.error(`'${trimmed}'는 이미 추가된 확장자입니다`);
      return;
    }
    if (customExtensions.length >= MAX_CUSTOM_EXTENSIONS) {
      toast.error(`최대 ${MAX_CUSTOM_EXTENSIONS}개까지 추가할 수 있습니다`);
      return;
    }

    blockExtensionMutation.mutate(
      { name: trimmed },
      { onSuccess: () => extensionForm.reset() }
    );
  };

  if (isLoading) return null;

  return (
    <div {...stylex.props(styles.pageWrapper)}>
      <div {...stylex.props(styles.container)}>
        <h2 {...stylex.props(styles.heading)}>확장자 차단 정책</h2>

        <div {...stylex.props(styles.fixedSection)}>
          <label {...stylex.props(styles.sectionLabel)}>고정 확장자</label>
          <div {...stylex.props(styles.checkboxGrid)}>
            {FIXED_EXTENSIONS.map((ext) => (
              <label key={ext} {...stylex.props(styles.checkboxWrapper)}>
                <input
                  type="checkbox"
                  checked={fixedBlockedNames.has(ext)}
                  onChange={() => handleFixedToggle(ext)}
                  {...stylex.props(styles.checkboxInput)}
                  disabled={isMutating}
                />
                <span {...stylex.props(styles.checkboxText)}>{ext}</span>
              </label>
            ))}
          </div>
        </div>

        <div {...stylex.props(styles.divider)} />

        <div>
          <label {...stylex.props(styles.sectionLabel)}>커스텀 확장자</label>
          <p {...stylex.props(styles.sectionParagraph)}>
            최대 {MAX_LENGTH}자, 최대 추가 개수: {customExtensions.length}/
            {MAX_CUSTOM_EXTENSIONS}
          </p>

          <FormProvider {...extensionForm}>
            <form
              onSubmit={extensionForm.handleSubmit(onSubmit)}
              {...stylex.props(styles.form)}
            >
              <div {...stylex.props(styles.formInputWrapper)}>
                <ExtensionInput />
              </div>
              <button
                type="submit"
                disabled={
                  blockExtensionMutation.isPending ||
                  customExtensions.length >= MAX_CUSTOM_EXTENSIONS
                }
                {...stylex.props(styles.submitBtn)}
              >
                Add
              </button>
            </form>
          </FormProvider>

          <div {...stylex.props(styles.customTagsContainer)}>
            {customExtensions.length === 0 ? (
              <p {...stylex.props(styles.emptyText)}>
                등록된 커스텀 확장자가 없습니다.
              </p>
            ) : (
              customExtensions.map((item) => (
                <div key={item.id} {...stylex.props(styles.customTag)}>
                  <span>{item.name}</span>
                  <button
                    type="button"
                    onClick={() => handleDeleteCustom(item.id)}
                    aria-label={`Remove ${item.name}`}
                    {...stylex.props(styles.customTagCloseBtn)}
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = stylex.create({
  // New wrapper style to center the container on the page
  pageWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    padding: "24px",
    boxSizing: "border-box"
  },
  container: {
    width: "100%", // Ensures it scales properly on smaller screens
    maxWidth: "700px",
    padding: "24px",
    backgroundColor: "#ffffff",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
    borderRadius: "8px",
    fontFamily: "system-ui, -apple-system, sans-serif"
  },
  heading: {
    fontSize: "20px",
    fontWeight: 600,
    marginTop: 0,
    marginBottom: "24px",
    color: "#0f172a"
  },
  sectionLabel: {
    display: "block",
    fontSize: "16px",
    fontWeight: 600,
    marginBottom: "14px",
    color: "#334155"
  },
  sectionParagraph: {
    fontSize: "14px",
    marginTop: 0,
    marginBottom: "16px",
    color: "#64748b"
  },
  fixedSection: {
    marginBottom: "32px"
  },
  checkboxGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "16px"
  },
  checkboxWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: {
      default: "pointer",
      ":has(input:disabled)": "not-allowed"
    }
  },
  checkboxInput: {
    width: "16px",
    height: "16px",
    cursor: "pointer"
  },
  checkboxText: {
    fontSize: "14px",
    fontWeight: 500,
    color: "#334155"
  },
  divider: {
    borderBottomWidth: "1px",
    borderBottomStyle: "solid",
    borderBottomColor: "#e2e8f0",
    marginBottom: "24px"
  },
  form: {
    display: "flex",
    alignItems: "flex-start",
    gap: "8px",
    marginBottom: "16px"
  },
  formInputWrapper: {
    flexGrow: 1
  },
  submitBtn: {
    height: "44px",
    paddingRight: "16px",
    paddingLeft: "16px",
    fontSize: "14px",
    fontWeight: 500,
    color: "#ffffff",
    borderWidth: 0,
    borderRadius: "6px",
    cursor: {
      default: "pointer",
      ":disabled": "not-allowed"
    },
    transitionProperty: "background-color",
    transitionDuration: "0.2s",
    backgroundColor: {
      default: "#2563eb",
      ":hover": "#1d4ed8",
      ":disabled": "#94a3b8"
    }
  },
  customTagsContainer: {
    minHeight: "150px",
    padding: "16px",
    backgroundColor: "#f8f9fa",
    borderRadius: "4px",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "#e2e8f0",
    display: "flex",
    flexWrap: "wrap",
    alignItems: "flex-start",
    alignContent: "flex-start",
    gap: "8px"
  },
  emptyText: {
    width: "100%",
    textAlign: "center",
    marginTop: "40px",
    color: "#545454",
    fontSize: "14px"
  },
  customTag: {
    display: "inline-flex",
    alignItems: "center",
    backgroundColor: "#e2e8f0",
    color: "#0f172a",
    paddingTop: "4px",
    paddingBottom: "4px",
    paddingRight: "8px",
    paddingLeft: "12px",
    borderRadius: "9999px",
    fontSize: "14px",
    fontWeight: 500
  },
  customTagCloseBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "none",
    borderWidth: 0,
    cursor: "pointer",
    marginLeft: "6px",
    padding: "4px",
    color: {
      default: "#64748b",
      ":hover": "#ef4444"
    },
    fontSize: "12px",
    borderRadius: "50%",
    transitionProperty: "background-color, color",
    transitionDuration: "0.2s",
    backgroundColor: {
      default: "transparent",
      ":hover": "#fee2e2"
    }
  }
});
