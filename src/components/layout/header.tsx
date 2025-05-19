import { Briefcase } from 'lucide-react';
import Link from 'next/link';

export default function AppHeader() {
  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Briefcase size={28} />
          <h1 className="text-2xl font-semibold tracking-tight">SkillScraper</h1>
        </Link>
        {/* Add navigation items here if needed in the future */}
      </div>
    </header>
  );
}
