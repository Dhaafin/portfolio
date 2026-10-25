"use client";

import { useState, useTransition } from "react";
import Text from "@/components/atoms/Text";
import Spinner from "@/components/atoms/Spinner";
import { updateAISettingsAction } from "@/app/admin/(dashboard)/settings/actions";

const PRESET_MODELS = [
  { id: "agnes-2.0-flash", label: "Agnes 2.0 Flash (Default / Fast)" },
  { id: "gpt-4o-mini", label: "GPT-4o Mini (OpenAI)" },
  { id: "gemini-1.5-flash", label: "Gemini 1.5 Flash (Google)" },
  { id: "claude-3-5-haiku", label: "Claude 3.5 Haiku (Anthropic)" },
];

export default function AISettingsCard({ initialSettings }) {
  const [isEnabled, setIsEnabled] = useState(initialSettings?.is_enabled ?? true);
  const [model, setModel] = useState(initialSettings?.model || "agnes-2.0-flash");
  const [customModel, setCustomModel] = useState(
    PRESET_MODELS.some((m) => m.id === initialSettings?.model) ? "" : initialSettings?.model || ""
  );
  const [isCustom, setIsCustom] = useState(
    Boolean(initialSettings?.model && !PRESET_MODELS.some((m) => m.id === initialSettings?.model))
  );
  const [temperature, setTemperature] = useState(initialSettings?.temperature ?? 0.7);
  const [statusMsg, setStatusMsg] = useState(null);
  const [isPending, startTransition] = useTransition();

  const handleSave = (e) => {
    e.preventDefault();
    setStatusMsg(null);

    const activeModel = isCustom ? customModel.trim() : model;
    if (!activeModel) {
      setStatusMsg({ type: "error", text: "Model name cannot be empty." });
      return;
    }

    const formData = new FormData();
    formData.append("is_enabled", isEnabled.toString());
    formData.append("model", activeModel);
    formData.append("temperature", temperature.toString());

    startTransition(async () => {
      const res = await updateAISettingsAction(formData);
      if (res.error) {
        setStatusMsg({ type: "error", text: res.error });
      } else {
        setStatusMsg({ type: "success", text: "AI configurations updated successfully." });
      }
    });
  };

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-8">
      {/* Status Master Switch */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-white/3 border border-white/8">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                isEnabled ? "bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" : "bg-rose-500"
              }`}
            />
            <Text className="text-xs uppercase tracking-widest font-bold text-white">
              {isEnabled ? "Chatbot Live & Active" : "Chatbot On Standby (Paused)"}
            </Text>
          </div>
          <Text className="text-[11px] text-white/40">
            {isEnabled
              ? "Public visitors can interact with the AI assistant on your portfolio."
              : "Assistant will return a friendly 503 standby notice when queried."}
          </Text>
        </div>

        <button
          type="button"
          onClick={() => setIsEnabled(!isEnabled)}
          className={`relative inline-flex h-7 w-13 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
            isEnabled ? "bg-emerald-500" : "bg-white/10"
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
              isEnabled ? "translate-x-6" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* Model Selection */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <label className="text-[10px] uppercase tracking-widest text-white/50 font-bold">
            Target AI Model
          </label>
          <button
            type="button"
            onClick={() => {
              setIsCustom(!isCustom);
              if (!isCustom && !customModel) setCustomModel(model);
            }}
            className="text-[10px] uppercase tracking-widest font-mono text-primary hover:underline cursor-pointer"
          >
            {isCustom ? "← Choose from presets" : "+ Custom model ID"}
          </button>
        </div>

        {isCustom ? (
          <div className="flex flex-col gap-1">
            <input
              type="text"
              value={customModel}
              onChange={(e) => setCustomModel(e.target.value)}
              placeholder="e.g. agnes-2.5-pro, meta-llama/llama-3-70b"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-mono text-white focus:outline-none focus:border-primary/50 transition-all"
            />
            <span className="text-[10px] text-white/30 ml-1">
              Supports any model name routed by your Bynara router / OpenAI-compatible endpoint.
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {PRESET_MODELS.map((item) => {
              const selected = model === item.id && !isCustom;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setModel(item.id);
                    setIsCustom(false);
                  }}
                  className={`flex flex-col text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                    selected
                      ? "bg-white/10 border-primary/60 shadow-[0_0_15px_rgba(167,139,250,0.15)]"
                      : "bg-white/3 border-white/6 hover:bg-white/6 hover:border-white/15"
                  }`}
                >
                  <span className={`text-xs font-bold ${selected ? "text-white" : "text-white/80"}`}>
                    {item.label}
                  </span>
                  <span className="text-[10px] font-mono text-white/30 mt-0.5">{item.id}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Temperature Slider */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <label className="text-[10px] uppercase tracking-widest text-white/50 font-bold">
            Temperature (Creativity)
          </label>
          <span className="text-xs font-mono font-bold text-white/80">
            {temperature.toFixed(2)} — {temperature < 0.4 ? "Strict & Factual" : temperature < 0.8 ? "Balanced (Recommended)" : "Creative & Expressive"}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={temperature}
          onChange={(e) => setTemperature(parseFloat(e.target.value))}
          className="w-full accent-primary h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-[9px] uppercase tracking-widest text-white/20 font-mono">
          <span>0.0 Precise</span>
          <span>0.7 Default</span>
          <span>1.0 Creative</span>
        </div>
      </div>

      {/* Status Messages */}
      {statusMsg && (
        <div
          className={`p-3 rounded-xl text-xs font-mono border ${
            statusMsg.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
              : "bg-rose-500/10 border-rose-500/20 text-rose-400"
          }`}
        >
          {statusMsg.text}
        </div>
      )}

      {/* Submit Button */}
      <div className="flex items-center justify-end pt-4 border-t border-white/5">
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest bg-white text-black hover:bg-neutral-200 transition-all duration-300 disabled:opacity-50 cursor-pointer flex items-center gap-2"
        >
          {isPending && <Spinner className="w-3.5 h-3.5 text-black" />}
          <span>{isPending ? "Saving..." : "Save AI Settings"}</span>
        </button>
      </div>
    </form>
  );
}
