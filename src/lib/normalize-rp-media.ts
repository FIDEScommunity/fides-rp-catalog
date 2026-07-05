import type { RPMedia } from '../types/rp.js';

export const RP_MEDIA_LIMITS = {
  mediaVideos: 3,
  mediaImages: 10,
} as const;

type MediaSource = {
  media?: RPMedia;
  video?: string;
};

export function normalizeRpMedia(source: MediaSource): RPMedia | undefined {
  const videos: string[] = [];
  const images: string[] = [];

  for (const url of source.media?.videos ?? []) {
    const clean = typeof url === 'string' ? url.trim() : '';
    if (clean && !videos.includes(clean)) videos.push(clean);
  }
  for (const url of source.media?.images ?? []) {
    const clean = typeof url === 'string' ? url.trim() : '';
    if (clean && !images.includes(clean)) images.push(clean);
  }
  if (typeof source.video === 'string' && source.video.trim()) {
    const legacy = source.video.trim();
    if (!videos.includes(legacy)) videos.unshift(legacy);
  }

  const media: RPMedia = {};
  if (videos.length) media.videos = videos.slice(0, RP_MEDIA_LIMITS.mediaVideos);
  if (images.length) media.images = images.slice(0, RP_MEDIA_LIMITS.mediaImages);
  return media.videos?.length || media.images?.length ? media : undefined;
}

export function applyRpMediaNormalization<T extends MediaSource>(rp: T): Omit<T, 'video'> & { media?: RPMedia } {
  const media = normalizeRpMedia(rp);
  const { video: _legacyVideo, media: _existingMedia, ...rest } = rp;
  if (media) {
    return { ...rest, media };
  }
  return { ...rest };
}
