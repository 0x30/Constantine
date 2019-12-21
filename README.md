# constantine

该项目主要为 VUE 生成单页 Blog.

## 使用

1. git clone 到本地
2. cd && npm install
3. 文章放在 articles 中
4. 引入 `src/models/Posts.ts` 即可获取所有文章

该项目，刚开始，百废待兴

## 原理

主要运行方式为,使用 `webpack` 进行运行时处理文章成为json对象。

自定义 `md-loader` 将 mardown 解析为 JSON对象

```ts
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
```

自定义 `AiticlePlugin` 组件，在markdown 文件发生变化时，进行实时编译，并将结果 导出到 `Posts.ts`