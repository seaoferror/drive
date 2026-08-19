"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useStyletron } from "baseui";
import { Checkbox, LABEL_PLACEMENT } from "baseui/checkbox";
import { Input } from "baseui/input";
import { Button } from "baseui/button";
import { HeadingSmall, LabelMedium, ParagraphSmall } from "baseui/typography";
import { Notification, KIND as NotificationKind } from "baseui/notification";
import type { StyleObject } from "styletron-react";

const api = {
  fetchPolicy: async () => {
    return {
      fixed: {
        bat: false,
        cmd: false,
        com: false,
        cpl: false,
        exe: false,
        scr: false,
        js: false,
      },
      custom: ["sh", "php"],
    };
  },
  toggleFixedExtension: async (extension: string, isChecked: boolean) => {
    console.log(`[DB SAVE] Fixed Extension '${extension}' -> ${isChecked}`);
    return Promise.resolve(true);
  },
  addCustomExtension: async (extension: string) => {
    console.log(`[DB SAVE] Custom Extension added: '${extension}'`);
    return Promise.resolve(true);
  },
  deleteCustomExtension: async (extension: string) => {
    console.log(`[DB DELETE] Custom Extension removed: '${extension}'`);
    return Promise.resolve(true);
  },
};

const FIXED_EXTENSIONS: string[] = [
  "bat",
  "cmd",
  "com",
  "cpl",
  "exe",
  "scr",
  "js",
];
const MAX_CUSTOM_EXTENSIONS: number = 200;
const MAX_LENGTH: number = 20;

export default function ExtensionManager() {
  const [css, theme] = useStyletron();
  const styles = useMemo(() => getStyles(theme), [theme]);

  const [fixedState, setFixedState] = useState<Record<string, boolean>>({});
  const [customExtensions, setCustomExtensions] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    api.fetchPolicy().then((data) => {
      setFixedState(data.fixed);
      setCustomExtensions(data.custom);
      setIsLoading(false);
    });
  }, []);

  const handleFixedToggle = async (ext: string) => {
    const newStatus = !fixedState[ext];

    setFixedState((prev) => ({ ...prev, [ext]: newStatus }));
    setErrorMsg("");

    try {
      await api.toggleFixedExtension(ext, newStatus);
    } catch (error) {
      setFixedState((prev) => ({ ...prev, [ext]: !newStatus }));
      setErrorMsg(`Failed to save ${ext} setting to database.`);
    }
  };

  const handleAddCustom = async (e: React.FormEvent) => {
    e.preventDefault();
    const ext = inputValue.trim().toLowerCase();

    if (!ext) return;

    if (ext.length > MAX_LENGTH) {
      setErrorMsg(`Extension cannot exceed ${MAX_LENGTH} characters.`);
      return;
    }
    if (customExtensions.includes(ext)) {
      setErrorMsg(`'${ext}' is already in your custom list.`);
      return;
    }
    if (FIXED_EXTENSIONS.includes(ext)) {
      setErrorMsg(`'${ext}' is a fixed extension and cannot be added here.`);
      return;
    }
    if (customExtensions.length >= MAX_CUSTOM_EXTENSIONS) {
      setErrorMsg(
        `Maximum of ${MAX_CUSTOM_EXTENSIONS} custom extensions reached.`,
      );
      return;
    }

    try {
      await api.addCustomExtension(ext);
      setCustomExtensions((prev) => [...prev, ext]);
      setInputValue("");
      setErrorMsg("");
    } catch (error) {
      setErrorMsg("Failed to save custom extension to database.");
    }
  };

  const handleDeleteCustom = async (extToDelete: string) => {
    try {
      await api.deleteCustomExtension(extToDelete);
      setCustomExtensions((prev) => prev.filter((ext) => ext !== extToDelete));
      setErrorMsg("");
    } catch (error) {
      setErrorMsg("Failed to delete custom extension from database.");
    }
  };

  if (isLoading) return null;

  return (
    <div className={css(styles.container)}>
      <HeadingSmall marginTop="0" marginBottom={theme.sizing.scale800}>
        Extension Blocking Policy
      </HeadingSmall>

      {errorMsg && (
        <Notification
          kind={NotificationKind.negative}
          closeable
          onClose={() => setErrorMsg("")}
        >
          {errorMsg}
        </Notification>
      )}

      <div className={css(styles.fixedSection)}>
        <LabelMedium marginBottom={theme.sizing.scale300}>
          Fixed Extensions
        </LabelMedium>
        <ParagraphSmall color={theme.colors.contentSecondary} marginTop="0">
          Select standard extensions to block. Changes are saved automatically.
        </ParagraphSmall>

        <div className={css(styles.checkboxGrid)}>
          {FIXED_EXTENSIONS.map((ext) => (
            <Checkbox
              key={ext}
              checked={fixedState[ext] || false}
              onChange={() => handleFixedToggle(ext)}
              labelPlacement={LABEL_PLACEMENT.right}
            >
              {ext}
            </Checkbox>
          ))}
        </div>
      </div>

      <div className={css(styles.divider)} />

      <div>
        <LabelMedium marginBottom={theme.sizing.scale300}>
          Custom Extensions
        </LabelMedium>
        <ParagraphSmall color={theme.colors.contentSecondary} marginTop="0">
          Add specific extensions to block (Max {MAX_LENGTH} chars). Limit:{" "}
          {customExtensions.length}/{MAX_CUSTOM_EXTENSIONS}
        </ParagraphSmall>

        <form onSubmit={handleAddCustom} className={css(styles.form)}>
          <div className={css(styles.formInput)}>
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              maxLength={MAX_LENGTH}
              placeholder="e.g. sh, py, config"
              clearOnEscape
            />
          </div>
          <Button
            type="submit"
            disabled={
              !inputValue.trim() ||
              customExtensions.length >= MAX_CUSTOM_EXTENSIONS
            }
          >
            Add
          </Button>
        </form>

        <div className={css(styles.customTagsContainer)}>
          {customExtensions.length === 0 ? (
            <ParagraphSmall
              color={theme.colors.contentSecondary}
              className={css(styles.emptyText)}
            >
              No custom extensions added yet.
            </ParagraphSmall>
          ) : (
            customExtensions.map((ext) => (
              <div key={ext} className={css(styles.customTag)}>
                <span>{ext}</span>
                <button
                  type="button"
                  onClick={() => handleDeleteCustom(ext)}
                  className={css(styles.customTagCloseBtn)}
                  aria-label={`Remove ${ext}`}
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

const getStyles = (theme: any): Record<string, StyleObject> => ({
  container: {
    maxWidth: "700px",
    margin: "0 auto",
    padding: theme.sizing.scale800,
    backgroundColor: theme.colors.backgroundPrimary,
    boxShadow: theme.lighting.shadow400,
    borderRadius: theme.borders.radius400,
  },
  fixedSection: {
    marginBottom: theme.sizing.scale900,
  },
  checkboxGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: theme.sizing.scale600,
  },
  divider: {
    borderBottom: `1px solid ${theme.colors.borderOpaque}`,
    marginBottom: theme.sizing.scale800,
  },
  form: {
    display: "flex",
    gap: theme.sizing.scale400,
    marginBottom: theme.sizing.scale600,
  },
  formInput: {
    flex: 1,
  },
  customTagsContainer: {
    minHeight: "150px",
    padding: theme.sizing.scale600,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borders.radius300,
    border: `1px solid ${theme.colors.borderOpaque}`,
    display: "flex",
    flexWrap: "wrap",
    alignItems: "flex-start",
    alignContent: "flex-start",
    gap: theme.sizing.scale300,
  },
  emptyText: {
    width: "100%",
    textAlign: "center",
    marginTop: theme.sizing.scale1000,
  },
  // New Custom Tag Styles
  customTag: {
    display: "inline-flex",
    alignItems: "center",
    backgroundColor: theme.colors.backgroundTertiary,
    color: theme.colors.contentPrimary,
    paddingTop: theme.sizing.scale100,
    paddingBottom: theme.sizing.scale100,
    paddingLeft: theme.sizing.scale400,
    paddingRight: theme.sizing.scale300,
    borderRadius: theme.borders.radius400,
    fontSize: "14px",
    fontWeight: "500",
  },
  customTagCloseBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "none",
    border: "none",
    cursor: "pointer",
    marginLeft: theme.sizing.scale200,
    padding: theme.sizing.scale100,
    color: theme.colors.contentSecondary,
    fontSize: "12px",
    borderRadius: "50%",
    transition: "background-color 0.2s, color 0.2s",
    ":hover": {
      backgroundColor: theme.colors.backgroundNegative,
      color: theme.colors.contentStateDisabled,
    },
  },
});