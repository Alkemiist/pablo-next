'use client'

// imports
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Share2, Loader2, FileText, Sparkles, Download, Copy, Heart, MessageCircle, Share } from "lucide-react"
import { useState, useEffect } from "react"
import { BriefMetadata } from "@/lib/brief-storage"

// Form data interface
interface SocialPostFormData {
  selectedBriefId: string;
  numberOfPosts: number;
  platform: 'instagram' | 'twitter' | 'linkedin' | 'tiktok';
  aspectRatio: 'square' | 'portrait' | 'landscape' | 'story';
  copyLength: 'short' | 'medium' | 'long';
}

// Generated post interface
interface GeneratedSocialPost {
  id: string;
  copy: string;
  hashtags: string[];
  imagePrompt: string;
  imageUrl?: string;
  platform: string;
  aspectRatio: string;
  isLoadingImage?: boolean;
}

// The main component
export default function SocialGeneratorPage() {
  // State management
  const [availableBriefs, setAvailableBriefs] = useState<BriefMetadata[]>([])
  const [isLoadingBriefs, setIsLoadingBriefs] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedPosts, setGeneratedPosts] = useState<GeneratedSocialPost[]>([])
  const [showMoodboard, setShowMoodboard] = useState(false)
  const [isGeneratingImages, setIsGeneratingImages] = useState(false)
  const [skeletonPosts, setSkeletonPosts] = useState<GeneratedSocialPost[]>([])
  
  // Form data state
  const [formData, setFormData] = useState<SocialPostFormData>({
    selectedBriefId: '',
    numberOfPosts: 1,
    platform: 'instagram',
    aspectRatio: 'square',
    copyLength: 'medium'
  })

  // Load briefs from API
  useEffect(() => {
    const loadBriefs = async () => {
      try {
        setIsLoadingBriefs(true)
        const response = await fetch('/api/briefs')
        
        if (!response.ok) {
          throw new Error('Failed to load briefs')
        }
        
        const data = await response.json()
        setAvailableBriefs(data.briefs || [])
      } catch (err) {
        console.error('Error loading briefs:', err)
        setError(err instanceof Error ? err.message : 'Failed to load briefs')
      } finally {
        setIsLoadingBriefs(false)
      }
    }

    loadBriefs()
  }, [])

  // Handle form submission
  const handleGeneratePosts = async () => {
    if (!formData.selectedBriefId) {
      alert('Please select a brief first')
      return
    }

    setIsGenerating(true)
    
    // Create skeleton posts immediately
    const skeletonPosts: GeneratedSocialPost[] = []
    for (let i = 0; i < formData.numberOfPosts; i++) {
      skeletonPosts.push({
        id: `skeleton_${Date.now()}_${i}`,
        copy: '',
        hashtags: [],
        imagePrompt: '',
        platform: formData.platform,
        aspectRatio: formData.aspectRatio,
        isLoadingImage: true
      })
    }
    setSkeletonPosts(skeletonPosts)
    setShowMoodboard(true)
    
    try {
      // Map form data to API expected format
      const requestData = {
        briefId: formData.selectedBriefId,
        numberOfPosts: formData.numberOfPosts,
        platform: formData.platform,
        aspectRatio: formData.aspectRatio,
        copyLength: formData.copyLength
      };
      
      const response = await fetch('/api/generate-social-posts?v=' + Date.now(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      })

      if (!response.ok) {
        throw new Error('Failed to generate posts')
      }

      const data = await response.json()
      console.log('📝 Generated posts data:', data.posts)
      setGeneratedPosts(data.posts)
      
      // Generate images asynchronously
      console.log('🚀 Starting image generation process...')
      generateImagesForPosts(data.posts)
      
    } catch (err) {
      console.error('Error generating posts:', err)
      alert('Failed to generate posts. Please try again.')
      setShowMoodboard(false)
      setSkeletonPosts([])
    } finally {
      setIsGenerating(false)
    }
  }

  // Generate images for posts asynchronously
  const generateImagesForPosts = async (posts: GeneratedSocialPost[]) => {
    console.log('🎨 Starting image generation for posts:', posts.length)
    
    for (const post of posts) {
      try {
        console.log(`🖼️ Generating image for post ${post.id} with prompt:`, post.imagePrompt)
        
        const imageResponse = await fetch('/api/generate-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            imagePrompt: post.imagePrompt,
            aspectRatio: post.aspectRatio,
            postId: post.id
          }),
        });

        console.log(`📡 Image API response status:`, imageResponse.status)

        if (imageResponse.ok) {
          const imageData = await imageResponse.json()
          console.log(`✅ Image generated successfully for post ${post.id}:`, imageData.imageUrl)
          
          // Update the specific post with the generated image
          setGeneratedPosts(prevPosts => 
            prevPosts.map(p => 
              p.id === post.id 
                ? { ...p, imageUrl: imageData.imageUrl, isLoadingImage: false }
                : p
            )
          )
        } else {
          const errorText = await imageResponse.text()
          console.error(`❌ Image generation failed for post ${post.id}:`, errorText)
          
          // Mark image as failed to load
          setGeneratedPosts(prevPosts => 
            prevPosts.map(p => 
              p.id === post.id 
                ? { ...p, isLoadingImage: false }
                : p
            )
          )
        }
      } catch (error) {
        console.error(`💥 Error generating image for post ${post.id}:`, error)
        // Mark image as failed to load
        setGeneratedPosts(prevPosts => 
          prevPosts.map(p => 
            p.id === post.id 
              ? { ...p, isLoadingImage: false }
              : p
          )
        )
      }
    }
  }

  // Copy text to clipboard
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      alert('Copied to clipboard!')
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  // Update form data helper
  const updateFormData = (field: keyof SocialPostFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div>
      
      {/* Top Bar - Matching Inspo Design */}
      <div className="flex justify-between items-center border-b border-neutral-800 bg-neutral-950 py-4 px-6 sticky top-0 z-10 h-[80px]">
        
        {/* Left Side: Form Controls */}
        <div className="flex gap-4">
          
          {/* Select Brief */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-neutral-400 font-medium">Select Brief</label>
            <Select 
              value={formData.selectedBriefId} 
              onValueChange={(value) => updateFormData('selectedBriefId', value)}
              disabled={isLoadingBriefs}
            >
              <SelectTrigger className="w-64 bg-neutral-800 border-neutral-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                <SelectValue placeholder={isLoadingBriefs ? "Loading briefs..." : "Choose a brief"} />
              </SelectTrigger>
              <SelectContent className="bg-neutral-900 border-neutral-700">
                {availableBriefs.map((brief) => (
                  <SelectItem 
                    key={brief.id} 
                    value={brief.id} 
                    className="cursor-pointer hover:bg-neutral-800"
                  >
                    <span className="font-medium">{brief.title}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Number of Posts */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-neutral-400 font-medium">Posts</label>
            <Input
              type="number"
              min="1"
              max="10"
              value={formData.numberOfPosts}
              onChange={(e) => updateFormData('numberOfPosts', parseInt(e.target.value) || 1)}
              className="w-20 bg-neutral-800 border-neutral-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>

          {/* Platform */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-neutral-400 font-medium">Platform</label>
            <Select 
              value={formData.platform} 
              onValueChange={(value) => updateFormData('platform', value as SocialPostFormData['platform'])}
            >
              <SelectTrigger className="w-32 bg-neutral-800 border-neutral-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                <SelectValue placeholder="Platform" />
              </SelectTrigger>
              <SelectContent className="bg-neutral-900 border-neutral-700">
                <SelectItem value="instagram" className="cursor-pointer hover:bg-neutral-800">Instagram</SelectItem>
                <SelectItem value="twitter" className="cursor-pointer hover:bg-neutral-800">Twitter</SelectItem>
                <SelectItem value="linkedin" className="cursor-pointer hover:bg-neutral-800">LinkedIn</SelectItem>
                <SelectItem value="tiktok" className="cursor-pointer hover:bg-neutral-800">TikTok</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Aspect Ratio */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-neutral-400 font-medium">Aspect</label>
            <Select 
              value={formData.aspectRatio} 
              onValueChange={(value) => updateFormData('aspectRatio', value as SocialPostFormData['aspectRatio'])}
            >
              <SelectTrigger className="w-32 bg-neutral-800 border-neutral-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                <SelectValue placeholder="Ratio" />
              </SelectTrigger>
              <SelectContent className="bg-neutral-900 border-neutral-700">
                <SelectItem value="square" className="cursor-pointer hover:bg-neutral-800">Square</SelectItem>
                <SelectItem value="portrait" className="cursor-pointer hover:bg-neutral-800">Portrait</SelectItem>
                <SelectItem value="landscape" className="cursor-pointer hover:bg-neutral-800">Landscape</SelectItem>
                <SelectItem value="story" className="cursor-pointer hover:bg-neutral-800">Story</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Copy Length */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-neutral-400 font-medium">Copy Length</label>
            <Select 
              value={formData.copyLength} 
              onValueChange={(value) => updateFormData('copyLength', value as SocialPostFormData['copyLength'])}
            >
              <SelectTrigger className=" bg-neutral-800 border-neutral-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                <SelectValue placeholder="Length" />
              </SelectTrigger>
              <SelectContent className="bg-neutral-900 border-neutral-700">
                <SelectItem value="short" className="cursor-pointer hover:bg-neutral-800">Short: &lt;100 chars</SelectItem>
                <SelectItem value="medium" className="cursor-pointer hover:bg-neutral-800">Medium: 100-200 chars</SelectItem>
                <SelectItem value="long" className="cursor-pointer hover:bg-neutral-800">Long: 200-300 chars</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Right Side: Generate Button */}
        <div className="flex items-center gap-3">
          <Button
            onClick={handleGeneratePosts}
            disabled={!formData.selectedBriefId || isGenerating}
            className="gap-2 bg-blue-800 hover:bg-blue-700 cursor-pointer shadow-[0_0_12px_blue] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Generating Posts & Images...
              </>
            ) : (
              <>
                <Sparkles className="size-4" />
                Generate Posts
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        
        {/* Loading State */}
        {isLoadingBriefs && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="size-8 text-blue-400 animate-spin mx-auto mb-4" />
              <p className="text-neutral-400">Loading briefs...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoadingBriefs && (
          <div className="text-center py-12">
            <div className="text-red-400 mb-4">
              <FileText className="size-16 mx-auto mb-2" />
              <p className="text-lg font-semibold">Error loading briefs</p>
              <p className="text-sm text-neutral-500">{error}</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoadingBriefs && !error && availableBriefs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="size-16 text-neutral-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-neutral-300 mb-2">No briefs available</h3>
            <p className="text-neutral-500 mb-6">
              Create a brief first to generate social media posts
            </p>
          </div>
        )}

        {/* Pinterest-Style Moodboard */}
        {showMoodboard && (generatedPosts.length > 0 || skeletonPosts.length > 0) && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Generated Social Posts</h2>
              <div className="flex gap-2">
                <Button
                  onClick={() => setShowMoodboard(false)}
                  variant="outline"
                  className="border-neutral-600 text-neutral-300 hover:bg-neutral-800"
                >
                  Back to Form
                </Button>
                <Button className="gap-2 bg-green-800 hover:bg-green-700">
                  <Download className="size-4" />
                  Export All
                </Button>
              </div>
            </div>

            {/* Pinterest Grid - Enhanced for Mixed Aspect Ratios */}
            <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
              {(generatedPosts.length > 0 ? generatedPosts : skeletonPosts).map((post, index) => (
                <div 
                  key={post.id}
                  className="break-inside-avoid bg-neutral-900 rounded-2xl border border-neutral-700 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:border-blue-500/50 group"
                >
                  {/* Image Container with Dynamic Aspect Ratio */}
                  <div className={`relative overflow-hidden ${
                    post.aspectRatio === 'square' ? 'aspect-square' :
                    post.aspectRatio === 'portrait' || post.aspectRatio === 'story' ? 'aspect-[9/16]' :
                    'aspect-[16/9]'
                  }`}>
                    {post.imageUrl ? (
                      <img
                        src={post.imageUrl}
                        alt={post.copy}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : post.isLoadingImage ? (
                      <div className="w-full h-full bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20 flex items-center justify-center">
                        <div className="text-center p-4">
                          <Loader2 className="size-12 text-blue-400 mx-auto mb-2 animate-spin" />
                          <p className="text-sm text-blue-400 font-medium">Generating Image...</p>
                          <p className="text-xs text-neutral-500 capitalize">{post.aspectRatio}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20 flex items-center justify-center">
                        <div className="text-center p-4">
                          <Share2 className="size-12 text-blue-400 mx-auto mb-2" />
                          <p className="text-sm text-neutral-400 font-medium">{post.platform}</p>
                          <p className="text-xs text-neutral-500 capitalize">{post.aspectRatio}</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Platform Badge */}
                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-1 bg-blue-900/80 text-blue-300 text-xs rounded-full border border-blue-700/50 backdrop-blur-sm">
                        {post.platform}
                      </span>
                    </div>
                    
                    {/* Aspect Ratio Indicator */}
                    <div className="absolute bottom-3 left-3">
                      <span className="px-2 py-1 bg-neutral-900/80 text-neutral-300 text-xs rounded-full border border-neutral-700/50 backdrop-blur-sm">
                        {post.aspectRatio === 'square' ? '1:1' :
                         post.aspectRatio === 'portrait' ? '9:16' :
                         post.aspectRatio === 'landscape' ? '16:9' :
                         '9:16'}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-3">
                    {/* Copy */}
                    <div className="space-y-2">
                      {post.copy ? (
                        <p className="text-sm text-white leading-relaxed line-clamp-4">
                          {post.copy}
                        </p>
                      ) : (
                        <div className="space-y-2">
                          <div className="h-4 bg-neutral-700 rounded animate-pulse"></div>
                          <div className="h-4 bg-neutral-700 rounded animate-pulse w-3/4"></div>
                          <div className="h-4 bg-neutral-700 rounded animate-pulse w-1/2"></div>
                        </div>
                      )}
                      
                      {/* Hashtags */}
                      <div className="flex flex-wrap gap-1">
                        {post.hashtags.length > 0 ? (
                          post.hashtags.map((hashtag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="px-2 py-1 bg-blue-900/30 text-blue-300 text-xs rounded-md border border-blue-700/50"
                            >
                              {hashtag}
                            </span>
                          ))
                        ) : (
                          <div className="flex gap-1">
                            <div className="h-6 w-16 bg-neutral-700 rounded animate-pulse"></div>
                            <div className="h-6 w-20 bg-neutral-700 rounded animate-pulse"></div>
                            <div className="h-6 w-14 bg-neutral-700 rounded animate-pulse"></div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
                      <div className="flex gap-2">
                        <button
                          onClick={() => copyToClipboard(post.copy)}
                          className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
                          title="Copy text"
                        >
                          <Copy className="size-4 text-neutral-400 hover:text-white" />
                        </button>
                        <button
                          onClick={() => copyToClipboard(post.hashtags.join(' '))}
                          className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
                          title="Copy hashtags"
                        >
                          <Share className="size-4 text-neutral-400 hover:text-white" />
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-3 text-xs text-neutral-500">
                        <span className="flex items-center gap-1">
                          <Heart className="size-3" />
                          {Math.floor(Math.random() * 100)}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="size-3" />
                          {Math.floor(Math.random() * 20)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Default State - Show when no moodboard */}
        {!showMoodboard && !isLoadingBriefs && !error && availableBriefs.length > 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Share2 className="size-20 text-neutral-600 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-neutral-300 mb-4">Ready to Generate Social Posts</h3>
            <p className="text-neutral-500 mb-8 max-w-md">
              Select a brief and customize your settings above, then click "Generate Posts" to create your Pinterest-style moodboard
            </p>
            <div className="flex gap-4 text-sm text-neutral-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>AI-Generated Copy</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Smart Hashtags</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Visual Prompts</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
