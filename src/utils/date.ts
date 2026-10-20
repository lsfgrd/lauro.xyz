// Frontmatter dates are written as YYYY-MM-DD, which YAML parses into a Date (UTC)
type PublishDate = Date | string;

export const toISODate = (date: PublishDate) =>
  (date instanceof Date ? date.toISOString() : date).slice(0, 10);

export const formatDate = (date: PublishDate) =>
  toISODate(date).split("-").reverse().join("/");
