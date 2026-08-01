"use client";

import { useState, useTransition, useRef } from "react";
import Text from "@/components/atoms/Text";
import { uploadCV } from "@/app/admin/(dashboard)/settings/actions";
import Spinner from "@/components/atoms/Spinner";

export default function CVUploader() {
  const [status, setStatus] = useState("idle"); // idle | uploading | success | error
  const [errorMsg, setErrorMsg] = useState("");
  const [uploadedUrl, setUploadedUrl] = useState(null);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef(null);

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setStatus("uploading");
    setErrorMsg("");

    startTransition(async () => {
      const result = await uploadCV(formData);

      if (result.error) {
        setErrorMsg(result.error);
        setStatus("error");
      } else {
        setUploadedUrl(result.url);
        setStatus("success");
      }

      // reset so same file can be re-uploaded
      if (inputRef.current) inputRef.current.value = "";
    });
  }

  const isUploading = isPending || status === "uploading";

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Text className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1">
          Curriculum Vitae
        </Text>
        <Text className="text-xs text-white/25 tracking-wide">
          PDF only · always replaces the previous version · visitors download instantly
        </Text>
      </div>

      {/* Drop zone */}
      <label className="relative flex flex-col items-center justify-center gap-4 p-12 border border-dashed border-white/10 rounded-2xl cursor-pointer hover:border-white/20 hover:bg-white/2 transition-all duration-300 group">
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="sr-only"
          onChange={handleFile}
          disabled={isUploading}
        />

        {status === "idle" && (
          <>
            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-white/20 transition-all">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5">
                <path d="M10 13V3M10 3L7 6M10 3L13 6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3 14v1a2 2 0 002 2h10a2 2 0 002-2v-1" strokeLinecap="round" />
              </svg>
            </div>
            <div className="text-center">
              <Text className="text-sm font-bold text-white/50 group-hover:text-white/70 transition-colors">
                click to upload cv
              </Text>
              <Text className="text-[10px] text-white/20 uppercase tracking-widest mt-1">
                .pdf · max 10mb
              </Text>
            </div>
          </>
        )}

        {isUploading && (
          <div className="flex flex-col items-center gap-3">
            <Spinner size="sm" color="primary" />
            <Text className="text-[10px] uppercase tracking-widest text-white/30">Uploading…</Text>
          </div>
        )}

        {status === "success" && !isUploading && (
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#34D399" strokeWidth="2">
                <path d="M3 8l3.5 3.5L13 5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <Text className="text-xs font-bold text-green-500/80 uppercase tracking-widest">
              Uploaded successfully
            </Text>
            <Text className="text-[10px] text-white/20 tracking-wider">
              click to replace
            </Text>
          </div>
        )}

        {status === "error" && !isUploading && (
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#F87171" strokeWidth="2">
                <path d="M4 4l8 8M12 4l-8 8" strokeLinecap="round" />
              </svg>
            </div>
            <Text className="text-xs font-bold text-red-500/80 uppercase tracking-widest">
              Upload failed
            </Text>
            {errorMsg && (
              <Text className="text-[10px] text-red-400/60 tracking-wide text-center max-w-60">
                {errorMsg}
              </Text>
            )}
            <Text className="text-[10px] text-white/20 tracking-wider">
              click to try again
            </Text>
          </div>
        )}
      </label>

      {/* Live link after success */}
      {uploadedUrl && status === "success" && !isUploading && (
        <div className="flex items-center justify-between p-4 bg-white/2 border border-white/5 rounded-2xl">
          <Text className="text-[10px] uppercase tracking-widest text-white/30">Live at</Text>
          <a
            href={uploadedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] font-bold uppercase tracking-widest text-accent/70 hover:text-accent transition-colors"
          >
            Open PDF ↗
          </a>
        </div>
      )}
    </div>
  );
}
