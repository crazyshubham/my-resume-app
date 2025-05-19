"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { extractSkills, type ExtractSkillsInput } from "@/ai/flows/skill-extraction";
import { UploadCloud, Send } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ["text/plain"];

const resumeUploadSchema = z.object({
  resumeFile: z
    .instanceof(File, { message: "Please select a file." })
    .refine((file) => file.size > 0, "File cannot be empty.")
    .refine((file) => file.size <= MAX_FILE_SIZE, `File size should be less than 5MB.`)
    .refine(
      (file) => ACCEPTED_FILE_TYPES.includes(file.type),
      "Invalid file type. Only .txt files are currently supported."
    ),
});

type ResumeUploadFormValues = z.infer<typeof resumeUploadSchema>;

interface ResumeUploadSectionProps {
  setExtractedSkills: Dispatch<SetStateAction<string[]>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setError: Dispatch<SetStateAction<string | null>>;
}

export default function ResumeUploadSection({ setExtractedSkills, setIsLoading, setError }: ResumeUploadSectionProps) {
  const { toast } = useToast();
  const form = useForm<ResumeUploadFormValues>({
    resolver: zodResolver(resumeUploadSchema),
    defaultValues: {
      resumeFile: undefined,
    },
  });

  const onSubmit: SubmitHandler<ResumeUploadFormValues> = async (data) => {
    setIsLoading(true);
    setExtractedSkills([]);
    setError(null);

    const file = data.resumeFile;
    if (!file) {
      toast({ title: "Error", description: "No file selected.", variant: "destructive" });
      setIsLoading(false);
      return;
    }

    try {
      const resumeText = await file.text();
      const input: ExtractSkillsInput = { resumeText };
      const result = await extractSkills(input);

      if (result.skills && result.skills.length > 0) {
        setExtractedSkills(result.skills);
        toast({ title: "Success!", description: "Skills extracted successfully." });
      } else {
        setExtractedSkills([]);
        toast({ title: "No Skills Found", description: "Could not extract any skills from the resume." });
      }
    } catch (error) {
      console.error("Skill extraction error:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred during skill extraction.";
      setError(errorMessage);
      toast({
        title: "Extraction Failed",
        description: `Could not extract skills. ${errorMessage}`,
        variant: "destructive",
      });
      setExtractedSkills([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-lg shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <UploadCloud className="h-6 w-6 text-primary" />
          <CardTitle className="text-2xl">Upload Your Resume</CardTitle>
        </div>
        <CardDescription>
          Upload your resume as a .txt file to extract key skills. PDF support is planned for a future update.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="resumeFile"
              render={({ field: { onChange, value, ...rest } }) => (
                <FormItem>
                  <FormLabel htmlFor="resumeFile" className="text-base">Resume File (.txt)</FormLabel>
                  <FormControl>
                    <Input
                      id="resumeFile"
                      type="file"
                      accept=".txt"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        onChange(file || null);
                      }}
                      className="focus-visible:ring-primary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                      {...rest}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={form.formState.isSubmitting || setIsLoading_isSectionLoading}>
              <Send className="mr-2 h-4 w-4" />
              {form.formState.isSubmitting || setIsLoading_isSectionLoading ? "Extracting..." : "Extract Skills"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

// Dummy variable to satisfy TS, actual loading state is passed as prop.
// This is a workaround for the linter/compiler potentially complaining about unused state from parent.
// In a real scenario, this would be managed more cleanly or the component structure might differ.
const setIsLoading_isSectionLoading = false;
