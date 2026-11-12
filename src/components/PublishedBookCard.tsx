import { ArrowUpRight, BookOpen } from "lucide-react";

export const PUBLISHED_BOOK = {
  id: "neither-living-nor-dying",
  title: "Neither Living Nor Dying: Reflection of the Middle",
  author: "Inbasekaran S",
  amazonUrl: "https://a.co/d/08D406kn",
};

export function PublishedBookCard() {
  const { id, title, author, amazonUrl } = PUBLISHED_BOOK;

  return (
    <article
      id={id}
      aria-labelledby={`${id}-title`}
      tabIndex={-1}
      className="grid scroll-mt-36 overflow-hidden rounded-3xl border-2 border-[#191919] bg-[#FAF8F3] shadow-[0_6px_0_0_#191919] sm:grid-cols-[220px_minmax(0,1fr)] sm:scroll-mt-28 md:col-span-2 lg:col-span-3"
    >
      <div className="flex items-center justify-center border-b border-[#DDD6ED] bg-[#EEE9F8] p-6 sm:border-b-0 sm:border-r">
        <img
          src={`${import.meta.env.BASE_URL}books/${id}.png`}
          width={300}
          height={438}
          alt="Cover of Neither Living Nor Dying, with an ink circle above a thin landscape line."
          loading="lazy"
          decoding="async"
          className="h-auto w-36 max-w-full rounded-sm border border-[#D6CCBB] shadow-[4px_6px_16px_#37352f26] sm:w-40"
        />
      </div>

      <div className="flex min-w-0 flex-col items-start justify-center p-6 sm:p-8 lg:px-10">
        <p className="flex items-center gap-2 font-code text-[11px] font-bold uppercase tracking-wider text-[#5A447E]">
          <BookOpen size={14} aria-hidden="true" />
          Philosophy · Published book
        </p>
        <h2 id={`${id}-title`} className="mt-3 max-w-[26ch] text-balance font-display text-3xl font-bold leading-tight sm:text-4xl">
          {title}
        </h2>
        <p className="mt-2 text-sm font-semibold text-[#5A5955]">{author}</p>
        <p className="mt-3 max-w-[62ch] font-editorial text-base leading-relaxed text-[#5A5955]">
          I also write about philosophy. My book, <cite>{title}</cite>, is available on Amazon.
        </p>
        <a
          href={amazonUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#5645D4] px-4 py-2 text-sm font-semibold text-white hover:bg-[#4534B3] focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#5645D4]"
        >
          Find it on Amazon <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}
