import { FeaturedCards } from '@/components/FeaturedCards';
import { HeroSection } from '@/components/HeroSection';
import { NewsSection } from '@/components/NewsSection';
import { RankingList } from '@/components/RankingList';
import { ToolCards } from '@/components/ToolCards';

export default function HomePage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-5 md:px-8 md:py-8">
      <HeroSection />
      <FeaturedCards />
      <ToolCards />
      <RankingList />
      <NewsSection />
    </main>
  );
}
