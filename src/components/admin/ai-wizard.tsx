import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { extractFromUrl, generateBlogFromSource } from "@/lib/admin.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export type AiDraft = {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  seo_title: string;
  seo_description: string;
  image_prompts: { prompt: string; alt?: string; url?: string }[];
};

type SourceType = "topic" | "url" | "file" | "notes";

export function AiWizard({ onApply }: { onApply: (draft: AiDraft) => void }) {
  const extract = useServerFn(extractFromUrl);
  const generate = useServerFn(generateBlogFromSource);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [sourceType, setSourceType] = useState<SourceType>("topic");
  const [topic, setTopic] = useState("");
  const [url, setUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [fileText, setFileText] = useState("");
  const [fileName, setFileName] = useState("");

  const [tone, setTone] = useState("reflective, literary, spiritual");
  const [length, setLength] = useState<"short" | "medium" | "long">("medium");

  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");

  const sourceText = (() => {
    if (sourceType === "topic") return topic;
    if (sourceType === "url") return url;
    if (sourceType === "notes") return notes;
    return fileText;
  })();

  const canContinue = sourceText.trim().length > 2;

  const handleFile = async (file: File) => {
    setFileName(file.name);
    if (file.size > 1_500_000) {
      setError("File too large (max 1.5MB of text). Paste an excerpt instead.");
      return;
    }
    setError("");
    const text = await file.text();
    setFileText(text);
  };

  const runGenerate = async () => {
    setBusy("Reading source…");
    setError("");
    try {
      let finalText = sourceText;
      let label: string = sourceType;

      if (sourceType === "url") {
        setBusy("Fetching article…");
        const ex = await extract({ data: { url } });
        finalText = `${ex.title ? `Original title: ${ex.title}\n\n` : ""}${ex.text}`;
        label = `URL: ${url}`;
      } else if (sourceType === "file") {
        label = `File: ${fileName}`;
      } else if (sourceType === "topic") {
        label = "Topic / instructions";
      } else {
        label = "Pasted notes";
      }

      setBusy("Drafting with AI…");
      const draft = await generate({
        data: {
          sourceType,
          sourceText: finalText,
          sourceLabel: label,
          tone,
          length,
        },
      });
      onApply(draft);
      setBusy(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Generation failed");
      setBusy(null);
    }
  };

  return (
    <div className="border border-border rounded-md p-5 bg-muted/30 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2
            className="text-xl italic"
            style={{ fontFamily: "var(--font-serif-display)" }}
          >
            AI Blog Assistant
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Step {step} of 3 ·{" "}
            {step === 1 ? "Source" : step === 2 ? "Style" : "Generate"}
          </p>
        </div>
        <div className="flex items-center gap-1">
          {[1, 2, 3].map((n) => (
            <span
              key={n}
              className={`h-1.5 w-8 rounded ${step >= n ? "bg-primary" : "bg-border"}`}
            />
          ))}
        </div>
      </div>

      {step === 1 && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(
              [
                ["topic", "Topic"],
                ["url", "URL"],
                ["file", "Upload file"],
                ["notes", "Paste notes"],
              ] as const
            ).map(([k, label]) => (
              <button
                key={k}
                type="button"
                onClick={() => setSourceType(k)}
                className={`text-sm py-2 rounded border transition-colors ${
                  sourceType === k
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border bg-background text-muted-foreground hover:text-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {sourceType === "topic" && (
            <Textarea
              rows={5}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. The bhakti meaning of patience in daily work — draw on Bhagavatam if useful."
            />
          )}
          {sourceType === "url" && (
            <Input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/article-to-adapt"
            />
          )}
          {sourceType === "file" && (
            <div className="space-y-2">
              <input
                type="file"
                accept=".txt,.md,.html,.htm,text/*"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                className="text-sm"
              />
              {fileName && (
                <p className="text-xs text-muted-foreground">
                  Loaded: {fileName} ({fileText.length.toLocaleString()} chars)
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Plain text / markdown / HTML. For PDFs, copy the text and use “Paste notes”.
              </p>
            </div>
          )}
          {sourceType === "notes" && (
            <Textarea
              rows={8}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Paste raw notes, quotes, an outline, journal fragments…"
            />
          )}

          <div className="flex justify-end">
            <Button
              size="sm"
              onClick={() => setStep(2)}
              disabled={!canContinue}
            >
              Next: Style
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-3">
          <div>
            <label className="text-xs uppercase tracking-wide text-muted-foreground">
              Tone
            </label>
            <Input value={tone} onChange={(e) => setTone(e.target.value)} />
            <p className="text-[11px] text-muted-foreground mt-1">
              Style is matched to existing site voice automatically.
            </p>
          </div>
          <div>
            <label className="text-xs uppercase tracking-wide text-muted-foreground">
              Length
            </label>
            <div className="grid grid-cols-3 gap-2 mt-1">
              {(["short", "medium", "long"] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLength(l)}
                  className={`text-sm py-2 rounded border capitalize ${
                    length === l
                      ? "border-primary bg-primary/10"
                      : "border-border bg-background text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-between">
            <Button size="sm" variant="outline" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button size="sm" onClick={() => setStep(3)}>
              Next: Generate
            </Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            AI will draft a full post: title, excerpt, body, category, tags, SEO meta,
            and image prompts. Saved as <strong>draft</strong> — nothing is published.
          </p>
          <div className="flex justify-between items-center">
            <Button size="sm" variant="outline" onClick={() => setStep(2)} disabled={!!busy}>
              Back
            </Button>
            <Button size="sm" onClick={runGenerate} disabled={!!busy || !canContinue}>
              {busy ?? "Generate Blog Draft"}
            </Button>
          </div>
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
      {busy && step !== 3 && <p className="text-sm text-muted-foreground">{busy}</p>}
    </div>
  );
}
