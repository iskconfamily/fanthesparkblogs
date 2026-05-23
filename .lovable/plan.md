## Reusable Contact Section + Spam Protection

### 1. Component: `src/components/contact-section.tsx`
Reusable, mobile-first section matching the attached screenshots.

- Eyebrow "Serving All Areas of Life" (olive token) with three orange-dot divider
- Lead intro + "Ask Vaisesika Dasa." emphasis + supporting copy
- Form fields (all using shadcn `Input`/`Textarea`/`Select` with identical border, radius, height, and focus ring so Name and Email look visually consistent):
  - Name (1–100 chars)
  - Email (valid, ≤255)
  - Category dropdown (12 options: Next Steps, Small Groups, Spiritual Retreat, Volunteer, Donation, Wisdom/Dhamesvara, Spiritual Fitness, Mantra, Events, Terms & Privacy, Others)
  - Consent checkbox (links to `/terms`)
  - Message textarea (1–1000)
  - Full-width orange "SEND" button
- Zod validation, inline errors, `sonner` toast on success/failure
- Cream/off-white background, centered container (~640px desktop)
- Props: `title?`, `defaultCategory?`, `className?` so other pages can preset the dropdown

### 2. Backend (Lovable Cloud)
- New table `public.contact_submissions`: `name`, `email`, `category`, `message`, `consent`, `page_path`, `ip_address`, `user_agent`
- RLS: public INSERT allowed; SELECT restricted to admins via existing `has_role`
- `createServerFn` `submitContact` in `src/lib/contact.functions.ts` using `supabaseAdmin`, server-side Zod re-validation

### 3. Spam protection (no external keys, no cost)
- **Honeypot field** — hidden `website` input; if filled, server returns success but discards the submission (silent reject)
- **Time-trap** — client sends a `formLoadedAt` timestamp; server rejects if submission arrives <2s after mount
- **Per-IP throttle** — server reads requester IP via TanStack `getRequestIP`, counts inserts from same IP in last 10 minutes; if ≥3, reject with friendly "please try again later" toast
- IP and user-agent stored on each row to support future moderation

### 4. Integration
- Mount `<ContactSection />` as the final section of `src/routes/my-story.tsx`, before footer
- No other content changes on /my-story

### Out of scope (follow-ups)
- Email notifications to user/admin
- Admin UI to view submissions
- Mounting on other pages (component is built reusable — drop-in later)
- Cloudflare Turnstile (can add later if spam still gets through)
