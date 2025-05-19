// SkillExtraction story: As a user, I want the application to use GenAI to analyze my resume and extract key skills, so I can quickly identify and showcase my qualifications.

'use server';

/**
 * @fileOverview Extracts key skills from a resume using GenAI.
 *
 * - extractSkills - A function that extracts skills from a resume.
 * - ExtractSkillsInput - The input type for the extractSkills function.
 * - ExtractSkillsOutput - The return type for the extractSkills function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractSkillsInputSchema = z.object({
  resumeText: z
    .string()
    .describe('The text content of the resume from which skills will be extracted.'),
});
export type ExtractSkillsInput = z.infer<typeof ExtractSkillsInputSchema>;

const ExtractSkillsOutputSchema = z.object({
  skills: z
    .array(z.string())
    .describe('An array of key skills extracted from the resume.'),
});
export type ExtractSkillsOutput = z.infer<typeof ExtractSkillsOutputSchema>;

export async function extractSkills(input: ExtractSkillsInput): Promise<ExtractSkillsOutput> {
  return extractSkillsFlow(input);
}

const extractSkillsPrompt = ai.definePrompt({
  name: 'extractSkillsPrompt',
  input: {schema: ExtractSkillsInputSchema},
  output: {schema: ExtractSkillsOutputSchema},
  prompt: `You are an AI resume analyzer. Your task is to extract key skills from the provided resume text.

  Resume Text: {{{resumeText}}}

  Return the extracted skills as an array of strings.`, //Crucially following instructions.
});

const extractSkillsFlow = ai.defineFlow(
  {
    name: 'extractSkillsFlow',
    inputSchema: ExtractSkillsInputSchema,
    outputSchema: ExtractSkillsOutputSchema,
  },
  async input => {
    const {output} = await extractSkillsPrompt(input);
    return output!;
  }
);
