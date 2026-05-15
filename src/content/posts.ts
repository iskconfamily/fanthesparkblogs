import postKhatvanga from "@/assets/post-khatvanga.jpg";
import postSenses from "@/assets/post-senses.jpg";
import postAtma from "@/assets/post-atma.jpg";
import postFaq from "@/assets/post-faq.jpg";
import postStress from "@/assets/post-stress.jpg";
import postBird from "@/assets/post-bird.jpg";
import postSunshine from "@/assets/post-sunshine.jpg";
import postGratitude from "@/assets/post-gratitude.jpg";
import postWholy from "@/assets/post-wholy.jpg";
import postWater from "@/assets/post-water.jpg";
import postRabbits from "@/assets/post-rabbits.jpg";
import postPreparation from "@/assets/post-preparation.jpg";
import postServe from "@/assets/post-serve.jpg";

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
  author?: string;
  /** Original source the essay was adapted from. */
  sourceUrl?: string;
  excerpt: string;
  featuredImage: { src: string; alt: string; caption?: string };
  imageLayout?: "hero" | "side" | "none";
  body: ArticleBlock[];
  relatedSlugs?: string[];
};

export const TAGS = [
  "Bhakti Notes",
  "Books",
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

const VAISESIKA = "Vaisesika Dasa";

export const posts: Post[] = [
  {
    slug: "the-khatvanga-moment",
    title: "The Khatvanga Moment",
    subtitle:
      "On the bhakti teaching that one sincere instant is enough — and why this is not a license to wait.",
    category: "Bhakti Notes",
    tags: ["Bhakti Notes", "Wisdom", "Mind & Meaning"],
    date: "2026-05-10",
    author: VAISESIKA,
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
    author: VAISESIKA,
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
    imageLayout: "side",
    relatedSlugs: ["the-khatvanga-moment", "you-are-an-atma"],
  },
  {
    slug: "you-are-an-atma",
    title: "You Are an Atma",
    subtitle: "A short reminder, offered with affection, about what cannot be cut, burned, or drowned.",
    category: "Intelligent Inquiries",
    tags: ["Intelligent Inquiries", "Wisdom", "Mind & Meaning"],
    date: "2026-04-12",
    author: VAISESIKA,
    sourceUrl: "https://fanthespark.com/wisdom/blog/you-are-antimatter/",
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
    imageLayout: "none",
    relatedSlugs: ["the-khatvanga-moment", "the-quiet-discipline-of-the-senses"],
  },

  // ---- New posts adapted from fanthespark.com (paraphrased reflections; sourceUrl points to the original) ----

  {
    slug: "stress-to-serenity",
    title: "From Stress to Serenity",
    subtitle: "On the mind as a kind of software, and meditation as the program that keeps it clean.",
    category: "Mantra Meditation",
    tags: ["Mantra Meditation", "Health & Vitality", "Mind & Meaning"],
    date: "2026-03-30",
    author: VAISESIKA,
    sourceUrl: "https://fanthespark.com/wisdom/blog/want-to-change-stress-to-serenity-read-this/",
    excerpt:
      "The Yoga Sutras describe the mind much the way an engineer describes software — and the impressions our senses absorb each day, the vrittis, behave a great deal like viruses.",
    featuredImage: {
      src: postStress,
      alt: "A person seated cross-legged at dawn beside a softly glowing oil lamp.",
      caption: "Early morning, beside a small lamp.",
    },
    body: [
      { type: "p", text: "Once, while working on a deadline, my computer caught a small persistent virus. The same alert kept reappearing, no matter how many times I dismissed it. Eventually a friend who knew the system walked me through running the right cleanup program, and the machine returned to itself." },
      { type: "p", text: "The Yoga Sutras describe the mind in terms not so different from those a computer engineer might use. The impressions we absorb through our senses — the vrittis — settle in the mind the way small viruses settle in software. Left alone, they begin to disturb the system. We call the result anxiety." },
      { type: "h2", text: "The mantra as a clearing program" },
      { type: "p", text: "Mantra meditation, in this image, is the cleanup. The holy name, repeated patiently, does not so much wrestle the mind into stillness as gently sweep its accumulated noise. What remains is the calmer field that was always underneath." },
      { type: "quote", text: "We are not upset about what happens to us; rather, we are upset about what we think is happening to us.", cite: "Epictetus" },
      { type: "p", text: "Studies suggest that nearly half of adults in the West live with high levels of stress, much of it tied to work and money — and stress, untreated, gradually unravels both health and the simple ability to enjoy a day. Mantra meditation will not change the conditions of one's life overnight. But it will, slowly, change the room from which those conditions are met. That is its first quiet gift." },
      { type: "p", text: "Adapted from a reflection by Vaisesika Dasa." },
    ],
    relatedSlugs: ["the-quiet-discipline-of-the-senses", "cultivate-gratitude"],
  },

  {
    slug: "is-the-world-working-against-you",
    title: "Is the World Working Against You?",
    subtitle: "A small bird flies into a kitchen, and a long-held suspicion about life is gently overturned.",
    category: "Wisdom",
    tags: ["Wisdom", "Mind & Meaning", "Bhakti Notes"],
    date: "2026-03-18",
    author: VAISESIKA,
    sourceUrl: "https://fanthespark.com/wisdom/blog/is-the-world-working-against-you/",
    excerpt:
      "A small wild bird, frightened by a much larger figure trying to set it free, becomes — for a quiet hour at the kitchen table — a strangely accurate portrait of the soul.",
    featuredImage: {
      src: postBird,
      alt: "A small sparrow flying out of an open kitchen window into golden afternoon light.",
      caption: "Afternoon light through a kitchen window.",
    },
    imageLayout: "side",
    body: [
      { type: "p", text: "One afternoon, while working in the back garden, I noticed a small wild bird had flown in through an open door and become trapped inside the house. Birds do not belong indoors, and I went in straightaway to set it free." },
      { type: "p", text: "Whatever room I entered, I opened the windows wide. But each window made its small rattling sound, and the bird, terrified by it, fled into the next room ahead of me. I followed gently, speaking softly, closing doors behind me — and still, in its eyes, I was a giant whose only intention was harm." },
      { type: "p", text: "Eventually, finding a single open window, the bird escaped. Just before it disappeared, it gave me one last frightened look, as if to say: I survived your cruelty." },
      { type: "h2", text: "An unfamiliar mirror" },
      { type: "p", text: "Sitting at the kitchen table afterward, the obvious comparison arrived. I am the bird. Some larger, gentler intelligence is constantly trying to help me toward the open window — and I, in my smaller view, mostly read its arrangements as misfortune, as injustice, as proof that the world is against me." },
      { type: "p", text: "The Srimad-Bhagavatam suggests that this misreading is itself the trouble. Whatever appears in our lives is, in some final sense, meant for our good — a kind of cosmic sensitivity training, fitted to us with care. To live as if this were true is not to deny pain. It is only to relax, a little, the long-held suspicion that life is an ambush — and to begin, slowly, to feel grateful even for the difficult hours." },
      { type: "p", text: "Adapted from a reflection by Vaisesika Dasa." },
    ],
    relatedSlugs: ["cultivate-gratitude", "stress-to-serenity"],
  },

  {
    slug: "sunshine-energy-in-unlimited-flavors",
    title: "Sunshine Energy in Unlimited Flavors",
    subtitle: "A small note from a kitchen table about the quiet generosity of food.",
    category: "Wisdom",
    tags: ["Wisdom", "Health & Vitality", "Bhakti Notes"],
    date: "2026-03-04",
    author: VAISESIKA,
    sourceUrl: "https://fanthespark.com/wisdom/blog/sunshine-energy-in-unlimited-flavors/",
    excerpt:
      "All our food is, in the end, sunlight rearranged. The world could have given us one fruit. It gave us thousands.",
    featuredImage: {
      src: postSunshine,
      alt: "A still life of avocados, figs, kale and pomegranates in soft sunlight.",
      caption: "Avocados, figs, kale, pomegranates — sunlight in many costumes.",
    },
    body: [
      { type: "p", text: "All our food, in the end, is sunlight that has been gathered up by the green leaves of plants and rearranged into something a body can take in. If the system had been built only for survival, one fruit and one vegetable would have been enough." },
      { type: "p", text: "Instead, the world hands us thousands. Avocados, figs, mangoes, kale, peas, pomegranates, the whole long catalogue — each with its own taste, its own colour, its own season. None of this was strictly necessary. It was given, it seems, simply as a kindness." },
      { type: "p", text: "To notice this, even briefly, is itself a small spiritual act. Gratitude, the bhakti tradition suggests, begins right here, at the table, with whatever is in the bowl in front of us." },
      { type: "p", text: "Om Tat Sat. Adapted from a reflection by Vaisesika Dasa." },
    ],
    imageLayout: "hero",
    relatedSlugs: ["cultivate-gratitude", "are-you-wholy"],
  },

  {
    slug: "cultivate-gratitude",
    title: "Cultivate Gratitude",
    subtitle: "Greed has only one mantra. Gratitude has a longer one, and a quieter voice.",
    category: "Wisdom",
    tags: ["Wisdom", "Mind & Meaning", "Practice Resources"],
    date: "2026-02-22",
    author: VAISESIKA,
    sourceUrl: "https://fanthespark.com/wisdom/blog/cultivate-gratitude/",
    excerpt:
      "Greed, whatever you give it, has only one word for you: more. Gratitude is the divine quality that turns toward whatever was given and quietly returns the kindness.",
    featuredImage: {
      src: postGratitude,
      alt: "Two cupped hands holding marigold petals in soft light.",
      caption: "An offering of marigolds.",
    },
    body: [
      { type: "p", text: "Greed has a very short vocabulary. Whatever you offer it, its single response is the same: more. It does not know how to say thank you, because it cannot afford to. Gratitude is its quieter opposite — a divine quality, the tradition says, marked by a readiness to notice what was given and to return some kindness in turn." },
      { type: "h2", text: "Bhakti as the practice of thanks" },
      { type: "p", text: "The whole of bhakti yoga can be read as a long, patient cultivation of this one quality. Each chant, each offering, each small attention given to the holy name, is a way of saying — this was given to me, and I am noticing." },
      { type: "quote", text: "When human society is grateful to the Lord for all His gifts for the maintenance of the living entities, then there is certainly no scarcity or want in society. But when men are unaware of the intrinsic value of such gifts from the Lord, surely they are in want.", cite: "Srimad-Bhagavatam 3.5.49" },
      { type: "p", text: "Want, in this reading, is less a condition of the world than a condition of attention. The cure begins where attention turns. Om Tat Sat. Adapted from a reflection by Vaisesika Dasa." },
    ],
    relatedSlugs: ["sunshine-energy-in-unlimited-flavors", "is-the-world-working-against-you"],
  },

  {
    slug: "are-you-wholy",
    title: "Are You Whole-y?",
    subtitle: "A small etymology of the word holy, and an old idea about what a holiday once was.",
    category: "Wisdom",
    tags: ["Wisdom", "Bhakti Notes"],
    date: "2026-02-10",
    author: VAISESIKA,
    sourceUrl: "https://fanthespark.com/wisdom/blog/are-you-whole-y/",
    excerpt:
      "The word holy is a near-cousin of whole, of healthy, and of an older English word, hale, meaning strong. Holiday is simply a compound: holy + day.",
    featuredImage: {
      src: postWholy,
      alt: "An old wooden door slightly ajar, warm light spilling onto stone steps.",
      caption: "An old door, slightly open.",
    },
    body: [
      { type: "p", text: "The Oxford English Dictionary keeps a quiet record of how the word holy began. It is a near-cousin of whole — as in intact, undivided — and of healthy, and of an older English word, hale, meaning strong. (We still hear it in hale and hearty.) Holiday, then, is simply a compound: holy + day." },
      { type: "p", text: "Originally, a holy day was a day set aside — a festival, a vow, a deliberate stepping out of the usual current. In time, especially in the West, the word loosened into something more like a vacation: chiefly, a day off. Even the religious holidays now often retain only a thin shadow of their first intent." },
      { type: "h2", text: "A whole life" },
      { type: "p", text: "The bhakti tradition would say that holiness is less a calendar event than a quality of attention. To chant the holy names, to hear from Srimad-Bhagavatam, to give some small fruit of one's day toward something larger than oneself — this, in the old sense of the word, is a kind of being whole. Healthy, hale, satisfied, holy. The same single root." },
      { type: "p", text: "Adapted from a reflection by Vaisesika Dasa." },
    ],
    relatedSlugs: ["cultivate-gratitude", "little-more-water-please"],
  },

  {
    slug: "little-more-water-please",
    title: "A Little More Water, Please",
    subtitle: "On a five-percent change in the garden — and what it has to say about a practice.",
    category: "Practice Resources",
    tags: ["Practice Resources", "Spiritual Fitness", "Bhakti Notes"],
    date: "2026-01-28",
    author: VAISESIKA,
    sourceUrl: "https://fanthespark.com/wisdom/blog/little-more-water-please/",
    excerpt:
      "During a long drought, I dialled the garden's automatic watering down. Two months later it was wilted. A five-percent increase brought it back.",
    featuredImage: {
      src: postWater,
      alt: "A small lush garden after rain, water droplets on green leaves and ripening fruit.",
      caption: "A garden, two weeks after the small adjustment.",
    },
    body: [
      { type: "p", text: "Some months ago, during a serious drought, I adjusted the small automatic watering system in our backyard, lowering the volume and the frequency. Within two and a half months the garden had quietly given up — leaves dry, growth stalled, the figs paused mid-effort." },
      { type: "p", text: "Two weeks ago I increased the daily water by five percent. Just five. The garden has begun to perk up: green tips returning, the figs filling out again, even a rose or two emerging from the brown." },
      { type: "h2", text: "The arithmetic of practice" },
      { type: "p", text: "It is hard not to see in this a small parable for spiritual life. A five-percent increase in one's daily bhakti practice — a slightly longer round of chanting, one more chapter heard, a few more minutes given to service — is often enough to revive a wilting taste for it. The change need not be dramatic to be real." },
      { type: "p", text: "The bhakti scriptures advise us, accordingly, to keep a careful eye on our daily intake of devotional water. Not because the soul is fragile, but because attention is. Adapted from a reflection by Vaisesika Dasa." },
    ],
    relatedSlugs: ["the-quiet-discipline-of-the-senses", "two-rabbits"],
  },

  {
    slug: "two-rabbits",
    title: "Two Rabbits",
    subtitle: "An old saying, and what the Gita has to add to it about the architecture of attention.",
    category: "Wisdom",
    tags: ["Wisdom", "Productivity & Performance", "Mind & Meaning"],
    date: "2026-01-14",
    author: VAISESIKA,
    sourceUrl: "https://fanthespark.com/wisdom/blog/two-rabbits/",
    excerpt:
      "If you chase two rabbits, the old saying goes, both will escape. The Gita, in its own register, says nearly the same thing.",
    featuredImage: {
      src: postRabbits,
      alt: "A single narrow path winding through a quiet meadow at dusk.",
      caption: "A single path, at dusk.",
    },
    body: [
      { type: "p", text: "An old proverb has been quietly waiting for us all along: if you chase two rabbits, both will escape. The frustration in this is familiar. To succeed at almost anything, one has to set a single clear goal, and stay with it long enough for the goal to recognise its pursuer." },
      { type: "p", text: "In the Bhagavad-gita, Krishna says something almost identical, in the older register of the spiritual life:" },
      { type: "quote", text: "Those who are on this path are resolute in purpose, and their aim is one. O beloved child of the Kurus, the intelligence of those who are irresolute is many-branched.", cite: "Bhagavad-gita 2.41" },
      { type: "h2", text: "One aim, gently held" },
      { type: "p", text: "Bhakti yogis, knowing Krishna to be the source of everything that pulls at our attention, settle on a single aim — to think of him, and to act in his service. Held this way, the mind is not so much narrowed as gathered. It begins, finally, to do its one good thing." },
      { type: "p", text: "Adapted from a reflection by Vaisesika Dasa." },
    ],
    relatedSlugs: ["our-preparation-leads-us-to-our-destination", "little-more-water-please"],
  },

  {
    slug: "our-preparation-leads-us-to-our-destination",
    title: "Our Preparation Leads Us to Our Destination",
    subtitle: "Three writers, one quiet sentence, and an old instruction about what this life is for.",
    category: "Wisdom",
    tags: ["Wisdom", "Productivity & Performance", "Career & Business"],
    date: "2025-12-30",
    author: VAISESIKA,
    sourceUrl: "https://fanthespark.com/wisdom/blog/our-preparation-leads-us-to-our-destination/",
    excerpt:
      "The verb prepare means: to make something ready for use. Wise people, across very different traditions, keep coming back to it.",
    featuredImage: {
      src: postPreparation,
      alt: "An old worn map with a brass compass and a fountain pen on aged paper.",
      caption: "An old map, a compass, and a pen left on the table.",
    },
    body: [
      { type: "p", text: "The verb prepare means simply: to make something ready for use, or for consideration. It sounds modest. And yet the people who think most carefully about a life keep returning to it." },
      { type: "quote", text: "Opportunity is a haughty goddess who wastes no time with those who are unprepared.", cite: "George Clason" },
      { type: "quote", text: "All things are ready, if our mind be so.", cite: "William Shakespeare" },
      { type: "p", text: "Across centuries and very different vocabularies, the same small claim recurs: our destiny — in this life, and beyond it — is largely shaped by how we prepare for it now." },
      { type: "h2", text: "Or, said more simply" },
      { type: "p", text: "Our preparation leads us to our destination." },
      { type: "p", text: "The bhakti teachers extend the sentence one step further. This short life, they say, is itself a kind of preparation room. Srila Prabhupada writes plainly: by our activities here we either rise or sink, and what we make ready in this body is what we will be carried into in the next. The current hour, in this view, is not background. It is the work." },
      { type: "p", text: "Adapted from a reflection by Vaisesika Dasa." },
    ],
    relatedSlugs: ["two-rabbits", "the-khatvanga-moment"],
  },

  {
    slug: "serve-selflessly-and-be-happy",
    title: "Serve Selflessly and Be Happy",
    subtitle: "Yellow shoes, blue shoes, and the quiet arithmetic by which giving turns out to satisfy more than getting.",
    category: "Wisdom",
    tags: ["Wisdom", "Mind & Meaning", "Relationships"],
    date: "2025-12-15",
    author: VAISESIKA,
    sourceUrl: "https://fanthespark.com/wisdom/blog/serve-selflessly-and-be-happy/",
    excerpt:
      "I went into the shop for one pair of walking shoes. The salesperson held up two boxes — yellow or blue? — and a small, familiar anxiety arrived right on cue.",
    featuredImage: {
      src: postServe,
      alt: "Two hands offering a steaming bowl of food across a wooden table by candlelight.",
      caption: "An ordinary table, an ordinary bowl, an ordinary hour.",
    },
    body: [
      { type: "p", text: "Once, my wife and I stayed at a friend's apartment, where every closet was full of clothes still wearing their price tags, and the spare room held boxes of shoes that had never touched the street. She was, gently, in pursuit of a perfect outfit — convinced that if she could only assemble it, the right kind of joy would arrive on its own." },
      { type: "p", text: "I forgot all about her until, years later, I went into a shop for one pair of walking shoes. The salesperson appeared with two boxes and asked, almost casually, yellow or blue? Within a single second I had said yellow, then blue, then yellow again. On the way home I was still rehearsing the choice. I should have taken the blue." },
      { type: "h2", text: "Looking outside for what is inside" },
      { type: "p", text: "Spiritual beings, dressed for the moment in material bodies, struggle with material choices for as long as we mistake the costume for the wearer. Krishna says it as plainly as possible: the soul puts on new garments, giving up old ones, the way a person puts on new clothes. The shoes in my friend's apartment, and the small panic in mine, are, in that sense, the same kind of search." },
      { type: "h2", text: "The simple secret" },
      { type: "p", text: "Dale Carnegie, writing in another tradition entirely, arrives at the same conclusion as the bhakti texts. The fastest way out of one's own anxiety, he says, is to think of doing something good for someone else. The moment that thought is taken seriously, the small loop of self begins to loosen." },
      { type: "p", text: "Once, as a young monk, I arrived at the lunch hall unusually hungry, only to find that the monk on serving duty had not appeared. I knew it was my turn to step in. I also knew I had wanted very much to sit down. Remembering my teacher's line — selfless service satisfies the soul's hunger — I picked up the ladle and began to serve. The longer I served, the less hungry I became, and the more clearly the room itself seemed to settle." },
      { type: "p", text: "This is what bhakti yoga calls, in its older language, the yoga of love and gratitude. Practiced gently and often, it widens. Adapted from a reflection by Vaisesika Dasa." },
    ],
    relatedSlugs: ["cultivate-gratitude", "is-the-world-working-against-you"],
  },

  {
    slug: "faq-bhakti",
    title: "A Few Quiet Questions, Briefly Answered",
    subtitle: "An informal FAQ — what Krishna consciousness is, where it comes from, and what one actually does.",
    category: "FAQ",
    tags: ["FAQ", "Bhakti Notes", "Practice Resources"],
    date: "2025-12-01",
    author: VAISESIKA,
    sourceUrl: "https://fanthespark.com/wisdom/blog/faq/",
    excerpt:
      "A short, plain-language FAQ for newer readers — the questions that arrive most often, answered without ceremony.",
    featuredImage: {
      src: postFaq,
      alt: "An open antique book on a wooden table, golden morning light over its pages, a small brass bell beside it.",
      caption: "An open book, early in the morning.",
    },
    body: [
      { type: "h2", text: "What is Krishna consciousness?" },
      { type: "p", text: "Krishna is one of the names of God in the Vedic tradition, indicating supreme beauty and an all-attractive nature. Krishna consciousness is, in plain terms, the soul's natural state — quietly absorbed in loving service to that all-attractive source. It is not something added to us from outside; it is what we have always been, momentarily forgotten under the conditions of material life. As one moves a little away from the loud demands of the senses, this older state begins to recover itself, and a more stable kind of happiness becomes possible." },
      { type: "h2", text: "Where does this tradition come from?" },
      { type: "p", text: "Its roots are in the Vedas, among the oldest scriptures of the world. In its present-day form, the path of devotional chanting was given a particular shape by Sri Caitanya Mahaprabhu in Bengal, India, about five hundred years ago. In 1965, A. C. Bhaktivedanta Swami Prabhupada brought the same teaching to the West, and the international community of practice that grew up around him has temples and farms today on every continent." },
      { type: "h2", text: "What are the Vedas?" },
      { type: "p", text: "The Vedas are an extensive body of Sanskrit literature concerning, broadly, the nature of the self, the world, and the divine. They include the four original Vedas, the Upanishads, the great epics like the Mahabharata (which contains the Bhagavad-gita), and the Puranas, of which the Srimad-Bhagavatam is, for bhakti practitioners, the most beloved." },
      { type: "h2", text: "What does a daily practice actually look like?" },
      { type: "p", text: "At its simplest: chanting the Hare Krishna mantra (often on beads), reading a little from the Bhagavad-gita or Srimad-Bhagavatam, eating food that has been offered with care, and giving some small portion of one's day to the welfare of others. The path is not asking for heroic gestures. It is asking for a little, daily, kept up gently over time." },
      { type: "p", text: "Adapted from a reference page by Vaisesika Dasa and the FanTheSpark team." },
    ],
    relatedSlugs: ["the-quiet-discipline-of-the-senses", "stress-to-serenity"],
  },
];
