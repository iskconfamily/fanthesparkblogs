import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useLocation } from "@tanstack/react-router";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { submitContact } from "@/lib/contact.functions";

export const CONTACT_CATEGORIES = [
  "Next Steps",
  "Small Groups",
  "Spiritual Retreat",
  "Volunteer",
  "Donation",
  "Wisdom / Dhamesvara",
  "Spiritual Fitness",
  "Mantra",
  "Events",
  "Terms & Privacy",
  "Others",
] as const;

const clientSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(100),
  email: z.string().trim().email("Please enter a valid email").max(255),
  category: z.string().min(1, "Please choose a category"),
  message: z.string().trim().min(1, "Please write a short message").max(1000),
  consent: z.literal(true, { errorMap: () => ({ message: "Please accept to continue" }) }),
});

type FieldErrors = Partial<Record<"name" | "email" | "category" | "message" | "consent", string>>;

interface ContactSectionProps {
  title?: string;
  defaultCategory?: string;
  className?: string;
}

export function ContactSection({
  title = "Serving All Areas of Life",
  defaultCategory,
  className,
}: ContactSectionProps) {
  const submit = useServerFn(submitContact);
  const location = useLocation();
  const formLoadedAtRef = useRef<number>(Date.now());

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState(defaultCategory ?? "");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState(""); // honeypot
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    formLoadedAtRef.current = Date.now();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = clientSchema.safeParse({ name, email, category, message, consent });
    if (!parsed.success) {
      const fieldErrors: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof FieldErrors;
        if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      const result = await submit({
        data: {
          ...parsed.data,
          pagePath: location.pathname,
          formLoadedAt: formLoadedAtRef.current,
          website,
        },
      });
      if (result.ok) {
        toast.success("Thank you — your message has been sent.");
        setName("");
        setEmail("");
        setCategory(defaultCategory ?? "");
        setMessage("");
        setConsent(false);
      } else {
        toast.error(result.error ?? "Could not send message. Please try again.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const fieldClass =
    "h-12 rounded-md border border-input bg-background px-4 text-base focus-visible:ring-2 focus-visible:ring-primary/40";

  return (
    <section
      className={className}
      style={{ backgroundColor: "var(--background)" }}
    >
      <div className="mx-auto max-w-[640px] px-6 py-16 sm:py-24">
        {/* Eyebrow */}
        <p
          className="text-center mb-4"
          style={{
            fontFamily: "var(--font-meta)",
            fontSize: 12,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "var(--brand-olive)",
          }}
        >
          {title}
        </p>

        {/* Three orange dots */}
        <div className="flex justify-center gap-2 mb-8" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="block rounded-full"
              style={{ width: 6, height: 6, backgroundColor: "var(--primary)" }}
            />
          ))}
        </div>

        {/* Intro copy */}
        <div
          className="text-center mb-10 space-y-4"
          style={{
            fontFamily: "var(--font-serif-display)",
            fontSize: "clamp(18px, 2.2vw, 22px)",
            lineHeight: 1.55,
            color: "var(--foreground)",
          }}
        >
          <p>
            For over four decades, Vaisesika Dasa has guided seekers on the path of bhakti-yoga —
            offering wisdom that touches every part of daily life.
          </p>
          <p style={{ fontStyle: "italic" }}>Ask Vaisesika Dasa.</p>
          <p style={{ fontSize: "0.85em", color: "var(--muted-foreground)" }}>
            Share what's on your mind — questions about practice, retreats, volunteering, or
            anything else.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {/* Honeypot — invisible to humans */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              left: "-10000px",
              width: 1,
              height: 1,
              overflow: "hidden",
            }}
          >
            <label>
              Website
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </label>
          </div>

          <div>
            <Label htmlFor="contact-name" className="sr-only">Name</Label>
            <Input
              id="contact-name"
              type="text"
              placeholder="Name"
              autoComplete="name"
              maxLength={100}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={fieldClass}
              aria-invalid={!!errors.name}
            />
            {errors.name && <p className="mt-1 text-sm text-destructive">{errors.name}</p>}
          </div>

          <div>
            <Label htmlFor="contact-email" className="sr-only">Email</Label>
            <Input
              id="contact-email"
              type="email"
              placeholder="Email"
              autoComplete="email"
              maxLength={255}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={fieldClass}
              aria-invalid={!!errors.email}
            />
            {errors.email && <p className="mt-1 text-sm text-destructive">{errors.email}</p>}
          </div>

          <div>
            <Label htmlFor="contact-category" className="sr-only">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger
                id="contact-category"
                className={fieldClass}
                aria-invalid={!!errors.category}
              >
                <SelectValue placeholder="Choose a category" />
              </SelectTrigger>
              <SelectContent>
                {CONTACT_CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="mt-1 text-sm text-destructive">{errors.category}</p>
            )}
          </div>

          <div className="flex items-start gap-3 pt-1">
            <Checkbox
              id="contact-consent"
              checked={consent}
              onCheckedChange={(v) => setConsent(v === true)}
              aria-invalid={!!errors.consent}
              className="mt-1"
            />
            <Label
              htmlFor="contact-consent"
              className="text-sm font-normal leading-relaxed cursor-pointer"
              style={{ color: "var(--muted-foreground)" }}
            >
              I have read and agree to the{" "}
              <a
                href="/terms"
                className="underline"
                style={{ color: "var(--foreground)" }}
              >
                Terms &amp; Privacy
              </a>
              .
            </Label>
          </div>
          {errors.consent && <p className="text-sm text-destructive">{errors.consent}</p>}

          <div>
            <Label htmlFor="contact-message" className="sr-only">Message</Label>
            <Textarea
              id="contact-message"
              placeholder="Your message"
              rows={6}
              maxLength={1000}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="rounded-md border border-input bg-background px-4 py-3 text-base focus-visible:ring-2 focus-visible:ring-primary/40 resize-y min-h-[140px]"
              aria-invalid={!!errors.message}
            />
            {errors.message && <p className="mt-1 text-sm text-destructive">{errors.message}</p>}
          </div>

          <Button
            type="submit"
            disabled={submitting}
            className="w-full h-12 text-sm uppercase tracking-[0.28em]"
            style={{
              fontFamily: "var(--font-meta)",
              backgroundColor: "var(--primary)",
              color: "var(--primary-foreground)",
            }}
          >
            {submitting ? "Sending…" : "Send"}
          </Button>
        </form>
      </div>
    </section>
  );
}
