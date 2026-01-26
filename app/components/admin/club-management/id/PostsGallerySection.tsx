import { Camera, Video } from 'lucide-react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import type { ClubDetail } from '@/app/types/clubs';

interface PostsGallerySectionProps {
  club: ClubDetail;
}

export default function PostsGallerySection({ club }: PostsGallerySectionProps) {
  const displayPosts = club.posts?.slice(0, 6) || [];
  const displayStories = club.stories?.slice(0, 4) || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="border-slate-200 overflow-hidden">
        <div className="px-6 py-5 bg-linear-to-br from-cyan-50 to-white border-b border-cyan-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-medium text-[#0f172a] flex items-center gap-2">
                <Camera className="w-5 h-5 text-cyan-600" />
                Posts
              </h3>
              <p className="text-sm text-[#64748b] mt-1">
                {club.postsCount} post{club.postsCount !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
        <CardContent className="p-0">
          {displayPosts.length === 0 ? (
            <div className="py-10 text-center text-sm text-slate-500">
              No posts yet
            </div>
          ) : (
            <div className="space-y-px bg-slate-200">
              {displayPosts.map((post) => (
                <div
                  key={post._id}
                  className="bg-white px-4 py-3  transition-colors group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        {post.media && post.media.length > 0 && (
                          <Camera className="w-4 h-4 text-cyan-600 shrink-0" />
                        )}
                        <span className="text-sm font-medium text-[#0f172a] line-clamp-2">
                          {post.caption || 'Untitled Post'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#64748b]">
                        {post.media?.length > 0 && (
                          <>
                            <span>{post.media.length} photo{post.media.length !== 1 ? 's' : ''}</span>
                            <span>•</span>
                          </>
                        )}
                        <span>{new Date(post.created_at).toLocaleDateString()}</span>
                        {!post.is_private && (
                          <>
                            <span>•</span>
                            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 border text-xs py-0">
                              Public
                            </Badge>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-slate-200 overflow-hidden">
        <div className="px-6 py-5 bg-linear-to-br from-rose-50 to-white border-b border-rose-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-medium text-[#0f172a] flex items-center gap-2">
                <Video className="w-5 h-5 text-rose-600" />
                Stories
              </h3>
              <p className="text-sm text-[#64748b] mt-1">
                {club.stories?.length || 0} storie{(club.stories?.length || 0) !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
        <CardContent className="p-0">
          {displayStories.length === 0 ? (
            <div className="py-10 text-center text-sm text-slate-500">
              No stories yet
            </div>
          ) : (
            <div className="space-y-px bg-slate-200">
              {displayStories.map((story) => (
                <div
                  key={story._id}
                  className="bg-white px-4 py-3 transition-colors group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Video className="w-4 h-4 text-rose-600 shrink-0" />
                        <span className="text-sm font-medium text-[#0f172a] line-clamp-2">
                          {story.caption || 'Story'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#64748b]">
                        <span>{story.media?.length || 0} item{(story.media?.length || 0) !== 1 ? 's' : ''}</span>
                        <span>•</span>
                        <span>{new Date(story.created_at).toLocaleDateString()}</span>
                        {!story.is_private && (
                          <>
                            <span>•</span>
                            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 border text-xs py-0">
                              Public
                            </Badge>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
