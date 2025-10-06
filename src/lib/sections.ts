import rawSections from "./guideContent.json";

export type SectionHeading = {
  id: string;
  level: number;
  text: string;
};

export type GuideSection = {
  id: string;
  title: string;
  fullTitle?: string;
  content: string;
  summary: string;
  readingTimeMinutes: number;
  headings: SectionHeading[];
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

const estimateReadingTime = (content: string) => {
  const words = content.split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
};

const createSummary = (content: string) => {
  const sentences = content
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/);

  const firstMeaningful = sentences.find((sentence) => sentence.length > 40);
  const summary = firstMeaningful ?? sentences.slice(0, 2).join(" ");
  return summary.trim();
};

const extractHeadings = (content: string): SectionHeading[] => {
  const lines = content.split("\n");
  const headings: SectionHeading[] = [];

  for (const line of lines) {
    const headingMatch = /^(#{1,3})\s+(.*)/.exec(line.trim());
    if (!headingMatch) continue;

    const [, hashes, headingText] = headingMatch;
    const level = hashes.length;
    const cleanText = headingText.replace(/\*\*/g, "").trim();
    const id = slugify(cleanText || headingText);
    headings.push({ id, level, text: cleanText });
  }

  return headings;
};

const sections: GuideSection[] = rawSections.map((section) => {
  const fullTitle = section.full_title ?? section.fullTitle;
  return {
    id: section.id,
    title: section.title,
    fullTitle: fullTitle && fullTitle.trim().length > 0 ? fullTitle : undefined,
    content: section.content,
    summary: createSummary(section.content),
    readingTimeMinutes: estimateReadingTime(section.content),
    headings: extractHeadings(section.content),
  };
});

export default sections;
