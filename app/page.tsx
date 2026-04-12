import { AiDirectSection } from '@/components/AiDirectSection';
import { FeaturedCards } from '@/components/FeaturedCards';
import { HeroSection } from '@/components/HeroSection';
import { NewsSection } from '@/components/NewsSection';
import { RankingList } from '@/components/RankingList';
import { ToolCards } from '@/components/ToolCards';

export default function HomePage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-6 md:px-8 md:py-8">
      <HeroSection />
      <FeaturedCards />
      <AiDirectSection />
      <ToolCards />
      <RankingList />
      <NewsSection />
    </main>
  );
}
