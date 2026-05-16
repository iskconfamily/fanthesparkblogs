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

type SourceType = "url" | "file" | "notes";

export function AiWizard({ onApply }: { onApply: (draft: AiDraft) => void }) {
  const extract = useServerFn(extractFromUrl);
  const generate = useServerFn(generateBlogFromSource);

  const [step, setStep] = useState<1 | 2>(1);
  const [sourceType, setSourceType] = useState<SourceType>("notes");
  const [url, setUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [fileText, setFileText] = useState("");
  const [fileName, setFileName] = useState("");

  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");

  const sourceText = (() => {
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
        finalText = `${ex.title ? `${ex.title}\n\n` : ""}${ex.text}`;
        label = `URL: ${url}`;
      } else if (sourceType === "file") {
        label = `File: ${fileName}`;
      } else {
        label = "Pasted notes";
      }

      setBusy("Formatting (preserving exact wording)…");
      const draft = await generate({
        data: { sourceType, sourceText: finalText, sourceLabel: label },
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
            Step {step} of 2 · {step === 1 ? "Source" : "Format"} · Wording is
            preserved exactly — AI only formats and generates metadata.
          </p>
        </div>
        <div className="flex items-center gap-1">
          {[1, 2].map((n) => (
            <span
              key={n}
              className={`h-1.5 w-8 rounded ${step >= n ? "bg-primary" : "bg-border"}`}
            />
          ))}
        </div>
      </div>

      {step === 1 && (
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            {(
              [
                ["url", "URL"],
                ["file", "Upload file"],
                ["notes", "Paste text"],
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

          {sourceType === "url" && (
            <Input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/article-to-import"
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
                Plain text / markdown / HTML. For PDF or Word, open the file,
                copy the text, and paste it into the “Paste text” tab.
              </p>
            </div>
          )}
          {sourceType === "notes" && (
            <Textarea
              rows={10}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Paste the full blog text here. Every word will be preserved exactly."
            />
          )}

          <div className="flex justify-end">
            <Button size="sm" onClick={() => setStep(2)} disabled={!canContinue}>
              Next: Format
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-3">
          <div className="rounded border border-border bg-background p-3 text-sm space-y-2">
            <p className="font-medium">The assistant will only:</p>
            <ul className="list-disc pl-5 text-muted-foreground text-xs space-y-1">
              <li>Add paragraph spacing and section headings where natural</li>
              <li>Mark quoted passages as blockquotes</li>
              <li>Suggest inline image placements (you generate the images)</li>
              <li>Generate title, excerpt, tags, category, SEO meta, featured image prompt</li>
            </ul>
            <p className="font-medium pt-1">It will NOT:</p>
            <ul className="list-disc pl-5 text-muted-foreground text-xs space-y-1">
              <li>Rewrite, paraphrase, summarize, shorten, expand, or change tone</li>
              <li>Add or remove sentences from the body</li>
            </ul>
            <p className="text-xs text-muted-foreground pt-1">
              Saved as <strong>draft</strong> — nothing is published.
            </p>
          </div>
          <div className="flex justify-between items-center">
            <Button size="sm" variant="outline" onClick={() => setStep(1)} disabled={!!busy}>
              Back
            </Button>
            <Button size="sm" onClick={runGenerate} disabled={!!busy || !canContinue}>
              {busy ?? "Format & Generate Metadata"}
            </Button>
          </div>
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
