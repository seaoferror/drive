"use client";

import React, { useCallback, useRef } from "react";
import * as stylex from "@stylexjs/stylex";
import { colors } from "@/constants/colors.stylex";
import { useGetFileList } from "@/hooks/useFile";

export default function FileList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useGetFileList();

  const observerRef = useRef<IntersectionObserver | null>(null);

  const sentinelRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isFetchingNextPage) return;

      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage],
  );

  const files = data?.pages.flat() ?? [];

  if (isLoading) {
    return <p {...stylex.props(styles.statusText)}>불러오는 중...</p>;
  }

  if (isError) {
    return (
      <p {...stylex.props(styles.statusText, styles.errorText)}>
        파일 목록을 불러오지 못했습니다.
      </p>
    );
  }

  if (files.length === 0) {
    return (
      <p {...stylex.props(styles.statusText)}>업로드된 파일이 없습니다.</p>
    );
  }

  return (
    <div {...stylex.props(styles.container)}>
      {files.map((file) => (
        <a
          key={file.id}
          href={file.url}
          target="_blank"
          rel="noopener noreferrer"
          {...stylex.props(styles.fileRow)}
        >
          <span {...stylex.props(styles.fileName)}>{file.name}</span>
        </a>
      ))}

      <div ref={sentinelRef} {...stylex.props(styles.sentinel)}>
        {isFetchingNextPage && (
          <span {...stylex.props(styles.loadingMore)}>불러오는 중...</span>
        )}
      </div>
    </div>
  );
} // Added the missing closing bracket for the FileList component

const styles = stylex.create({
  container: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    maxWidth: "500px",
    gap: "8px",
  },
  fileRow: {
    display: "flex",
    alignItems: "center",
    padding: "12px 16px",
    borderRadius: "8px",
    backgroundColor: {
      default: colors.WHITE,
      ":hover": colors.GRAY_100,
    },
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: {
      default: colors.GRAY_200,
      ":hover": colors.GRAY_400,
    },
    textDecoration: "none",
    transitionProperty: "background-color, border-color",
    transitionDuration: "0.15s",
  },
  fileName: {
    fontSize: "14px",
    color: colors.BLACK,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  sentinel: {
    display: "flex",
    justifyContent: "center",
    padding: "16px",
  },
  loadingMore: {
    fontSize: "13px",
    color: colors.GRAY_500,
  },
  statusText: {
    fontSize: "14px",
    color: colors.GRAY_500,
    textAlign: "center",
    padding: "24px",
  },
  errorText: {
    color: colors.RED_500,
  },
});
