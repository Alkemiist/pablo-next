# Video Setup Guide for Opportunities Carousel

## 🎥 New Video System - Much Easier to Find Videos!

Instead of hunting for hard-to-find `.mp4` files, you can now use videos from popular platforms like YouTube, Vimeo, and others. The system automatically detects the video type and renders it appropriately.

## 📹 Supported Video Formats

### 1. YouTube URLs (Easiest!)
Just paste any YouTube URL and it automatically converts to an embed:

```typescript
// These all work automatically:
videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
videoUrl: "https://youtu.be/dQw4w9WgXcQ"
videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
```

### 2. Vimeo URLs
Vimeo videos work the same way:

```typescript
videoUrl: "https://vimeo.com/148751763"
```

### 3. Direct Video Files (Still Supported)
If you have direct video files, they still work:

```typescript
videoUrl: "https://videos.pexels.com/video-files/example.mp4"
```

### 4. Full iframe Embed Codes (Maximum Control)
For complete control over the embed, you can use full iframe codes:

```typescript
videoUrl: '<iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" width="560" height="315" frameborder="0" allowfullscreen></iframe>'
```

## 🔍 How to Find Great Videos

### YouTube Search Tips:
1. **Search for your topic + "commercial"** (e.g., "car commercial", "tech commercial")
2. **Add "cinematic" or "aesthetic"** to find high-quality content
3. **Look for brand channels** (Nike, Apple, etc.) for professional content
4. **Search "product demo"** for feature showcases

### Vimeo Search Tips:
1. **Use "brand" or "commercial"** in searches
2. **Look for "staff picks"** for high-quality content
3. **Search by category** (Advertising, Branded Content)

### Example Searches:
- "electric car commercial cinematic"
- "tech product demo aesthetic"
- "brand storytelling commercial"
- "product launch video"

## ⚙️ How It Works

The `OpportunityMedia` component automatically:

1. **Detects video type** from the URL
2. **Converts YouTube/Vimeo URLs** to proper embed URLs
3. **Adds autoplay, muted, and loop** parameters for seamless experience
4. **Falls back to image** if video fails to load
5. **Maintains responsive design** across all screen sizes

## 🎯 Best Practices

### Video Selection:
- **Keep videos under 30 seconds** for carousel cards
- **Choose videos with strong opening visuals** (first 3 seconds matter)
- **Look for videos that match your brand aesthetic**
- **Avoid videos with heavy text overlays** (they'll be small in cards)

### URL Format:
- **YouTube**: Use the main watch URL (e.g., `youtube.com/watch?v=...`)
- **Vimeo**: Use the main video URL (e.g., `vimeo.com/123456`)
- **Direct files**: Use the full URL ending in video extension

## 🚀 Quick Start Examples

### For Car Commercials:
```typescript
videoUrl: "https://www.youtube.com/watch?v=example123"
```

### For Tech Products:
```typescript
videoUrl: "https://vimeo.com/123456789"
```

### For Lifestyle Content:
```typescript
videoUrl: "https://youtu.be/example456"
```

## 🔧 Troubleshooting

### Video Not Playing?
1. **Check the URL format** - make sure it's a valid YouTube/Vimeo URL
2. **Verify video is public** - private videos won't embed
3. **Check for region restrictions** - some videos are geo-blocked

### Performance Issues?
1. **Use shorter videos** (under 30 seconds)
2. **Avoid multiple autoplay videos** on the same page
3. **Consider using images** for slower devices

## 💡 Pro Tips

1. **Create a video library** - save good finds in a spreadsheet
2. **Use consistent video lengths** - keeps carousel rhythm
3. **Test on mobile** - ensure videos work well on small screens
4. **Keep fallback images** - always have good poster images ready

---

**Now you can easily find amazing videos for your opportunities carousel! 🎉**
