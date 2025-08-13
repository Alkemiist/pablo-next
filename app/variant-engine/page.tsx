

"use client";
import { useState } from 'react';

type JobSummary = { id: string; status: string; createdAt: string };

export default function VariantEngine() {
  const [brandName, setBrandName] = useState('Demo Brand');
  const [idea, setIdea] = useState('Announce our new feature that saves time.');
  const [forbidden, setForbidden] = useState('cheap,free');
  const [manifest, setManifest] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function generateVariants() {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/v1/copy-variants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idea,
          brand: { voice: brandName, forbidden: forbidden.split(',').map((s) => s.trim()).filter(Boolean) },
        }),
      });
      const data = await res.json();
      setManifest(data);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Creative Multiplication Engine</h1>

      <div className="space-y-2">
        <label className="block text-sm">Brand Name</label>
        <input className="border px-3 py-2 w-full" value={brandName} onChange={(e) => setBrandName(e.target.value)} />
      </div>

      <div className="space-y-2">
        <label className="block text-sm">Your Idea</label>
        <textarea className="border px-3 py-2 w-full" rows={3} value={idea} onChange={(e) => setIdea(e.target.value)} />
      </div>
      <div className="space-y-2">
        <label className="block text-sm">Forbidden Phrases (comma separated)</label>
        <input className="border px-3 py-2 w-full" value={forbidden} onChange={(e) => setForbidden(e.target.value)} />
      </div>

      <div className="flex gap-2">
        <button disabled={isSubmitting} className="bg-indigo-600 text-white px-4 py-2" onClick={generateVariants}>Generate variants</button>
      </div>

      {manifest && <CopyPreview manifest={manifest} />}
      {manifest && (
        <details className="bg-gray-50 p-3 text-xs rounded">
          <summary className="cursor-pointer select-none font-medium mb-2">Debug JSON</summary>
          <pre className="overflow-auto max-h-96">{JSON.stringify(manifest, null, 2)}</pre>
        </details>
      )}
    </div>
  );
}

function CopyPreview({ manifest }: { manifest: any }) {
  const items = (manifest?.variants || []) as Array<{
    id: string;
    platform: 'instagram_caption' | 'x_post' | 'youtube_shorts_desc' | 'medium_intro';
    text: string;
    tone: string;
    structure: string;
    cta: string;
    charCount: number;
    maxChars: number;
    warnings?: string[];
  }>;

  const grouped: Record<string, typeof items> = {};
  for (const v of items) {
    grouped[v.platform] = grouped[v.platform] || [];
    grouped[v.platform].push(v);
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">Copy Variants</h2>
      <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
        {Object.entries(grouped).map(([platform, vs]) => (
          <div key={platform} className="space-y-2">
            <div className="text-sm uppercase tracking-wide text-gray-600">{labelForCopyPlatform(platform)}</div>
            {vs.map((v) => (
              <div key={v.id} className="border rounded p-3 bg-white">
                <div className="text-xs text-gray-500 mb-2">Tone: {v.tone} • Structure: {v.structure} • {v.charCount}/{v.maxChars}</div>
                <div className="text-sm whitespace-pre-wrap">{v.text}</div>
                {v.warnings && v.warnings.length > 0 && (
                  <div className="mt-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded p-2">
                    {v.warnings.join(' • ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function labelForCopyPlatform(p: string) {
  const map: Record<string, string> = {
    instagram_caption: 'Instagram Caption',
    x_post: 'X (Twitter) Post',
    youtube_shorts_desc: 'YouTube Shorts Description',
    medium_intro: 'Medium Intro',
  };
  return map[p] || p;
}

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