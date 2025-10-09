import rawSections from "./wiki-content.json";

export type SectionHeading = {
  id: string;
  level: number;
  text: string;
};

export type GuidePage = {
  id: string;
  title: string;
  content: string;
  summary: string;
  readingTimeMinutes: number;
  headings: SectionHeading[];
};

export type GuideSection = {
  id: string;
  title: string;
  fullTitle?: string;
  pages: GuidePage[];
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
    const headingMatch = /^(#{2,3})\s+(.*)/.exec(line.trim());
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
  const fullTitle = section.fullTitle;

  const pages: GuidePage[] = section.pages.map((page) => ({
    id: page.id,
    title: page.title,
    content: page.content,
    summary: createSummary(page.content),
    readingTimeMinutes: estimateReadingTime(page.content),
    headings: extractHeadings(page.content),
  }));

  return {
    id: section.id,
    title: section.title,
    fullTitle: fullTitle && fullTitle.trim().length > 0 ? fullTitle : undefined,
    pages,
  };
});

export default sections;