const fs = require("fs");
const path = require("path");
const glob = require("glob");

let result = `import { Post } from "./Post";\n`;

const posts = [];

for (const [index, file] of glob.sync("articles/**/*.md").entries()) {
  const postIndexStr = `post_${index}`;
  posts.push(postIndexStr);
  result += `import ${postIndexStr} from "../../${file}";\n`;
}

result += `
const posts = ${JSON.stringify(posts).replace(/"/g, "")} as unknown as [Post];
export { posts };
`;

fs.writeFileSync("src/models/Posts.ts", result);
