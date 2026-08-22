"use client";

import { useQueryClient } from "@tanstack/react-query";
import * as stylex from "@stylexjs/stylex";
import UploadFileBox from "@/components/UploadFileBox";
import FileList from "@/components/FileList";
import { queryKey } from "@/constants";

export default function FilePage() {
  const queryClient = useQueryClient();

  return (
    <div {...stylex.props(styles.pageWrapper)}>
      <UploadFileBox
        onUploadSuccess={() =>
          queryClient.invalidateQueries({ queryKey: [queryKey.GET_FILE_LIST] })
        }
      />
      <FileList />
    </div>
  );
}

const styles = stylex.create({
  pageWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "24px",
    minHeight: "100vh",
    padding: "40px",
    boxSizing: "border-box",
  },
});
