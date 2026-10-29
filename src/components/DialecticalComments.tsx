import React, { useState, useMemo } from "react";
import { EssayComment } from "../data/essays.ts";
import { filterAndSortComments } from "../utils/rules.ts";
import { MessageSquare, ArrowUp, CornerDownRight, Send, X } from "lucide-react";

interface DialecticalCommentsProps {
  essayId: string;
  essayTitle: string;
  comments: EssayComment[];
  pendingQuote?: string;
  onClearPendingQuote?: () => void;
  onAddComment: (comment: Omit<EssayComment, "id" | "createdAt" | "upvotes">) => void;
  onAddReply: (commentId: string, author: string, role: string, body: string) => void;
  onUpvote: (commentId: string) => void;
  onPlayClick: () => void;
}

const STANCE_META: Record<
  EssayComment["stance"],
  { label: string; color: string; bg: string; desc: string }
> = {
  synthesis: {
    label: "Synthesis",
    color: "#439C00",
    bg: "#ECF9E0",
    desc: "Extends or bridges the thesis",
  },
  antithesis: {
    label: "Antithesis",
    color: "#CC2929",
    bg: "#FFEBEB",
    desc: "Challenges an assumption",
  },
  empirical: {
    label: "Empirical Evidence",
    color: "#1185BA",
    bg: "#E5F6FD",
    desc: "Clinical or experimental citation",
  },
  inquiry: {
    label: "Socratic Inquiry",
    color: "#9B42D6",
    bg: "#F7E8FF",
    desc: "Probes an open boundary",
  },
};

export const DialecticalComments: React.FC<DialecticalCommentsProps> = ({
  essayId,
  comments,
  pendingQuote,
  onClearPendingQuote,
  onAddComment,
  onAddReply,
  onUpvote,
  onPlayClick,
}) => {
  const [stanceFilter, setStanceFilter] = useState<"all" | EssayComment["stance"]>("all");
  const [sortBy, setSortBy] = useState<"top" | "newest">("top");

  // New comment form state
  const [author, setAuthor] = useState("");
  const [role, setRole] = useState("");
  const [stance, setStance] = useState<EssayComment["stance"]>("synthesis");
  const [body, setBody] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  // Reply state
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyAuthor, setReplyAuthor] = useState("");
  const [replyRole, setReplyRole] = useState("");
  const [replyBody, setReplyBody] = useState("");

  const displayedComments = useMemo(
    () => filterAndSortComments(comments, essayId, stanceFilter, sortBy),
    [comments, essayId, stanceFilter, sortBy]
  );

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim()) {
      setFormError("Please enter your name or handle.");
      return;
    }
    if (!body.trim() || body.trim().length < 5) {
      setFormError("Please write a substantive contribution (at least 5 characters).");
      return;
    }

    setFormError(null);
    onPlayClick();
    onAddComment({
      essayId,
      author: author.trim(),
      role: role.trim() || "Visiting Researcher",
      stance,
      quotedPassage: pendingQuote || undefined,
      body: body.trim(),
      replies: [],
    });

    setBody("");
    onClearPendingQuote?.();
  };

  const handleSubmitReply = (commentId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!replyAuthor.trim() || !replyBody.trim()) return;
    onPlayClick();
    onAddReply(
      commentId,
      replyAuthor.trim(),
      replyRole.trim() || "Dialectical Peer",
      replyBody.trim()
    );
    setReplyBody("");
    setReplyingToId(null);
  };

  return (
    <section
      id="discourse-section"
      className="mt-16 pt-12 border-t-2 border-[#191919]"
      aria-label="Dialectical Discourse and Reader Annotations"
    >
      {/* Section Header */}
      <div className="flex flex-wrap items-baseline justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-ui font-bold uppercase tracking-widest text-[#57534E] block mb-1">
            Peer Review & Open Symposium
          </span>
          <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#191919]">
            Dialectical Discourse ({displayedComments.length})
          </h3>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2 text-xs font-ui">
          <span className="text-[#57534E]">Order:</span>
          <button
            type="button"
            onClick={() => {
              onPlayClick();
              setSortBy("top");
            }}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors whitespace-nowrap shrink-0 ${
              sortBy === "top"
                ? "bg-[#191919] text-white"
                : "bg-[#F2EFE9] text-[#57534E] hover:text-[#191919]"
            }`}
          >
            Highest Resonance
          </button>
          <button
            type="button"
            onClick={() => {
              onPlayClick();
              setSortBy("newest");
            }}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors whitespace-nowrap shrink-0 ${
              sortBy === "newest"
                ? "bg-[#191919] text-white"
                : "bg-[#F2EFE9] text-[#57534E] hover:text-[#191919]"
            }`}
          >
            Most Recent
          </button>
        </div>
      </div>

      {/* Composer Card */}
      <form
        onSubmit={handleSubmitComment}
        className="bg-white border-2 border-[#191919] shadow-[0_6px_0_0_#191919] rounded-2xl p-6 mb-10"
      >
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E4E0D8]">
          <span className="font-ui font-bold text-sm text-[#191919]">
            Contribute to the Monograph Discourse
          </span>
          <span className="text-xs font-ui text-[#57534E]">
            Select a dialectical posture
          </span>
        </div>

        {/* Pending Quoted Passage Banner */}
        {pendingQuote && (
          <div className="mb-4 p-3.5 bg-[#FFF9E0] border border-[#191919] rounded-xl flex items-start justify-between gap-3">
            <div className="text-xs font-editorial italic text-[#191919]">
              <span className="font-ui font-bold not-italic text-[11px] uppercase tracking-wider text-[#57534E] block mb-0.5">
                Anchored Text Passage:
              </span>
              "{pendingQuote}"
            </div>
            <button
              type="button"
              onClick={onClearPendingQuote}
              className="p-1 text-[#57534E] hover:text-[#191919]"
              aria-label="Remove quoted passage"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Stance Selector Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          {(Object.keys(STANCE_META) as EssayComment["stance"][]).map((key) => {
            const meta = STANCE_META[key];
            const active = stance === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => {
                  onPlayClick();
                  setStance(key);
                }}
                className={`p-2.5 rounded-xl border-2 text-left transition-all ${
                  active
                    ? "border-[#191919] shadow-[0_3px_0_0_#191919] translate-y-[-1px]"
                    : "border-[#E4E0D8] bg-[#FBF9F5] opacity-75 hover:opacity-100"
                }`}
                style={{ backgroundColor: active ? meta.bg : undefined }}
              >
                <div
                  className="text-xs font-ui font-extrabold whitespace-nowrap"
                  style={{ color: meta.color }}
                >
                  {meta.label}
                </div>
                <div className="text-[11px] font-ui text-[#57534E] truncate mt-0.5">
                  {meta.desc}
                </div>
              </button>
            );
          })}
        </div>

        {/* Author & Role Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <div>
            <label htmlFor="comment-author" className="block text-xs font-ui font-bold text-[#191919] mb-1">
              Name or Scholarly Handle *
            </label>
            <input
              id="comment-author"
              type="text"
              placeholder="e.g. Dr. Hannah Arendt"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full text-sm font-ui px-3.5 py-2 rounded-xl border-2 border-[#191919] bg-[#FBF9F5] focus:bg-white focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="comment-role" className="block text-xs font-ui font-bold text-[#191919] mb-1">
              Discipline / Affiliation
            </label>
            <input
              id="comment-role"
              type="text"
              placeholder="e.g. Phenomenology & Political Theory"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full text-sm font-ui px-3.5 py-2 rounded-xl border-2 border-[#E4E0D8] focus:border-[#191919] bg-[#FBF9F5] focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        {/* Comment Body */}
        <div className="mb-3">
          <label htmlFor="comment-body" className="block text-xs font-ui font-bold text-[#191919] mb-1">
            Dialectical Argument or Note *
          </label>
          <textarea
            id="comment-body"
            rows={3}
            placeholder="Write your synthesis, counter-argument, or clinical observation..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full text-sm font-editorial px-3.5 py-2.5 rounded-xl border-2 border-[#191919] bg-[#FBF9F5] focus:bg-white focus:outline-none leading-relaxed"
          />
        </div>

        {formError && (
          <p className="text-xs font-ui font-bold text-[#CC2929] mb-3">{formError}</p>
        )}

        <div className="flex items-center justify-between pt-2">
          <span className="text-xs font-ui text-[#57534E]">
            Tip: Highlight any sentence in the essay to quote it directly.
          </span>
          <button
            type="submit"
            className="duo-btn duo-btn-streak text-xs font-ui font-extrabold px-5 py-2.5 rounded-xl flex items-center gap-2 whitespace-nowrap shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Publish Note</span>
          </button>
        </div>
      </form>

      {/* Filter Bar for Stances */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-6 border-b border-[#E4E0D8]">
        {(["all", "synthesis", "antithesis", "empirical", "inquiry"] as const).map((st) => (
          <button
            key={st}
            type="button"
            onClick={() => {
              onPlayClick();
              setStanceFilter(st);
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-ui font-bold transition-colors whitespace-nowrap shrink-0 ${
              stanceFilter === st
                ? "bg-[#191919] text-white"
                : "bg-transparent text-[#57534E] hover:bg-[#F2EFE9] hover:text-[#191919]"
            }`}
          >
            {st === "all" ? "All Contributions" : STANCE_META[st].label}
          </button>
        ))}
      </div>

      {/* Comments Feed */}
      <div className="space-y-6">
        {displayedComments.length === 0 ? (
          <div className="text-center py-12 bg-white border border-[#E4E0D8] rounded-2xl p-6">
            <MessageSquare className="w-6 h-6 text-[#57534E] mx-auto mb-2" />
            <p className="font-ui font-bold text-sm text-[#191919]">
              No contributions in this stance filter yet
            </p>
            <p className="text-xs font-ui text-[#57534E] mt-1">
              Be the first scholar to initiate the dialectic above.
            </p>
          </div>
        ) : (
          displayedComments.map((item) => {
            const meta = STANCE_META[item.stance];
            return (
              <article
                key={item.id}
                className="bg-white border-2 border-[#191919] rounded-2xl p-6 transition-all"
              >
                {/* Top Metadata Line (Clean unboxed typography per Anti-Slop guidelines) */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-[#E4E0D8] text-xs font-ui">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-extrabold text-[#191919] text-sm">
                      {item.author}
                    </span>
                    <span aria-hidden="true" className="text-[#57534E]">·</span>
                    <span className="text-[#57534E]">{item.role}</span>
                    <span aria-hidden="true" className="text-[#57534E]">·</span>
                    <span
                      className="font-extrabold uppercase tracking-wider text-[11px]"
                      style={{ color: meta.color }}
                    >
                      {meta.label}
                    </span>
                  </div>
                  <span className="font-code text-[11px] text-[#57534E] tabular-nums">
                    {item.createdAt}
                  </span>
                </div>

                {/* Quoted Passage if present */}
                {item.quotedPassage && (
                  <blockquote className="my-3 p-3 bg-[#FBF9F5] border border-[#E4E0D8] rounded-xl font-editorial italic text-sm text-[#57534E]">
                    "{item.quotedPassage}"
                  </blockquote>
                )}

                {/* Comment Prose */}
                <p className="font-editorial text-base text-[#191919] leading-relaxed my-3">
                  {item.body}
                </p>

                {/* Bottom Actions: Upvote & Reply */}
                <div className="flex items-center gap-4 pt-2 text-xs font-ui">
                  <button
                    type="button"
                    onClick={() => {
                      onPlayClick();
                      onUpvote(item.id);
                    }}
                    className="duo-btn px-3 py-1 rounded-lg bg-[#FBF9F5] hover:bg-[#FFF9E0] text-[#191919] font-bold flex items-center gap-1.5 tabular-nums"
                  >
                    <ArrowUp className="w-3.5 h-3.5 text-[#D6A600]" />
                    <span>Resonate ({item.upvotes})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setReplyingToId(replyingToId === item.id ? null : item.id)
                    }
                    className="font-bold text-[#57534E] hover:text-[#191919] flex items-center gap-1"
                  >
                    <CornerDownRight className="w-3.5 h-3.5" />
                    <span>Reply</span>
                  </button>
                </div>

                {/* Nested Replies */}
                {item.replies && item.replies.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-[#E4E0D8] pl-4 sm:pl-6 space-y-3">
                    {item.replies.map((rep) => (
                      <div
                        key={rep.id}
                        className="p-3.5 bg-[#FBF9F5] rounded-xl border border-[#E4E0D8]"
                      >
                        <div className="flex items-center gap-2 text-xs font-ui mb-1">
                          <span className="font-bold text-[#191919]">{rep.author}</span>
                          <span aria-hidden="true" className="text-[#57534E]">·</span>
                          <span className="text-[#57534E]">{rep.role}</span>
                          <span aria-hidden="true" className="text-[#57534E]">·</span>
                          <span className="font-code text-[11px] text-[#57534E] tabular-nums">
                            {rep.createdAt}
                          </span>
                        </div>
                        <p className="font-editorial text-sm text-[#191919] leading-relaxed">
                          {rep.body}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Inline Reply Composer */}
                {replyingToId === item.id && (
                  <form
                    onSubmit={(e) => handleSubmitReply(item.id, e)}
                    className="mt-4 pt-4 border-t border-[#E4E0D8] pl-4 sm:pl-6 space-y-2.5"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Your name *"
                        value={replyAuthor}
                        onChange={(e) => setReplyAuthor(e.target.value)}
                        className="text-xs font-ui px-3 py-1.5 rounded-lg border border-[#191919] bg-[#FBF9F5]"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Role / Discipline"
                        value={replyRole}
                        onChange={(e) => setReplyRole(e.target.value)}
                        className="text-xs font-ui px-3 py-1.5 rounded-lg border border-[#E4E0D8] bg-[#FBF9F5]"
                      />
                    </div>
                    <textarea
                      rows={2}
                      placeholder={`Reply to ${item.author}...`}
                      value={replyBody}
                      onChange={(e) => setReplyBody(e.target.value)}
                      className="w-full text-xs font-editorial px-3 py-2 rounded-lg border border-[#191919] bg-[#FBF9F5]"
                      required
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setReplyingToId(null)}
                        className="text-xs font-ui font-bold px-3 py-1 text-[#57534E]"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="duo-btn text-xs font-ui font-bold px-3.5 py-1 rounded-lg bg-[#191919] text-white"
                      >
                        Post Reply
                      </button>
                    </div>
                  </form>
                )}
              </article>
            );
          })
        )}
      </div>
    </section>
  );
};
