interface ManhwaInfoProps {
  synopsis: string;
}

/**
 * Synopsis/description section.
 * Server component — pure text, zero JS.
 *
 * Kept as a separate component so it can be expanded with
 * "Read More" toggle (future client wrapper) without touching
 * other sections.
 */
export default function ManhwaInfo({ synopsis }: ManhwaInfoProps) {
  if (!synopsis) return null;

  return (
    <section className="mt-6">
      <h2 className="mb-2 text-base font-semibold text-gray-100">Synopsis</h2>
      <p className="text-sm leading-relaxed text-gray-400">{synopsis}</p>
    </section>
  );
}
