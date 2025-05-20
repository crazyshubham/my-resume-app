
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

const resumeUploadSchema = z.object({
  resumeFile: z
    .instanceof(File, { message: "Please select a file." })
    .refine((file) => file.size > 0, "File cannot be empty.")
    .refine((file) => file.size <= MAX_FILE_SIZE, `File size should be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB.`),
});

type ResumeUploadFormValues = z.infer<typeof resumeUploadSchema>;

interface ResumeUploadSectionProps {
  setExtractedSkills: Dispatch<SetStateAction<string[]>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setError: Dispatch<SetStateAction<string | null>>;
}

// Whitelist of MIME types. Prioritize PDF and TXT for skill extraction from resumes.
// Other image types are supported by the AI model but may not be ideal for resumes.
const SUPPORTED_MIME_TYPES_FOR_SKILL_EXTRACTION = [
  'application/pdf', // Best for resumes
  'text/plain',      // Excellent for resumes
  'image/jpeg',      // Supported by AI
  'image/png',       // Supported by AI
  'image/webp',      // Supported by AI
];

export default function ResumeUploadSection({ setExtractedSkills, setIsLoading, setError }: ResumeUploadSectionProps) {
  const { toast } = useToast();
  const form = useForm<ResumeUploadFormValues>({
    resolver: zodResolver(resumeUploadSchema),
    defaultValues: {
      resumeFile: undefined,
    },
  });

  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const onSubmit: SubmitHandler<ResumeUploadFormValues> = async (data) => {
    setIsLoading(true);
    setExtractedSkills([]);
    setError(null);

    const file = data.resumeFile;
    if (!file) { // Should be caught by Zod, but defensive check
      toast({ title: "Error", description: "No file selected.", variant: "destructive" });
      setIsLoading(false);
      return;
    }

    if (!SUPPORTED_MIME_TYPES_FOR_SKILL_EXTRACTION.includes(file.type)) {
      const errText = `File type '${file.type}' is not optimally supported for skill extraction. For best results, please use PDF or TXT files. JPEG, PNG, and WEBP are also accepted but may be less effective for resumes.`;
      setError(errText);
      toast({
        title: "Unsupported File Type",
        description: errText,
        variant: "destructive",
      });
      setExtractedSkills([]);
      setIsLoading(false);
      return;
    }

    try {
      const resumeFileAsDataUri = await readFileAsDataURL(file);
      const input: ExtractSkillsInput = { resumeFileAsDataUri };
      const result = await extractSkills(input);

      if (result.skills && result.skills.length > 0) {
        setExtractedSkills(result.skills);
        toast({ title: "Success!", description: "Skills extracted successfully." });
      } else {
        setExtractedSkills([]);
        toast({ title: "No Skills Found", description: "The AI could not extract any skills from the resume. This might be due to the file's content or format. Please ensure your resume is clear and primarily text-based. PDF or TXT files work best." });
      }
    } catch (error) {
      console.error("Skill extraction error object:", error); // Log the raw error object for debugging

      let detailedErrorMessage = "An unknown error occurred during skill extraction.";
      let toastDescription = `Could not extract skills. This may be due to file content, format, or an internal AI processing issue. Please try a different file or ensure it's a standard PDF, TXT, JPG, PNG, or WEBP.`;

      if (error instanceof Error) {
        detailedErrorMessage = error.message;
        // Check if the error message is the generic server component error
        if (detailedErrorMessage.includes("An error occurred in the Server Components render")) {
          detailedErrorMessage = "The server encountered an issue processing the file."; // More user-friendly
          toastDescription = "The server had trouble processing your file. This can happen with very complex files or unsupported internal structures. Please try a simpler PDF or a plain text (.txt) file.";
        } else {
          toastDescription = `Extraction failed: ${detailedErrorMessage}. Please check the file and try again. PDF or TXT files are recommended.`;
        }
      } else if (typeof error === 'string') {
        detailedErrorMessage = error;
        toastDescription = `Extraction failed: ${detailedErrorMessage}. Please check the file and try again.`;
      } else if (error && typeof error === 'object' && 'message' in error && typeof (error as any).message === 'string') {
        detailedErrorMessage = (error as any).message;
        if (detailedErrorMessage.includes("An error occurred in the Server Components render")) {
            detailedErrorMessage = "The server encountered an issue processing the file.";
            toastDescription = "The server had trouble processing your file. This can happen with very complex files or unsupported internal structures. Please try a simpler PDF or a plain text (.txt) file.";
        } else {
            toastDescription = `Extraction failed: ${detailedErrorMessage}. Please check the file and try again. PDF or TXT files are recommended.`;
        }
      }
      
      setError(`Skill extraction failed: ${detailedErrorMessage}.`);
      toast({
        title: "Extraction Failed",
        description: toastDescription,
        variant: "destructive",
        duration: 7000, // Longer duration for error messages
      });
      setExtractedSkills([]);
    } finally {
      setIsLoading(false);
    }
  };

  const isButtonDisabled = form.formState.isSubmitting;

  return (
    <Card className="w-full max-w-lg shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <UploadCloud className="h-6 w-6 text-primary" />
          <CardTitle className="text-2xl">Upload Your Resume</CardTitle>
        </div>
        <CardDescription>
          Upload your resume file (max {MAX_FILE_SIZE / (1024 * 1024)}MB). 
          For best skill extraction, use <strong>PDF</strong> or <strong>plain text (.txt)</strong> files.
          JPEG, PNG, and WEBP images are also accepted but may be less effective for resumes.
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
                  <FormLabel htmlFor="resumeFile" className="text-base">Resume File</FormLabel>
                  <FormControl>
                    <Input
                      id="resumeFile"
                      type="file"
                      accept={SUPPORTED_MIME_TYPES_FOR_SKILL_EXTRACTION.join(',')} 
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
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isButtonDisabled || form.formState.isLoading}>
              <Send className="mr-2 h-4 w-4" />
              {(isButtonDisabled || form.formState.isLoading) ? "Extracting..." : "Extract Skills"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

