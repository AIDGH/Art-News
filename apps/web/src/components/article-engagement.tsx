"use client";

import { useEffect, useState } from "react";

type Comment = {
  id: string;
  name: string;
  body: string;
  createdAt: string;
  likes: number;
  liked: boolean;
};
type Engagement = { articleLikes: number; articleLiked: boolean; comments: Comment[] };

export function ArticleEngagement({ slug }: { slug: string }) {
  const [data, setData] = useState<Engagement | null>(null);
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");

  const cleanSlug = typeof slug === "string" ? slug.trim() : "";

  function getEngagementBaseUrl() {
    if (!cleanSlug) return "";
    let decodedSlug = cleanSlug;
    try {
      decodedSlug = decodeURIComponent(cleanSlug);
    } catch {
      decodedSlug = cleanSlug;
    }
    return `/api/v1/articles/${encodeURIComponent(decodedSlug)}/engagement`;
  }

  useEffect(() => {
    let active = true;
    setMessage("");

    const base = getEngagementBaseUrl();
    if (!base) {
      setData({ articleLikes: 0, articleLiked: false, comments: [] });
      return;
    }

    fetch(base, { credentials: "include", cache: "no-store" })
      .then(async (response) => {
        // If API returns 404 (e.g. no engagement record found or media post), handle gracefully as empty state
        if (response.status === 404) {
          return { data: { articleLikes: 0, articleLiked: false, comments: [] } };
        }
        if (!response.ok) {
          throw new Error(`دریافت اطلاعات با وضعیت ${response.status} ناموفق بود`);
        }
        return response.json();
      })
      .then((json: { data?: Engagement }) => {
        if (!active) return;
        if (json?.data) {
          setData({
            articleLikes: Number(json.data.articleLikes) || 0,
            articleLiked: Boolean(json.data.articleLiked),
            comments: Array.isArray(json.data.comments) ? json.data.comments : [],
          });
        } else {
          setData({ articleLikes: 0, articleLiked: false, comments: [] });
        }
      })
      .catch((err) => {
        console.error("Error fetching comments / engagement:", err);
        if (active) {
          setMessage("دریافت نظرها ممکن نشد. صفحه را دوباره باز کنید.");
        }
      });

    return () => {
      active = false;
    };
  }, [cleanSlug]);

  async function send(path: string, payload?: object) {
    const base = getEngagementBaseUrl();
    if (!base) throw new Error("شناسه خبر نامعتبر است");
    const response = await fetch(`${base}${path}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload ?? {}),
    });
    const json = await response.json().catch(() => ({}));
    if (!response.ok) {
      const detail = Array.isArray(json.message) ? json.message.join("، ") : json.message;
      throw new Error(detail || "انجام درخواست ممکن نشد");
    }
    return json.data;
  }

  async function likeArticle() {
    if (!data || data.articleLiked || pending) return;
    setPending(true);
    setMessage("");
    try {
      const result = (await send("/likes")) as { likes: number };
      setData({ ...data, articleLikes: result.likes, articleLiked: true });
    } catch (error) {
      setMessage((error as Error).message);
    } finally {
      setPending(false);
    }
  }

  async function likeComment(commentId: string) {
    if (!data || pending) return;
    setPending(true);
    setMessage("");
    try {
      const result = (await send(`/comments/${commentId}/likes`)) as { likes: number };
      setData({
        ...data,
        comments: data.comments.map((item) =>
          item.id === commentId ? { ...item, likes: result.likes, liked: true } : item,
        ),
      });
    } catch (error) {
      setMessage((error as Error).message);
    } finally {
      setPending(false);
    }
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    setMessage("");
    try {
      await send("/comments", { name: name.trim(), body: body.trim() });
      setBody("");
      setMessage("نظر شما ثبت شد و پس از بررسی در سایت نمایش داده می‌شود.");
    } catch (error) {
      setMessage((error as Error).message);
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="article-engagement container-wide" aria-label="نظرات و پسندیدن خبر">
      <div className="article-engagement-heading">
        <h2>نظرها</h2>
        <button
          type="button"
          onClick={likeArticle}
          disabled={pending || !data || data.articleLiked}
          aria-pressed={data?.articleLiked ?? false}
        >
          {data?.articleLiked ? "♥ خبر را پسندیدید" : "♡ پسندیدن خبر"} (
          {(data?.articleLikes ?? 0).toLocaleString("fa-IR")})
        </button>
      </div>
      <form onSubmit={submit} className="article-comment-form">
        <label>
          نام
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            minLength={2}
            maxLength={80}
            required
          />
        </label>
        <label>
          نظر
          <textarea
            value={body}
            onChange={(event) => setBody(event.target.value)}
            minLength={3}
            maxLength={2000}
            rows={4}
            required
          />
        </label>
        <button type="submit" disabled={pending}>
          {pending ? "در حال ارسال…" : "ثبت نظر"}
        </button>
        <small>نظرها پیش از نمایش بررسی می‌شوند.</small>
      </form>
      {message ? (
        <p className="article-comment-message" role="status">
          {message}
        </p>
      ) : null}
      {!data ? (
        message ? null : <p>در حال دریافت نظرها…</p>
      ) : data.comments.length === 0 ? (
        <p className="article-comment-empty text-slate-500 py-3">
          هنوز نظری ثبت نشده است.
        </p>
      ) : (
        <div className="article-comment-list">
          {data.comments.map((comment) => (
            <div className="article-comment" key={comment.id}>
              <div>
                <strong>{comment.name}</strong>
                <time dateTime={comment.createdAt}>
                  {new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium" }).format(
                    new Date(comment.createdAt),
                  )}
                </time>
              </div>
              <p>{comment.body}</p>
              <button
                type="button"
                onClick={() => likeComment(comment.id)}
                disabled={pending || comment.liked}
                aria-pressed={comment.liked}
              >
                {comment.liked ? "♥ پسندیدید" : "♡ پسندیدن"} ({comment.likes.toLocaleString("fa-IR")})
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
