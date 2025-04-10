import fs from "fs";
import matter from "gray-matter";

const cwd = process.cwd();

function createJSON(pageData) {
  const JSONS_DERECTORY = `${cwd}/public/jsons`;

  if (!fs.existsSync(JSONS_DERECTORY)) {
    fs.mkdirSync(JSONS_DERECTORY);
  }

  const filePath = `${JSONS_DERECTORY}/page${pageData.pageSuffix}.json`;
  const dataToSave = JSON.stringify(pageData.context);

  fs.writeFile(filePath, dataToSave, () => {});
}

function extractDateFromMarkdown(fileContent, post) {
  const { data: frontmatter, content } = matter(fileContent);

  // 3. 마크다운 문법 제거 (정규식 활용)
  const onlyContentText = content
    .replace(/#+\s+/g, "") // 제목 (#, ##, ### 등)
    .replace(/```[\s\S]*?```/g, "") // 코드 블록 (``` 코드 ```)
    .replace(/`([^`]+)`/g, "$1") // 인라인 코드 (`code`)
    .replace(/\*\*([^*]+)\*\*/g, "$1") // 볼드 (**bold**)
    .replace(/\*([^*]+)\*/g, "$1") // 이탤릭 (*italic*)
    .replace(/!\[.*?\]\(.*?\)/g, "") // 이미지 (![alt](url))
    .replace(/\[(.*?)\]\(.*?\)/g, "$1") // 링크 [텍스트](url) -> 텍스트만 남김
    .replace(/>\s+/g, "") // 인용문 (>)
    .replace(/[-*+] /g, "") // 리스트 (- item, * item, + item)
    .replace(/\n+/g, " ") // 줄바꿈을 공백으로 변경
    .replace(/\s{2,}/g, " ") // 연속된 공백을 하나로 축소
    .trim();

  // 4. 본문 150자 추출
  const excerpt = onlyContentText.slice(0, 150).trim();
  const [slug] = post.split(".");

  return {
    ...frontmatter,
    slug: `/${slug}`,
    excerpt,
  };
}

function createPagniationJson() {
  const POSTS_DERECTORY = `${cwd}/posts`;

  const posts = fs
    .readdirSync(POSTS_DERECTORY)
    .map((post) => {
      const file = fs.readFileSync(`${POSTS_DERECTORY}/${post}`, {
        encoding: "utf-8",
      });

      return extractDateFromMarkdown(file, post);
    })
    .filter((post) => post.publish === true);

  posts.sort((prev, next) => {
    return new Date(next.date).getTime() - new Date(prev.date).getTime();
  });

  const POSTS_PER_PAGE = 10;
  const numPages = Math.ceil(posts.length / POSTS_PER_PAGE);

  for (let i = 0; i < numPages; i++) {
    const skip = i * POSTS_PER_PAGE;
    const pagePosts = posts.filter((_, postIndex) => {
      return postIndex >= skip && postIndex < skip + 10;
    });

    createJSON({
      pageSuffix: `${i + 1}`,
      context: {
        limit: POSTS_PER_PAGE,
        skip,
        numPages,
        currentPage: i + 1,
        posts: pagePosts,
      },
    });
  }
}

createPagniationJson();
