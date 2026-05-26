import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import postKhatvanga from "@/assets/post-khatvanga.jpg";
import postAtma from "@/assets/post-atma.jpg";
import postGratitude from "@/assets/post-gratitude.jpg";
import postRabbits from "@/assets/post-rabbits.jpg";
import postSunshine from "@/assets/post-sunshine.jpg";
import postWholy from "@/assets/post-wholy.jpg";

const tiles = [
  { src: postKhatvanga, slug: "the-khatvanga-moment", title: "The Khatvanga Moment" },
  { src: postAtma, slug: "you-are-an-atma", title: "You Are an Atma" },
  { src: postGratitude, slug: "cultivate-gratitude", title: "Cultivate Gratitude" },
  { src: postRabbits, slug: "two-rabbits", title: "Two Rabbits" },
  { src: postSunshine, slug: "sunshine-energy-in-unlimited-flavors", title: "Sunshine Energy" },
  { src: postWholy, slug: "are-you-wholy", title: "Are You Wholy?" },
];

export function PostTilesSidebar() {
  const [orderedTiles, setOrderedTiles] = useState(tiles);

  useEffect(() => {
    setOrderedTiles([...tiles].sort(() => Math.random() - 0.5));
  }, []);

  return (
    <aside
      className="space-y-5 text-[17px]"
      style={{ fontFamily: "var(--font-serif-body)" }}
      suppressHydrationWarning
    >
      <ul className="space-y-5">
        {orderedTiles.map((t) => (
          <li key={t.slug}>
            <Link
              to="/post/$slug"
              params={{ slug: t.slug }}
              className="block no-underline group"
              style={{ borderBottom: "none" }}
            >
              <img
                src={t.src}
                alt={t.title}
                className="w-full aspect-[4/3] object-cover transition-opacity group-hover:opacity-85"
                loading="lazy"
              />
              <p
                className="mt-2 text-lg italic text-foreground leading-snug"
                style={{ fontFamily: "var(--font-serif-display)" }}
              >
                {t.title}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
