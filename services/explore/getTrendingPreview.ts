import type { TrendingPreviewResponse } from "./types";

export async function getTrendingPreview(): Promise<TrendingPreviewResponse> {
  return {
    personas: [],
    circles: [],
    hashtags: [],
  };
}