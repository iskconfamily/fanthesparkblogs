import { createFileRoute } from "@tanstack/react-router";
import { SiteLayoutWeb } from "@/components/site-layout-web";
import { ContactSection } from "@/components/contact-section";
import { Dots, Para, Prose } from "@/components/editorial";

export const Route = createFileRoute("/wisdom/lord")({
  head: () => ({
    meta: [
      { title: "Lord Chaitanya — Wisdom · Fan The Spark" },
      { name: "description", content: "The history and philosophy of Sri Caitanya Mahaprabhu — the Golden Avatara who inaugurated the sankirtana movement." },
      { property: "og:title", content: "Lord Chaitanya — Wisdom · Fan The Spark" },
      { property: "og:description", content: "The history and philosophy of Sri Caitanya Mahaprabhu — the Golden Avatara who inaugurated the sankirtana movement." },
      { property: "og:type", content: "article" },
    ],
    links: [{ rel: "canonical", href: "https://fanthesparkblogs.lovable.app/wisdom/lord" }],
  }),
  component: LordPage,
});

const sloka = (n: number, text: string) => (
  <div className="mb-7">
    <p
      style={{
        fontFamily: "var(--font-meta)",
        fontSize: 12,
        letterSpacing: "0.32em",
        textTransform: "uppercase",
        color: "var(--brand-olive, var(--muted-foreground))",
        marginBottom: 8,
      }}
    >
      Sloka {n}
    </p>
    <p
      style={{
        fontFamily: "var(--font-serif-body)",
        fontSize: 19,
        lineHeight: 1.85,
        color: "var(--foreground)",
        fontStyle: "italic",
      }}
    >
      {text}
    </p>
  </div>
);

function LordPage() {
  return (
    <SiteLayoutWeb>
      {/* HERO */}
      <section
        className="w-full"
        style={{
          backgroundColor: "var(--brand-header-bg, var(--muted))",
          borderBottom: "1px solid var(--brand-header-border, var(--border))",
        }}
      >
        <div className="mx-auto max-w-[1200px] px-6 py-20 sm:py-28 text-center">
          <p
            className="mb-4"
            style={{
              fontFamily: "var(--font-meta)",
              fontSize: 12,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: "var(--brand-olive, var(--muted-foreground))",
            }}
          >
            The History and Philosophy of
          </p>
          <h1
            style={{
              fontFamily: "var(--font-serif-display)",
              fontSize: "clamp(44px, 6.5vw, 80px)",
              fontStyle: "italic",
              fontWeight: 500,
              lineHeight: 1.05,
              color: "var(--brand-title-color, var(--foreground))",
            }}
          >
            Sri Caitanya Mahaprabhu
          </h1>
        </div>
      </section>

      <Prose tight="bottom">
        <Dots />
        <Para>
          <em>Sri Caitanya Mahaprabhu may be unfamiliar to most Westerners, but He is well known throughout India.</em>
        </Para>
        <Para>
          <em>
            Lord Caitanya is known in India as the child prodigy who casually defeated prominent scholars, the cultural revolutionary
            who organized India's first civil disobedience movement, the social reformer who overruled a rigid caste system based on
            birth, the humble ascetic to whom even reputed religious leaders surrendered their lives; but above all Lord Caitanya is
            known as the Golden Avatara, the incarnation of God who inaugurated the congregational singing (sankirtana) of the holy
            names of God,
          </em>{" "}
          a movement that <em>emphasizes the process of meditating on the sound of the maha-mantra:</em>
        </Para>
        <p
          className="mb-7 text-center"
          style={{
            fontFamily: "var(--font-serif-display)",
            fontStyle: "italic",
            fontSize: 22,
            lineHeight: 1.6,
            color: "var(--brand-title-color, var(--foreground))",
          }}
        >
          Hare Krishna, Hare Krishna, Krishna Krishna, Hare Hare
          <br />
          Hare Rama, Hare Rama, Rama Rama, Hare Hare.
        </p>
      </Prose>

      <Prose tight="both">
        <Para>
          In the winter of 1486, as a lunar eclipse rose over the Ganges in West Bengal, Sri Caitanya Mahaprabhu was born beneath a
          neem tree. Vedic scriptures predicted His auspicious appearance, stating that an avatara of the Absolute Truth would
          descend in this quarrelsome age of Kali to teach love of God — loving devotional service to that Absolute Truth, Sri
          Krishna — through <em>mantra meditation</em> and ecstatic dance. Human society would be re-spiritualized through the
          awakening of the true identity of the soul.
        </Para>
        <Para>
          Before leading this devotional revolution, young Caitanya distinguished himself as a brilliant scholar. He correctly
          anticipated that the Bhakti process would be ridiculed as mere sentiment, or even insanity. Over time, however, His
          mature scholarship, and that of His disciples, laid these accusations to rest. Pure devotion was supported by reason —
          Bhakti and Vedanta would unite together as a singular process.
        </Para>
        <Para>
          He remained in Navadvipa for 24 years as a student and householder. At 16 years old, after initiation into the holy names,
          He became devotionally electrified, like a God-maddened live wire. His ecstatic devotion was contagious, affecting
          everyone He contacted. Stuffy intellectuals and philosophers would sing and dance as He crossed their path. Businessmen
          and kings would cry in ecstasy merely by His touch. An aura of divine love cut through all social barriers, and His
          following burgeoned by hundreds of thousands.
        </Para>
        <Para>
          Sri Caitanya's movement revolved around the <em>Hare Krishna Maha-Mantra</em>, which He predicted would soon be heard in
          every town and village on earth. He taught not only congregational chanting (sankirtan) but also private, measured
          chanting called <em>japa</em>. Both forms were systematically expounded by his followers, the Six Goswamis of Vrindavan.
          This process of chanting the holy names of Krishna, said Sri Caitanya, is both the means and the end of spiritual life.
        </Para>
        <Para>
          By fulfilling the scriptural prophecy — which mentioned His sankirtan movement, His esoteric activities, His parentage,
          and even his golden complexion — Mahaprabhu was gradually accepted as the dual manifestation of Radha and Krishna, the
          female and male aspects of the Supreme Person, in a single form. As the Vedic literature predicted, Krishna came hidden
          as His own devotee, in the mood of Radharani, to relish ultimate divine love and teach us by example.
        </Para>
        <Para>
          At 24, He accepted the order of sannyasa, becoming a fully renounced monk, and made Jagannatha Puri his headquarters.
          From there he traveled widely throughout India preaching Srimad-Bhagavatam, Bhagavad-Gita, and training disciples.
        </Para>
      </Prose>

      {/* Prabhupada quote */}
      <section style={{ backgroundColor: "var(--brand-header-bg, var(--muted))" }}>
        <div className="mx-auto max-w-[760px] px-6 py-12 sm:py-16">
          <blockquote
            style={{
              fontFamily: "var(--font-serif-body)",
              fontSize: 18,
              lineHeight: 1.8,
              color: "var(--foreground)",
              fontStyle: "italic",
              borderLeft: "2px solid var(--brand-gold, var(--border))",
              paddingLeft: 24,
            }}
          >
            <p className="mb-5">
              "In the Bhagavad-gita Lord Sri Krsna is depicted as the Absolute Personality of Godhead, and His last teachings in
              that great book of transcendental knowledge instruct that one should give up all the modes of religious activities
              and accept Him (Lord Sri Krsna) as the only worshipable Lord. The Lord then assured that all His devotees would be
              protected from all sorts of sinful acts and that for them there would be no cause for anxiety.
            </p>
            <p className="mb-5">
              Unfortunately, despite Lord Sri Krsna's direct order and the teachings of the Bhagavad-gita, less intelligent people
              misunderstand Him to be nothing but a great historical personality, and thus they cannot accept Him as the original
              Personality of Godhead. Such men with a poor fund of knowledge are misled by many non-devotees. Thus the teachings
              of the Bhagavad-gita were misinterpreted even by great scholars. After the disappearance of Lord Sri Krsna there were
              hundreds of commentaries on the Bhagavad-gita by many erudite scholars, and almost every one of them was motivated
              by self-interest.
            </p>
            <p className="mb-5">
              Lord Sri Caitanya Mahaprabhu is the selfsame Lord Sri Krsna. This time, however, He appeared as a great devotee of
              the Lord in order to preach to the people in general, as well as to religionists and philosophers, about the
              transcendental position of Sri Krsna, the primeval Lord and the cause of all causes. The essence of His preaching is
              that Lord Sri Krsna, who appeared at Vrajabhumi (Vrndavana) as the son of the King of Vraja (Nanda Maharaja), is the
              Supreme Personality of Godhead and is therefore worshipable by all. Vrndavana-dhama is non-different from the Lord
              because the name, fame, form and place where the Lord manifests Himself are all identical with the Lord as absolute
              knowledge. Therefore Vrndavana-dhama is as worshipable as the Lord. The highest form of transcendental worship of
              the Lord was exhibited by the damsels of Vrajabhumi in the form of pure affection for the Lord, and Lord Sri
              Caitanya Mahaprabhu recommends this process as the most excellent mode of worship. He accepts the Srimad-Bhagavata
              Purana as the spotless literature for understanding the Lord, and He preaches that the ultimate goal of life for all
              human beings is to attain the stage of prema, or love of God."
            </p>
            <footer
              style={{
                fontFamily: "var(--font-meta)",
                fontSize: 12,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--brand-olive, var(--muted-foreground))",
                fontStyle: "normal",
              }}
            >
              — Srila Prabhupada, Introduction to Srimad Bhagavatam
            </footer>
          </blockquote>
        </div>
      </section>

      <Prose tight="both">
        <Para>
          After returning to Puri, He spent the remaining 18 years of His life in an exalted state of spiritual absorption,
          inspiring others to shed tears of divine love.
        </Para>
        <Para>
          His yoga system, based on chanting, dancing, and feasting — the natural symptoms of a soul in God consciousness — is now
          spreading like wildfire across the world, thanks to His Divine Grace A.C. Bhaktivedanta Swami Prabhupada, who brought
          this teaching out of India and to the West, through his International Society for Krishna Consciousness (ISKCON).
        </Para>
        <Para>
          Although Sri Caitanya Mahaprabhu was known as the greatest scholar, he left only eight verses, called the{" "}
          <em>Siksastakam</em>. They comprise His entire philosophy, the essence of Self-Realization. The eight slokas completed by
          the Lord are:
        </Para>
      </Prose>

      {/* Siksastakam */}
      <section style={{ backgroundColor: "var(--background)" }}>
        <div className="mx-auto max-w-[720px] px-6 pb-10 sm:pb-12">
          {sloka(
            1,
            "Glory to the Sri Krsna sankirtana, which cleanses the heart of all the dust accumulated for years and extinguishes the fire of conditional life, of repeated birth and death. This sankirtana movement is the prime benediction for humanity at large because it spreads the rays of the benediction moon. It is the life of all transcendental knowledge. It increases the ocean of transcendental bliss, and it enables us to fully taste the nectar for which we are always anxious.",
          )}
          {sloka(
            2,
            "O my Lord, Your holy name alone can render all benediction to living beings, and thus You have hundreds and millions of names like Krsna and Govinda. In these transcendental names You have invested all Your transcendental energies. There are not even hard and fast rules for chanting these names. O my Lord, out of kindness You enable us to easily approach You by chanting Your holy names, but I am so unfortunate that I have no attraction for them.",
          )}
          {sloka(
            3,
            "One should chant the holy name of the Lord in a humble state of mind, thinking oneself lower than the straw in the street; one should be more tolerant than a tree, devoid of all sense of false prestige, and ready to offer all respect to others. In such a state of mind one can chant the holy name of the Lord constantly.",
          )}
          {sloka(
            4,
            "O almighty Lord, I have no desire to accumulate wealth, nor do I desire beautiful women, nor do I want any number of followers. I only want Your causeless devotional service birth after birth.",
          )}
          {sloka(
            5,
            "O son of Maharaja Nanda [Krsna], I am Your eternal servitor, yet somehow or other I have fallen into the ocean of birth and death. Please pick me up from this ocean of death and place me as one of the atoms of Your lotus feet.",
          )}
          {sloka(
            6,
            "O my Lord, when will my eyes be decorated with tears of love flowing constantly when I chant Your holy name? When will my voice choke up, and when will the hairs of my body stand on end at the recitation of Your name?",
          )}
          {sloka(
            7,
            "O Govinda! Feeling Your separation, I am considering a moment to be like twelve years or more. Tears are flowing from my eyes like torrents of rain, and I am feeling all vacant in the world in Your absence.",
          )}
          {sloka(
            8,
            "I know no one but Krsna as my Lord, and He shall remain so even if He handles me roughly in His embrace or makes me brokenhearted by not being present before me. He is completely free to do anything and everything, for He is always my worshipful Lord unconditionally.",
          )}
        </div>
      </section>

      <Prose tight="top">
        <Para>
          <em>
            The readers of this small description of the life and precepts of Lord Caitanya will profit much to go through the books
            of Srila Vrndavana dasa Thakura (Sri Caitanya-bhagavata) and Srila Krsnadasa Kaviraja Gosvami (Sri
            Caitanya-caritamrta). The early life of the Lord is most fascinatingly expressed by the author of Caitanya-bhagavata,
            and as far as the teachings are concerned, they are more vividly explained in the Caitanya-caritamrta. Now they are
            available to the public in our book, "Teachings of Lord Caitanya."
          </em>
        </Para>
      </Prose>

      <ContactSection defaultCategory="Wisdom / Dhamesvara" />
    </SiteLayoutWeb>
  );
}
