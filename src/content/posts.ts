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
  body: ArticleBlock[];
  relatedSlugs?: string[];
};

const img = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?w=${w}&auto=format&fit=crop&q=80`;

export const posts: Post[] = [
  {
    slug: "blue-horses-and-the-fourth-sign",
    title: "Blue Horses and the Fourth Sign of the Zodiac",
    subtitle: "On wonder, attention, and the wild interior weather of the soul.",
    category: "Poetry",
    tags: ["poetry", "nature", "philosophy"],
    date: "2026-05-03",
    excerpt:
      "There is a particular blue that arrives in late afternoon at the edge of summer — a blue inside the eyelid, a blue inside the mind — and to notice it is to come briefly and unreasonably alive.",
    featuredImage: {
      src: img("photo-1500382017468-9049fed747ef"),
      alt: "A field at dusk, washed in blue light.",
      caption: "Field at dusk, photographed by an unknown wanderer, 1973.",
    },
    body: [
      { type: "p", text: "There is a particular blue that arrives in late afternoon at the edge of summer — a blue inside the eyelid, a blue inside the mind — and to notice it is to come briefly and unreasonably alive. The painter Franz Marc believed animals were closer than we are to that color: that a horse, looked at long enough, becomes the inner weather of whoever is looking." },
      { type: "p", text: "I have been thinking, lately, about how attention is the rarest and the most ordinary of practices. We are told, often, that life is short. We are told less often that life is also wide — wider than the small rooms of our preoccupations, wider than the calendars in which we file our days." },
      { type: "h2", text: "What the horse sees" },
      { type: "p", text: "The horse, of course, does not see itself as blue. The horse sees the field. The field sees nothing. The seeing is ours. This is the small inheritance and the small burden of being human: that the world, in order to be beheld at all, requires a beholder, and the beholder must be willing." },
      { type: "quote", text: "Attention without feeling is only a report. To love is to pay attention with the whole of one's strange, susceptible body.", cite: "Mary Oliver, paraphrased from memory" },
      { type: "p", text: "There are days when I read a poem and feel that some long-locked window in the chest has been gently pried open, not violently, the way bad news opens us, but slowly, the way a season opens a tree. The poem does not ask anything of me. It only asks that I be present at the opening." },
      { type: "figure", src: img("photo-1444858291040-58f756a3bdd6"), alt: "A horse standing in a quiet meadow.", caption: "Untitled study, gelatin silver print, c. 1962." },
      { type: "p", text: "And so I have begun to keep a small, stubborn ledger of the blues of the world: the blue of the heron's shadow on shallow water, the blue between two voices on the telephone late at night, the blue of a child's drawing of the sky before they learn the sky must be a particular blue. These are the fourth sign of my private zodiac. Under them, I was born again, and again, and again." },
    ],
    relatedSlugs: ["the-quiet-architecture-of-attention", "what-the-bookshelf-remembers"],
  },
  {
    slug: "the-quiet-architecture-of-attention",
    title: "The Quiet Architecture of Attention",
    category: "Philosophy",
    tags: ["philosophy", "essays"],
    date: "2026-04-21",
    excerpt:
      "Simone Weil called attention the rarest and purest form of generosity. A century later, in the architecture of our distractions, the claim has only become more radical.",
    featuredImage: {
      src: img("photo-1519682337058-a94d519337bc"),
      alt: "A reading desk by an open window.",
      caption: "Desk and window, photograph by the author, 2024.",
    },
    body: [
      { type: "p", text: "Simone Weil called attention the rarest and purest form of generosity. A century later, in the architecture of our distractions, the claim has only become more radical — and more difficult to refute." },
      { type: "p", text: "To attend is not to grasp. It is to let the thing in front of you be what it is, without immediately trying to make use of it. A bird at the feeder, a sentence in a difficult book, the particular grief of a friend — each asks for the same posture, which is no posture at all, only a willingness to remain." },
      { type: "h2", text: "The room of one's own seeing" },
      { type: "p", text: "What we call concentration is often only the reduction of input. What we call attention is something else: an active, generous stillness. The room of one's own seeing must be furnished slowly, by hand, over a long time." },
      { type: "quote", text: "We do not see things as they are; we see them as we are.", cite: "Anaïs Nin" },
      { type: "p", text: "And yet, miraculously, we can also be changed by what we choose to see. The looking is not passive. The looking is the work." },
    ],
    relatedSlugs: ["blue-horses-and-the-fourth-sign", "letters-from-a-slow-correspondent"],
  },
  {
    slug: "what-the-bookshelf-remembers",
    title: "What the Bookshelf Remembers",
    category: "Books",
    tags: ["books", "essays", "memory"],
    date: "2026-04-09",
    excerpt:
      "A library is less a collection of books than a record of the selves we were when we acquired them — a topography of becoming, shelved alphabetically.",
    featuredImage: {
      src: img("photo-1507842217343-583bb7270b66"),
      alt: "Old books on a wooden shelf.",
      caption: "Personal library, detail.",
    },
    body: [
      { type: "p", text: "A library is less a collection of books than a record of the selves we were when we acquired them. The novel bought in a foreign train station, the slim book of essays inherited from a grandmother, the thick anthology read in a single feverish week of a difficult winter: each is a small monument to a person who is no longer entirely you." },
      { type: "p", text: "The books we have read line our shelves as a kind of secondary memory. We need not reread them. Their spines are enough. They remind us, simply by being there, that we once cared enough to reach for them." },
      { type: "quote", text: "I cannot live without books; but fewer will suffice where amusement, and not use, is the only future object.", cite: "Thomas Jefferson, in a letter, 1815" },
      { type: "p", text: "And so the shelf becomes a kind of weather report on the soul: what climates we have lived through, what storms we read our way out of, what summers of pure and useless beauty we permitted ourselves." },
    ],
    relatedSlugs: ["letters-from-a-slow-correspondent", "blue-horses-and-the-fourth-sign"],
  },
  {
    slug: "letters-from-a-slow-correspondent",
    title: "Letters from a Slow Correspondent",
    category: "Essays",
    tags: ["essays", "letters", "friendship"],
    date: "2026-03-22",
    excerpt:
      "On the lost art of writing to one person at a time, slowly, on paper, with no expectation of an immediate reply.",
    featuredImage: {
      src: img("photo-1455390582262-044cdead277a"),
      alt: "Handwritten letter and fountain pen.",
      caption: "A letter mid-sentence, photograph by the author.",
    },
    body: [
      { type: "p", text: "Writing a letter is, increasingly, an anachronism — and like all good anachronisms, it has begun to feel necessary again. To write a letter is to say: I have set aside this hour for you, and only you, and the world will have to wait." },
      { type: "p", text: "The letter does not interrupt. It does not buzz. It arrives quietly, in a known hand, and asks only that you sit down with it when you are ready." },
      { type: "quote", text: "More than kisses, letters mingle souls. For thus, friends absent speak.", cite: "John Donne" },
      { type: "p", text: "I have begun, again, the slow practice. I write to one friend a week. The replies, when they come, take their time. I have come to understand the silences between letters as a kind of conversation also." },
    ],
    relatedSlugs: ["the-quiet-architecture-of-attention", "what-the-bookshelf-remembers"],
  },
  {
    slug: "on-keeping-a-commonplace-book",
    title: "On Keeping a Commonplace Book",
    category: "Books",
    tags: ["books", "writing", "essays"],
    date: "2026-03-04",
    excerpt:
      "The commonplace book — that quiet, idiosyncratic anthology of borrowed sentences — is perhaps the most generous form of reading.",
    featuredImage: {
      src: img("photo-1481627834876-b7833e8f5570"),
      alt: "An open notebook with handwriting.",
      caption: "A page from the author's own commonplace book.",
    },
    body: [
      { type: "p", text: "For four centuries, readers kept commonplace books — handwritten anthologies of the sentences they could not bear to forget. Locke kept one. Auden kept one. Milton, almost certainly. The practice declined; the need did not." },
      { type: "p", text: "To copy a sentence by hand is to read it twice, slowly, and to argue, briefly, with one's own future forgetting." },
      { type: "quote", text: "I have gathered a posy of other men's flowers, and nothing but the thread that binds them is mine own.", cite: "Montaigne" },
      { type: "p", text: "Begin with one notebook. Copy what stops you. Add nothing of your own. In a year, you will have a portrait of your inner climate more accurate than any diary." },
    ],
    relatedSlugs: ["what-the-bookshelf-remembers", "the-quiet-architecture-of-attention"],
  },
  {
    slug: "small-instructions-for-a-quiet-life",
    title: "Small Instructions for a Quiet Life",
    category: "Essays",
    tags: ["essays", "philosophy"],
    date: "2026-02-14",
    excerpt:
      "Walk slower than the city wants you to. Reread the books that frightened you when you were younger. Keep a window open even in winter, briefly.",
    featuredImage: {
      src: img("photo-1490604001847-b712b0c2f967"),
      alt: "A quiet path through trees.",
      caption: "Path, late autumn.",
    },
    body: [
      { type: "p", text: "Walk slower than the city wants you to. Reread the books that frightened you when you were younger. Keep a window open even in winter, briefly." },
      { type: "p", text: "Refuse, sometimes, to have an opinion. Let the news reach you a day late. Write to one person a week. Cook one thing you cannot quite afford the time for. Stand, occasionally, in a museum until your feet hurt." },
      { type: "quote", text: "The cure for boredom is curiosity. There is no cure for curiosity.", cite: "Dorothy Parker" },
      { type: "p", text: "These are not instructions, of course. They are only the small daily mercies one extends to one's own attention." },
    ],
    relatedSlugs: ["the-quiet-architecture-of-attention", "letters-from-a-slow-correspondent"],
  },
  {
    slug: "the-botanist-and-the-poet",
    title: "The Botanist and the Poet",
    category: "Science",
    tags: ["science", "nature", "poetry"],
    date: "2026-01-28",
    excerpt:
      "Two ways of knowing a flower — by name and by feeling — and the strange territory where they overlap.",
    featuredImage: {
      src: img("photo-1416879595882-3373a0480b5b"),
      alt: "Wildflowers in a meadow.",
      caption: "Plate from a 19th-century botanical study.",
    },
    body: [
      { type: "p", text: "There are two ways of knowing a flower. The botanist knows it by its Latin name, its order, its habit of seeding. The poet knows it by the particular shock of color it produces against the gray of an April morning. Neither knowing is complete." },
      { type: "p", text: "Goethe, who wrote both poems and treatises on plants, believed the two knowings could become one — that taxonomy, practiced patiently enough, becomes a form of love. I am not sure he was right. I am sure he was hopeful." },
      { type: "quote", text: "If we could see the miracle of a single flower clearly, our whole life would change.", cite: "attributed to the Buddha" },
    ],
    relatedSlugs: ["blue-horses-and-the-fourth-sign", "small-instructions-for-a-quiet-life"],
  },
  {
    slug: "rilke-on-living-the-questions",
    title: "Rilke on Living the Questions",
    category: "Poetry",
    tags: ["poetry", "philosophy", "letters"],
    date: "2026-01-09",
    excerpt:
      "A young poet writes for advice. A great poet replies, gently, that the answer is not to find answers, but to inhabit the unanswered.",
    featuredImage: {
      src: img("photo-1491841550275-ad7854e35ca6"),
      alt: "An old letter on a wooden table.",
      caption: "Letter, c. 1903.",
    },
    body: [
      { type: "p", text: "In 1903, a young military cadet named Franz Xaver Kappus wrote to the poet Rainer Maria Rilke for advice. Rilke was not yet thirty. He answered, slowly, over the course of years, in ten letters that have outlived nearly everything else either of them did." },
      { type: "quote", text: "Be patient toward all that is unsolved in your heart and try to love the questions themselves, like locked rooms and like books that are now written in a very foreign tongue.", cite: "Rilke, Letters to a Young Poet" },
      { type: "p", text: "The advice is not strategic. It does not promise a path forward. It only offers a posture for the long, often blind walk that any inner life requires: a willingness to dwell where one cannot yet see." },
    ],
    relatedSlugs: ["blue-horses-and-the-fourth-sign", "the-quiet-architecture-of-attention"],
  },
];
