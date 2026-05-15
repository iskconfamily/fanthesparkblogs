import postKhatvanga from "@/assets/post-khatvanga.jpg";
import postSenses from "@/assets/post-senses.jpg";
import postAtma from "@/assets/post-atma.jpg";

export type ArticleBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "quote"; text: string; cite?: string }
  | { type: "figure"; src: string; alt: string; caption?: string };

export type Post = {
  slug: string;
  title: string;
  subtitle?: string;
  category: string;
  tags: string[];
  date: string;
  excerpt: string;
  featuredImage: { src: string; alt: string; caption?: string };
  /** How the featured image appears on the home feed: a full-width hero, a smaller side image, or none. */
  imageLayout?: "hero" | "side" | "none";
  body: ArticleBlock[];
  relatedSlugs?: string[];
};

/** Canonical taxonomy of categories/tags used across the site. */
export const TAGS = [
  "Bhakti Notes",
  "Career & Business",
  "FAQ",
  "Health & Vitality",
  "Intelligent Inquiries",
  "Leadership & Impact",
  "Mantra Meditation",
  "Mind & Meaning",
  "Practice Resources",
  "Productivity & Performance",
  "Relationships",
  "Spiritual Fitness",
  "Wealth & Lifestyle",
  "Wisdom",
] as const;

export const tagSlug = (label: string) =>
  label
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const tagFromSlug = (slug: string): string | undefined =>
  TAGS.find((t) => tagSlug(t) === slug);

export const posts: Post[] = [
  {
    slug: "the-khatvanga-moment",
    title: "The Khatvanga Moment",
    subtitle:
      "On the bhakti teaching that one sincere instant is enough — and why this is not a license to wait.",
    category: "Bhakti Notes",
    tags: ["Bhakti Notes", "Wisdom", "Mind & Meaning"],
    date: "2026-05-10",
    excerpt:
      "Measured by geological time, our lifespans are not even a nanosecond. Yet the bhakti scriptures insist this brief flicker is enough for anyone to attain spiritual perfection — provided we do not wait.",
    featuredImage: {
      src: postKhatvanga,
      alt: "A drop of dew on a tulasi leaf, lit from behind by morning light.",
      caption: "Dawn on a tulasi leaf — a single instant, fully inhabited.",
    },
    body: [
      { type: "p", text: "We humans have very short lives. Measured by geological time, our lifespans are not even a nanosecond. Nonetheless, the bhakti scriptures say that this brief period is enough for anyone to attain spiritual perfection. What is more, they reprove as irresponsible and miserly those who do not utilize their lives to attain such perfection. Having so much at stake with so little time may seem daunting." },
      { type: "p", text: "To inspire us, Sukadeva Goswami tells us in Srimad-Bhagavatam the story of Maharaja Khatvanga, who perfected his life within an instant. Srila Prabhupada summarizes Khatvanga's achievement plainly:" },
      { type: "quote", text: "King Khatvanga went to assist the demigods, and he was rewarded. When asked what he wanted, he replied, 'I want to know how long I shall live.' 'Not very long,' they said. 'A second.' He at once transferred his thoughts to Krishna and surrendered.", cite: "Srila Prabhupada, Back to Godhead Magazine #45" },
      { type: "h2", text: "Not a license to wait" },
      { type: "p", text: "Maharaja Khatvanga's story is not meant to encourage procrastination. I can almost hear the convenient misreading: oh, this means I can do as I wish throughout my life and at the last moment remember Krishna. But Krishna and the great teachers of bhakti never encourage us to delay our spiritual practices in this way." },
      { type: "p", text: "On the contrary, Sri Sukadeva tells us this story so that we may make each moment of our lives a Khatvanga moment. Though our lives are fleeting, they are made up of a series of moments — any one of which we may use to attain the supreme perfection of life by taking shelter of Krishna." },
      { type: "h2", text: "What seriousness actually does" },
      { type: "p", text: "Srila Prabhupada confirms this idea with a sentence worth keeping near the door of one's attention:" },
      { type: "quote", text: "Devotional service is not a material process — it is spiritual. It involves no impediments of material conditioning. It develops in proportion to one's seriousness; we can attain the whole thing in one second. If we sincerely take Krishna consciousness, we have it.", cite: "Srila Prabhupada (ibid.)" },
      { type: "p", text: "The instruction is exact and merciful at once. The door is always open. The hour need not be long. What is asked of us is only the willingness, this moment, to step quietly through it." },
    ],
    relatedSlugs: ["the-quiet-discipline-of-the-senses", "you-are-an-atma"],
  },
  {
    slug: "the-quiet-discipline-of-the-senses",
    title: "The Quiet Discipline of the Senses",
    subtitle: "A note from Denver, Colorado, on what bhakti yogis are doing while the world is busy doing something else.",
    category: "Spiritual Fitness",
    tags: ["Spiritual Fitness", "Mantra Meditation", "Practice Resources"],
    date: "2026-04-28",
    excerpt:
      "Bhakti yogis carefully control their senses and minds — not by force, but by giving them something better to do: service to Krishna and Krishna's devotees.",
    featuredImage: {
      src: postSenses,
      alt: "A small brass lamp burning on a woven mat in an empty room at dawn.",
      caption: "A small lamp in a quiet room, Denver, Colorado.",
    },
    body: [
      { type: "p", text: "Bhakti yogis carefully control their senses and minds by engaging them in service to Krishna and Krishna's devotees. The control is not the white-knuckle restraint we tend to imagine when we hear the word discipline. It is, instead, the quieter and more lasting work of giving the senses something better to do." },
      { type: "quote", text: "Thus practicing constant control of the body, mind and activities, the mystic transcendentalist, his mind regulated, attains to the kingdom of God by cessation of material existence.", cite: "Bhagavad-gita 6.15" },
      { type: "h2", text: "Constant, not occasional" },
      { type: "p", text: "The Gita's word is constant. Not heroic, not occasional, not reserved for the dramatic morning. The senses are practiced the way a musician practices scales — daily, gently, without spectacle. The mind, after long enough, learns the new song." },
      { type: "p", text: "And so the small interior weather of the practitioner begins to change. The room of the chest, once crowded, becomes a room one can return to. The senses, once scattered, begin to point in the same direction — toward the holy name, toward the service at hand, toward the next quiet hour." },
      { type: "p", text: "There is no spectacle in this. There is only, slowly, a life that has become its own steady practice." },
    ],
    relatedSlugs: ["the-khatvanga-moment", "you-are-an-atma"],
  },
  {
    slug: "you-are-an-atma",
    title: "You Are an Atma",
    subtitle: "A short reminder, offered with affection, about what cannot be cut, burned, or drowned.",
    category: "Intelligent Inquiries",
    tags: ["Intelligent Inquiries", "Wisdom", "Mind & Meaning"],
    date: "2026-04-12",
    excerpt:
      "You are an atma, a spiritual entity that has nothing at all to do with this material world. You cannot be killed, cut, burned, or drowned. You are eternal. Feel better now?",
    featuredImage: {
      src: postAtma,
      alt: "A luminous point of light surrounded by soft golden mist and distant stars.",
      caption: "A luminous point in the long evening of the cosmos.",
    },
    body: [
      { type: "p", text: "You are an atma, a spiritual entity that has nothing at all to do with this material world. You cannot be killed, cut, burned, or drowned. You are eternal." },
      { type: "p", text: "Feel better now?" },
      { type: "h2", text: "Finer than intelligence" },
      { type: "quote", text: "Finer than intelligence is the soul, which is not matter like mind and intelligence but is spirit, or antimatter. The soul is hundreds of thousands of times finer and more powerful than intelligence.", cite: "Sri Caitanya-caritamrta, Adi 5.22, purport" },
      { type: "p", text: "We forget this most of the time, and the forgetting is itself a kind of weather we live inside. The reminder, when it arrives — in a verse, in a teacher's sentence, in the small clearing of an unhurried morning — does not add anything new. It only restores what was already, quietly, the case." },
      { type: "p", text: "Om Tat Sat." },
    ],
    relatedSlugs: ["the-khatvanga-moment", "the-quiet-discipline-of-the-senses"],
  },
];
