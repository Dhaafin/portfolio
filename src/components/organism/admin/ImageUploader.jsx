"use client";

import { useState, useRef } from "react";
import { uploadImageAction } from "@/app/admin/(dashboard)/projects/actions.js";
import Text from "@/components/atoms/Text";

export default function ImageUploader({ currentUrl, onUpload, error }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentUrl);
  const fileInputRef = useRef(null);

  const handleUpload = async (event) => {
    try {
      setUploading(true);
      const file = event.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);

      const publicUrl = await uploadImageAction(formData);

      setPreview(publicUrl);
      onUpload(publicUrl);
    } catch (error) {
      alert("Error uploading image!");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">
        Project Thumbnail
      </label>
      
      <div 
        onClick={() => fileInputRef.current?.click()}
        className={`relative w-full aspect-[16/9] bg-white/5 border border-dashed border-white/10 rounded-2xl overflow-hidden cursor-pointer group hover:border-primary/50 transition-all flex flex-col items-center justify-center ${error ? 'border-red-500/50' : ''}`}
      >
        {preview ? (
          <>
            <img src={preview} alt="Preview" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Text className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">Change Image</Text>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <span className="text-xl">+</span>
            </div>
            <Text className="text-[10px] font-bold uppercase tracking-widest">
              {uploading ? "Uploading..." : "Upload cinematic cover"}
            </Text>
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="w-12 h-[2px] bg-white/10 overflow-hidden relative">
              <div className="absolute inset-0 bg-primary animate-progress" style={{ width: '50%' }} />
            </div>
          </div>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleUpload}
        accept="image/*"
        className="hidden"
      />

      {error && (
        <span className="text-[10px] text-red-500 font-bold uppercase tracking-tighter mt-1 ml-1">
          {error}
        </span>
      )}
    </div>
  );
}
