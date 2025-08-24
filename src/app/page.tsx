import AppLayout from "@/components/app-layout";
import PostCard from "@/components/post-card";
import type { Post } from "@/lib/types";

const posts: Post[] = [
  {
    id: "1",
    author: {
      name: "PixelQueen",
      avatarUrl: "https://placehold.co/100x100.png",
      handle: "pixelqueen",
    },
    content: "Just created this new digital art piece. What do you all think? ✨ #digitalart #vividstream",
    type: "text",
    likes: 120,
    comments: 23,
    shares: 12,
  },
  {
    id: "2",
    author: {
      name: "Alex_Travels",
      avatarUrl: "https://placehold.co/100x100.png",
      handle: "alextravels",
    },
    content: "Sunsets in Santorini are on another level! 🌅",
    type: "image",
    mediaUrl: "https://placehold.co/600x400.png",
    mediaAiHint: "sunset ocean",
    likes: 450,
    comments: 88,
    shares: 45,
  },
  {
    id: "3",
    author: {
      name: "SynthWaveMaster",
      avatarUrl: "https://placehold.co/100x100.png",
      handle: "synthwave",
    },
    content: "New track 'Neon Drive' is out! Check out this little preview. 🎶",
    type: "video",
    mediaUrl: "https://placehold.co/600x400.png",
    mediaAiHint: "neon lights",
    likes: 210,
    comments: 54,
    shares: 33,
  },
    {
    id: "4",
    author: {
      name: "FoodieFinds",
      avatarUrl: "https://placehold.co/100x100.png",
      handle: "foodiefinds",
    },
    content: "This ramen was to die for! Best I've had outside of Japan.",
    type: "image",
    mediaUrl: "https://placehold.co/600x400.png",
    mediaAiHint: "ramen bowl",
    likes: 315,
    comments: 76,
    shares: 21,
  },
];


export default function FeedPage() {
  return (
    <AppLayout>
      <div className="flex flex-col h-full">
        <header className="p-4 border-b">
          <h1 className="text-2xl font-bold">Home Feed</h1>
        </header>
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            <div className="max-w-2xl mx-auto space-y-6">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
        </div>
      </div>
    </AppLayout>
  );
}
