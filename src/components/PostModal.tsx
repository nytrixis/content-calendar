"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type PostModalProps = {
  open: boolean;
  onClose: () => void;
  onSave: (post: {
    title: string;
    platform: string[];
    caption: string;
    hashtags: string;
    file?: File | null;
    datetime: string;
    time: string;
    category: string;
    status: string;
  }) => void;
  onDelete?: () => void; // <-- NEW
  date?: string;
  initial?: Partial<{
    title: string;
    platform: string[];
    caption: string;
    hashtags: string;
    file?: File | null;
    datetime: string;
    time: string;
    category: string;
    status: string;
  }>;
};

export default function PostModal({
  open,
  onClose,
  onSave,
  onDelete, // <-- NEW
  date,
  initial = {},
}: PostModalProps) {
  const [title, setTitle] = useState(initial.title || "");
  const [platform, setPlatform] = useState<string[]>(initial.platform || []);
  const [caption, setCaption] = useState(initial.caption || "");
  const [hashtags, setHashtags] = useState(initial.hashtags || "");
  const [file, setFile] = useState<File | null>(initial.file || null);
  const [datetime, setDatetime] = useState(initial.datetime || (date ? date : ""));
  const [time, setTime] = useState(initial.time || "09:00");
  const [category, setCategory] = useState(initial.category || "General Thought");
  const [status, setStatus] = useState(initial.status || "Idea");

  useEffect(() => {
    if (date) setDatetime(date);
  }, [date]);

  useEffect(() => {
    // Reset form when opening/closing
    if (open) {
      setTitle(initial.title || "");
      setPlatform(initial.platform || []);
      setCaption(initial.caption || "");
      setHashtags(initial.hashtags || "");
      setFile(initial.file || null);
      setDatetime(initial.datetime || (date ? date : ""));
      setTime(initial.time || "09:00");
      setCategory(initial.category || "General Thought");
      setStatus(initial.status || "Idea");
    }
    // eslint-disable-next-line
  }, [open, initial, date]);

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{ backdropFilter: "blur(8px)" }}
      >
        <motion.div
          className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl text-text rounded-2xl p-8 w-full max-w-lg"
          initial={{ scale: 0.95, y: 40 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 40 }}
        >
          <h2 className="text-2xl font-bold mb-4 text-accentPurple drop-shadow">Create / Edit Post</h2>
          <form
            className="flex flex-col gap-4"
            onSubmit={e => {
              e.preventDefault();
              if (!title || !datetime || !time) return;
              onSave({
                title,
                platform,
                caption,
                hashtags,
                file,
                datetime,
                time,
                category,
                status,
              });
              onClose();
            }}
          >
            <input
              className="bg-white/30 border border-white/20 px-3 py-2 rounded-lg focus:outline-accentPurple"
              placeholder="Title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
            <div>
              <label className="block mb-1 font-medium">Platform</label>
              <div className="flex gap-2">
                {["LinkedIn", "Twitter", "Both"].map((p) => (
                  <button
                    key={p}
                    type="button"
                    className={`px-3 py-1 rounded-lg border border-white/20 transition ${
                      platform.includes(p)
                        ? "bg-accentCyan text-background shadow"
                        : "bg-white/20 text-text"
                    }`}
                    onClick={() =>
                      setPlatform((prev) =>
                        prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
                      )
                    }
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <textarea
              className="bg-white/30 border border-white/20 px-3 py-2 rounded-lg focus:outline-accentPurple"
              placeholder="Drafted Caption"
              value={caption}
              onChange={e => setCaption(e.target.value)}
            />
            <input
              className="bg-white/30 border border-white/20 px-3 py-2 rounded-lg focus:outline-accentPurple"
              placeholder="#Hashtags"
              value={hashtags}
              onChange={e => setHashtags(e.target.value)}
            />
            <input
              type="file"
              className="bg-white/30 border border-white/20 px-3 py-2 rounded-lg"
              onChange={e => setFile(e.target.files?.[0] || null)}
            />
            {!date && (
              <input
                type="date"
                className="bg-white/30 border border-white/20 px-3 py-2 rounded-lg"
                value={datetime}
                onChange={e => setDatetime(e.target.value)}
                required
              />
            )}
            <input
              type="time"
              className="bg-white/30 border border-white/20 px-3 py-2 rounded-lg"
              value={time}
              onChange={e => setTime(e.target.value)}
              required
            />
            <select
              className="bg-neutral-900/80 text-white border border-white/20 px-3 py-2 rounded-lg"
              value={category}
              onChange={e => setCategory(e.target.value)}
            >
              <option>General Thought</option>
              <option>App Critique</option>
              <option>Personal Insight</option>
              <option>Trend Response</option>
            </select>
            <select
              className="bg-neutral-900/80 text-white border border-white/20 px-3 py-2 rounded-lg"
              value={status}
              onChange={e => setStatus(e.target.value)}
            >
              <option>Idea</option>
              <option>Drafted</option>
              <option>Scheduled</option>
              <option>Posted</option>
            </select>
            <div className="flex justify-between gap-2 mt-4">
              <div>
                {onDelete && (
                  <button
                    type="button"
                    className="px-4 py-2 rounded-lg bg-red-600/80 text-white border border-red-700 hover:bg-red-700 transition"
                    onClick={() => {
                      if (confirm("Delete this post?")) {
                        onDelete();
                        onClose();
                      }
                    }}
                  >
                    Delete
                  </button>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg bg-white/20 text-text border border-white/20 hover:bg-neutral-700"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-accentPurple text-background font-semibold shadow"
                >
                  Save
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}