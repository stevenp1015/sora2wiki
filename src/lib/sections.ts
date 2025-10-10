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

const toPlainText = (content: string) =>
  content
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/!\[(.*?)\]\((.*?)\)/g, "$1")
    .replace(/\[(.*?)\]\((.*?)\)/g, "$1")
    .replace(/^>+\s?/gm, "")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^\s*([-*+]|(\d+\.))\s+/gm, "")
    .replace(/(\*{1,3}|_{1,3})(\S.*?\S?)\1/g, "$2")
    .replace(/~~(.*?)~~/g, "$1")
    .replace(/<\/?[^>]+>/g, " ")
    .replace(/\r?\n+/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();

const estimateReadingTime = (plainText: string) => {
  const words = plainText.split(/\s+/).filter(Boolean);
  return Math.max(1, Math.round(words.length / 200));
};

const createSummary = (plainText: string) => {
  const sentences = plainText
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
    const cleanText = toPlainText(headingText);
    const id = slugify(cleanText || headingText);
    headings.push({ id, level, text: cleanText });
  }

  return headings;
};

const sections: GuideSection[] = rawSections.map((section) => {
  const fullTitle = section.full_title ?? section.fullTitle;
  const plainText = toPlainText(section.content);
  return {
    id: section.id,
    title: section.title,
    fullTitle: fullTitle && fullTitle.trim().length > 0 ? fullTitle : undefined,
    content: section.content,
    summary: createSummary(plainText),
    readingTimeMinutes: estimateReadingTime(plainText),
    headings: extractHeadings(section.content),
  };
});

export default sections;
