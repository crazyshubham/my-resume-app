"use client";

import { useState } from 'react';
import ResumeUploadSection from '@/components/resume-upload-section';
import SkillDisplaySection from '@/components/skill-display-section';

export default function Home() {
  const [extractedSkills, setExtractedSkills] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col items-center space-y-8">
      <ResumeUploadSection 
        setExtractedSkills={setExtractedSkills} 
        setIsLoading={setIsLoading}
        setError={setError}
      />
      <SkillDisplaySection 
        skills={extractedSkills} 
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}
