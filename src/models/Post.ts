export interface PostInfo {
  tags: [string];
  categories: string;
  date: Date;
  title: string;
}

export interface Post {
  /// the object created by parsing front-matter
  data: PostInfo;

  /// the input string, with matter stripped
  content: string;
  /// the input html string, with matter stripped
  contentHtml: string;

  /// an excerpt, if defined on the options
  excerpt: string;
  /// an excerpt html string, if defined on the options
  excerptHtml: string;

  /// true if front-matter is empty.
  isEmpty: boolean;
  /// when the front-matter is "empty" (either all whitespace, nothing at all, or just comments and no data), the original string is set on this
  empty: string;
}
