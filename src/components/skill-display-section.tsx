"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tags, AlertTriangle } from "lucide-react";

interface SkillDisplaySectionProps {
  skills: string[];
  isLoading: boolean;
  error: string | null;
}

export default function SkillDisplaySection({ skills, isLoading, error }: SkillDisplaySectionProps) {
  const hasSkills = skills.length > 0;

  return (
    <Card className="w-full max-w-lg shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <Tags className="h-6 w-6 text-primary" />
          <CardTitle className="text-2xl">Extracted Skills</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-8 w-1/3 rounded-md" />
            ))}
          </div>
        )}
        {!isLoading && error && (
          <div className="flex flex-col items-center text-center text-destructive p-4 border border-destructive/50 rounded-md bg-destructive/10">
            <AlertTriangle className="h-10 w-10 mb-2" />
            <p className="font-semibold">Error Extracting Skills</p>
            <p className="text-sm">{error}</p>
          </div>
        )}
        {!isLoading && !error && !hasSkills && (
          <p className="text-muted-foreground text-center py-4">
            No skills extracted yet. Upload your resume to see the results.
          </p>
        )}
        {!isLoading && !error && hasSkills && (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <Badge
                key={index}
                className="px-3 py-1 text-sm font-medium bg-accent text-accent-foreground shadow-sm hover:bg-accent/90"
                aria-label={`Skill: ${skill}`}
              >
                {skill}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
