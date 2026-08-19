"use client";

import React, { useState, useEffect } from "react";
import * as stylex from "@stylexjs/stylex";

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
    <div {...stylex.props(styles.container)}>
      <h2 {...stylex.props(styles.heading)}>Extension Blocking Policy</h2>

      {errorMsg && (
        <div {...stylex.props(styles.notification)}>
          <span>{errorMsg}</span>
          <button
            type="button"
            onClick={() => setErrorMsg("")}
            {...stylex.props(styles.notificationCloseBtn)}
          >
            ✕
          </button>
        </div>
      )}

      <div {...stylex.props(styles.fixedSection)}>
        <label {...stylex.props(styles.sectionLabel)}>Fixed Extensions</label>
        <p {...stylex.props(styles.sectionParagraph)}>
          Select standard extensions to block. Changes are saved automatically.
        </p>

        <div {...stylex.props(styles.checkboxGrid)}>
          {FIXED_EXTENSIONS.map((ext) => (
            <label key={ext} {...stylex.props(styles.checkboxWrapper)}>
              <input
                type="checkbox"
                checked={fixedState[ext] || false}
                onChange={() => handleFixedToggle(ext)}
                {...stylex.props(styles.checkboxInput)}
              />
              <span {...stylex.props(styles.checkboxText)}>{ext}</span>
            </label>
          ))}
        </div>
      </div>

      <div {...stylex.props(styles.divider)} />

      <div>
        <label {...stylex.props(styles.sectionLabel)}>Custom Extensions</label>
        <p {...stylex.props(styles.sectionParagraph)}>
          Add specific extensions to block (Max {MAX_LENGTH} chars). Limit:{" "}
          {customExtensions.length}/{MAX_CUSTOM_EXTENSIONS}
        </p>

        <form onSubmit={handleAddCustom} {...stylex.props(styles.form)}>
          <div {...stylex.props(styles.formInputWrapper)}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              maxLength={MAX_LENGTH}
              placeholder="e.g. sh, py, config"
              {...stylex.props(styles.textInput)}
            />
          </div>
          <button
            type="submit"
            disabled={
              !inputValue.trim() ||
              customExtensions.length >= MAX_CUSTOM_EXTENSIONS
            }
            {...stylex.props(styles.submitBtn)}
          >
            Add
          </button>
        </form>

        <div {...stylex.props(styles.customTagsContainer)}>
          {customExtensions.length === 0 ? (
            <p {...stylex.props(styles.emptyText)}>
              No custom extensions added yet.
            </p>
          ) : (
            customExtensions.map((ext) => (
              <div key={ext} {...stylex.props(styles.customTag)}>
                <span>{ext}</span>
                <button
                  type="button"
                  onClick={() => handleDeleteCustom(ext)}
                  aria-label={`Remove ${ext}`}
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
  );
}

const styles = stylex.create({
  container: {
    maxWidth: "700px",
    marginInline: "auto",
    padding: "24px",
    backgroundColor: "#ffffff",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
    borderRadius: "8px",
    fontFamily: "system-ui, -apple-system, sans-serif",
  },
  heading: {
    fontSize: "20px",
    fontWeight: 600,
    marginTop: 0,
    marginBottom: "24px",
    color: "#0f172a",
  },
  sectionLabel: {
    display: "block",
    fontSize: "16px",
    fontWeight: 600,
    marginBottom: "4px",
    color: "#334155",
  },
  sectionParagraph: {
    fontSize: "14px",
    marginTop: 0,
    marginBottom: "16px",
    color: "#64748b",
  },
  notification: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 16px",
    backgroundColor: "#fef2f2",
    color: "#991b1b",
    borderRadius: "6px",
    marginBottom: "24px",
    fontSize: "14px",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "#fecaca",
  },
  notificationCloseBtn: {
    background: "none",
    borderWidth: 0,
    cursor: "pointer",
    color: "#991b1b",
    fontSize: "16px",
    opacity: {
      default: 0.7,
      ":hover": 1,
    },
  },
  fixedSection: {
    marginBottom: "32px",
  },
  checkboxGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "16px",
  },
  checkboxWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
  },
  checkboxInput: {
    width: "16px",
    height: "16px",
    cursor: "pointer",
  },
  checkboxText: {
    fontSize: "14px",
    fontWeight: 500,
    color: "#334155",
  },
  divider: {
    borderBottomWidth: "1px",
    borderBottomStyle: "solid",
    borderBottomColor: "#e2e8f0",
    marginBottom: "24px",
  },
  form: {
    display: "flex",
    gap: "8px",
    marginBottom: "16px",
  },
  formInputWrapper: {
    flexGrow: 1,
  },
  textInput: {
    width: "100%",
    paddingTop: "8px",
    paddingBottom: "8px",
    paddingRight: "12px",
    paddingLeft: "12px",
    fontSize: "14px",
    borderRadius: "6px",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "#cbd5e1",
    outline: "none",
    boxSizing: "border-box",
  },
  submitBtn: {
    paddingTop: "8px",
    paddingBottom: "8px",
    paddingRight: "16px",
    paddingLeft: "16px",
    fontSize: "14px",
    fontWeight: 500,
    color: "#ffffff",
    borderWidth: 0,
    borderRadius: "6px",
    cursor: {
      default: "pointer",
      ":disabled": "not-allowed",
    },
    transitionProperty: "background-color",
    transitionDuration: "0.2s",
    backgroundColor: {
      default: "#2563eb",
      ":hover": "#1d4ed8",
      ":disabled": "#94a3b8",
    },
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
    gap: "8px",
  },
  emptyText: {
    width: "100%",
    textAlign: "center",
    marginTop: "40px",
    color: "#545454",
    fontSize: "14px",
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
    fontWeight: 500,
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
      ":hover": "#ef4444",
    },
    fontSize: "12px",
    borderRadius: "50%",
    transitionProperty: "background-color, color",
    transitionDuration: "0.2s",
    backgroundColor: {
      default: "transparent",
      ":hover": "#fee2e2",
    },
  },
});
