export type PostStatus = "Idea" | "Drafted" | "Scheduled" | "Posted";
export type Platform = "LinkedIn" | "Twitter" | "Both";
export type PostType = "General Thought" | "App Critique" | "Personal Insight" | "Trend Response";
export interface Post {
  id: string;
  title: string;
  platform: Platform[];
  caption: string;
  hashtags: string[];
  assetUrl?: string;
  scheduledAt: string;
  type: PostType;
  status: PostStatus;
}