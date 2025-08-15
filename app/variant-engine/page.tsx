

"use client";
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Text, ArrowUp10, Loader2 } from "lucide-react";

type JobSummary = { id: string; status: string; createdAt: string };

export default function VariantEngine() {
  const [idea, setIdea] = useState('');
  const [maxChars, setMaxChars] = useState<number>(150);
  const [manifest, setManifest] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasRequested, setHasRequested] = useState(false);

  async function generateVariants() {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/v1/copy-variants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idea,
          maxChars,
          totalVariants: 20,
        }),
      });
      const data = await res.json();
      setManifest(data);
      setHasRequested(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="ml-1 h-[calc(100vh-60px)] overflow-y-auto">
      {/* Sticky top bar styled like inspo */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-neutral-950 shadow-lg h-[60px]">
        {/* Left side - Inputs */}
        <div className="flex items-center gap-4">
          {/* Character Count */}
          <div className="relative">
            <ArrowUp10 className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4 stroke-neutral-500" />
            <input
              type="number"
              min={50}
              max={500}
              step={10}
              value={maxChars}
              onChange={(e) => setMaxChars(Number(e.target.value) || 150)}
              className="pl-9 pr-3 py-2 h-9 w-40 bg-transparent border border-neutral-700 rounded-md text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-0"
              placeholder="Character count"
            />
          </div>

          {/* Idea input (search-like) */}
          <div className="relative">
            <Text className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4 stroke-neutral-500" />
            <input
              type="text"
              placeholder="your idea here..."
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              className="pl-10 pr-4 py-2 h-9 w-[32rem] bg-transparent border border-neutral-700 rounded-md text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-0"
            />
          </div>
        </div>

        {/* Far right - Create */}
        <Button
          onClick={generateVariants}
          disabled={isSubmitting}
          className="gap-2 bg-blue-800 hover:bg-blue-700 cursor-pointer w-32 shadow-[0_0_12px_blue]"
        >
          {isSubmitting && <Loader2 className="size-4 animate-spin" />}
          {isSubmitting ? 'Creating…' : 'Create'}
        </Button>
      </div>

      {/* Content */}
      <div className="p-4 md:p-6 space-y-4">
        {isSubmitting && <VariantsSkeleton count={24} />}
        {!isSubmitting && manifest && <CopyPreview manifest={manifest} />}
        {!isSubmitting && !manifest && hasRequested && (
          <div className="text-sm text-neutral-500">No results yet. Try a different idea.</div>
        )}
      </div>
    </div>
  );
}

function CopyPreview({ manifest }: { manifest: any }) {
  const items = (manifest?.variants || []) as Array<{
    id: string;
    text: string;
    tone: string;
    structure: string;
    cta: string;
    charCount: number;
    maxChars: number;
    warnings?: string[];
  }>;

  function capitalize(s: string) {
    if (!s) return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  function titleCase(s: string) {
    if (!s) return '';
    return s
      .split(/[-_\s]+/)
      .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : ''))
      .join(' ');
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">Copy Variants</h2>
      {/* Masonry-style stacked grid using CSS columns */}
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 [column-fill:_balance]">
        {items.map((v) => (
          <div key={v.id} className="break-inside-avoid mb-4">
            <div className="rounded-lg bg-[#1b1b1b] p-5 border border-neutral-800/80 shadow-[0_0_0_1px_rgba(28,28,28,0.8),0_8px_20px_rgba(0,0,0,0.25)] space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-neutral-900 text-neutral-200 border border-neutral-700/70 text-xs font-medium">{capitalize(v.tone)}</span>
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-neutral-900 text-neutral-200 border border-neutral-700/70 text-xs font-medium">{titleCase(v.structure)}</span>
                <span className="ml-auto inline-flex items-center text-neutral-400 text-xs font-medium">{v.charCount}/{v.maxChars}</span>
              </div>

              <div className="text-sm text-neutral-200 whitespace-pre-wrap leading-7">
                {v.text}
              </div>

              {/* warnings intentionally hidden per design */}

              <div>
                <Button className="w-full h-8 text-xs font-medium bg-neutral-800 hover:bg-neutral-700 border border-neutral-700/70 text-neutral-200">
                  {v.cta}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function VariantsSkeleton({ count = 16 }: { count?: number }) {
  const items = Array.from({ length: count });
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 [column-fill:_balance]">
      {items.map((_, i) => (
        <div key={i} className="break-inside-avoid mb-4">
          <div className="rounded-lg bg-[#1b1b1b] p-4 border border-neutral-800/80">
            <div className="flex gap-2 mb-3">
              <div className="h-6 w-20 rounded-full bg-neutral-800 animate-pulse" />
              <div className="h-6 w-28 rounded-full bg-neutral-800 animate-pulse" />
              <div className="ml-auto h-6 w-16 rounded-full bg-neutral-800 animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="h-3 w-5/6 bg-neutral-800 rounded animate-pulse" />
              <div className="h-3 w-4/6 bg-neutral-800 rounded animate-pulse" />
              <div className="h-3 w-3/6 bg-neutral-800 rounded animate-pulse" />
            </div>
            <div className="mt-4 h-8 w-full bg-neutral-800 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

// removed labelForCopyPlatform since we no longer group by platform

function PreviewGrid({ job, plan }: { job: any; plan: any }) {
  const artifacts = (job?.artifacts || []) as Array<{
    platform: string;
    variantIndex: number;
    type: 'copy' | 'image' | 'video' | 'manifest';
    url?: string;
    data?: any;
  }>;

  const grouped: Record<string, typeof artifacts> = {};
  for (const a of artifacts) {
    if (a.type === 'manifest') continue;
    grouped[a.platform] = grouped[a.platform] || [];
    grouped[a.platform].push(a);
  }

  const caption = plan?.asset?.text || 'Sample caption text for preview';

  return (
    <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
      {Object.entries(grouped).map(([platform, items]) => (
        <div key={platform} className="space-y-2">
          <div className="text-sm uppercase tracking-wide text-gray-600">{labelForPlatform(platform)}</div>
          {items.slice(0, 3).map((a) => (
            <PlatformPreview key={platform + '-' + a.variantIndex} platform={platform} kind={(a.type === 'manifest' ? 'copy' : a.type) as 'copy' | 'image' | 'video'} caption={caption} />
          ))}
        </div>
      ))}
      {Object.keys(grouped).length === 0 && (
        <div className="text-sm text-gray-500">No visual artifacts yet. Click Refresh in a moment.</div>
      )}
    </div>
  );
}

function PlatformPreview({ platform, kind, caption }: { platform: string; kind: 'copy' | 'image' | 'video'; caption: string }) {
  if (platform === 'instagram_feed') return <InstagramPost caption={caption} kind={kind} />;
  if (platform === 'instagram_reels') return <InstagramReel caption={caption} />;
  if (platform === 'x_feed') return <XPost caption={caption} kind={kind} />;
  if (platform === 'facebook_feed') return <FacebookPost caption={caption} kind={kind} />;
  if (platform === 'youtube_shorts') return <YouTubeShorts caption={caption} />;
  if (platform === 'commercial_ctv') return <CTVSpot caption={caption} />;
  if (platform === 'ooh') return <OOHBoard caption={caption} />;
  return <div className="border rounded p-4 text-sm">Unsupported platform</div>;
}

function Avatar() {
  return <div className="h-8 w-8 rounded-full bg-gray-300" />;
}

function MediaPlaceholder({ aspect }: { aspect: string }) {
  const [w, h] = aspect.split(':').map(Number);
  const paddingTop = (h / w) * 100;
  return (
    <div className="relative w-full bg-gray-200">
      <div style={{ paddingTop: `${paddingTop}%` }} />
      <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-600">{aspect}</div>
    </div>
  );
}

function InstagramPost({ caption, kind }: { caption: string; kind: 'copy' | 'image' | 'video' }) {
  return (
    <div className="bg-white border rounded-md overflow-hidden shadow-sm">
      <div className="flex items-center gap-2 p-3">
        <Avatar />
        <div className="text-sm font-medium">brand_official</div>
        <div className="ml-auto text-gray-500">•••</div>
      </div>
      <MediaPlaceholder aspect="4:5" />
      <div className="px-3 py-2 text-sm">
        <div className="flex gap-3 py-1 text-gray-700">
          <span>♡</span>
          <span>💬</span>
          <span>↗</span>
        </div>
        <div className="text-gray-900">
          <span className="font-semibold mr-2">brand_official</span>
          {truncate(caption, 125)}
        </div>
        <div className="mt-2 text-xs text-gray-500">Alt text required • Max 2,200 chars</div>
      </div>
    </div>
  );
}

function InstagramReel({ caption }: { caption: string }) {
  return (
    <div className="bg-black rounded-md overflow-hidden shadow-sm relative">
      {/* 9:16 */}
      <div className="relative w-full" style={{ paddingTop: '177.78%' }}>
        <div className="absolute inset-0">
          {/* Safe areas top/bottom */}
          <div className="absolute top-0 left-0 right-0 bg-white/10" style={{ height: '10%' }} />
          <div className="absolute bottom-0 left-0 right-0 bg-white/10" style={{ height: '10%' }} />
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xs">Reel 9:16</div>
        </div>
      </div>
      <div className="p-2 text-xs text-gray-300">Burned-in captions if speech • ≤30s</div>
    </div>
  );
}

function XPost({ caption, kind }: { caption: string; kind: 'copy' | 'image' | 'video' }) {
  return (
    <div className="bg-white border rounded-md overflow-hidden shadow-sm p-3">
      <div className="flex items-center gap-2">
        <Avatar />
        <div className="text-sm">
          <div className="font-medium">Brand</div>
          <div className="text-gray-500">@brand • 1m</div>
        </div>
      </div>
      <div className="text-sm mt-2">{truncate(caption, 280)}</div>
      <div className="mt-2">
        <MediaPlaceholder aspect="16:9" />
      </div>
      <div className="mt-1 text-xs text-gray-500">Max 2 hashtags • 280 chars</div>
    </div>
  );
}

function FacebookPost({ caption, kind }: { caption: string; kind: 'copy' | 'image' | 'video' }) {
  return (
    <div className="bg-white border rounded-md overflow-hidden shadow-sm">
      <div className="flex items-center gap-2 p-3">
        <Avatar />
        <div>
          <div className="text-sm font-medium">Brand</div>
          <div className="text-xs text-gray-500">1 min • Public</div>
        </div>
      </div>
      <div className="px-3 text-sm pb-2">{truncate(caption, 125)}</div>
      <MediaPlaceholder aspect="1:1" />
      <div className="p-2 text-xs text-gray-500">Primary copy ≤125 chars</div>
    </div>
  );
}

function YouTubeShorts({ caption }: { caption: string }) {
  return (
    <div className="bg-black rounded-md overflow-hidden shadow-sm relative">
      {/* 9:16 with larger safe areas */}
      <div className="relative w-full" style={{ paddingTop: '177.78%' }}>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 right-0 bg-white/10" style={{ height: '12%' }} />
          <div className="absolute bottom-0 left-0 right-0 bg-white/10" style={{ height: '12%' }} />
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xs">Shorts 9:16</div>
        </div>
      </div>
      <div className="p-2 text-xs text-gray-300">≤60s • big safety margins top/bottom</div>
    </div>
  );
}

function CTVSpot({ caption }: { caption: string }) {
  return (
    <div className="bg-black rounded-md overflow-hidden shadow-sm">
      {/* 16:9 */}
      <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
        <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xs">CTV 1920×1080</div>
      </div>
      <div className="p-2 text-xs text-gray-300">:06 / :15 / :30 trims • End-card required</div>
    </div>
  );
}

function OOHBoard({ caption }: { caption: string }) {
  const words = caption.trim().split(/\s+/).slice(0, 6).join(' ');
  const tooMany = caption.trim().split(/\s+/).length > 6;
  return (
    <div className="bg-black rounded-md overflow-hidden shadow-sm">
      {/* 16:9 */}
      <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`text-white font-bold ${tooMany ? 'text-red-400' : ''}`} style={{ fontSize: '28px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {words}
          </div>
        </div>
      </div>
      <div className="p-2 text-xs text-gray-300">Max 6 words • Extreme contrast • Logo ≥2% width</div>
    </div>
  );
}

function labelForPlatform(p: string) {
  const map: Record<string, string> = {
    instagram_feed: 'Instagram Feed',
    instagram_reels: 'Instagram Reels',
    x_feed: 'X Feed',
    facebook_feed: 'Facebook Feed',
    youtube_shorts: 'YouTube Shorts',
    commercial_ctv: 'Commercial/CTV',
    ooh: 'OOH',
  };
  return map[p] || p;
}

function truncate(text: string, max: number) {
  if (!text) return '';
  return text.length > max ? text.slice(0, max - 1) + '…' : text;
}