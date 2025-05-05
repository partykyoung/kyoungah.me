import fs from "fs";
import input from "@inquirer/input";
import checkbox, { Separator } from "@inquirer/checkbox";
import dayjs from "dayjs";

interface PostData {
  title: string;
  tags?: string[];
}

interface PostFileInfo {
  postTitle: string;
  postFileName: string;
}

function setPostFileName(postTitle: string): string {
  return postTitle.split(" ").join("-");
}

function getTags(postsDirectory: string): string[] {
  try {
    const extistTags = fs
      .readdirSync(postsDirectory, {
        withFileTypes: true,
      })
      .reduce((acc: Set<string>, post) => {
        try {
          const file = fs.readFileSync(
            `${postsDirectory}/${post.name}`,
            "utf8"
          );
          const tagRegex = /tags:\s*\[([^\]]+)\]/g;
          const match = file.match(tagRegex);

          if (!match || match.length <= 0) return acc;

          const tagsString = match[0].replace(/tags:\s*/g, "");
          const tags = JSON.parse(tagsString);

          if (!tags || tags.length <= 0) return acc;

          tags.forEach((tag: string) => {
            acc.add(tag);
          });

          return acc;
        } catch {
          return acc;
        }
      }, new Set<string>());

    return Array.from(extistTags);
  } catch (error) {
    console.error("Error reading tags:", error);
    return [];
  }
}

async function fetchPostTitle(postsDirectory: string): Promise<PostFileInfo> {
  const postTitle = await input({ message: "포스트명을 입력해주세요" });
  const postFileName = setPostFileName(postTitle);

  const existFile = fs.existsSync(`${postsDirectory}/${postFileName}.md`);

  if (existFile) {
    throw new Error("동일한 제목의 포스트가 존재합니다");
  }

  return { postTitle, postFileName };
}

async function fetchNewTags(
  newTags: string[] = [],
  extistTags: string[] = []
): Promise<string[]> {
  const newTag = await input({
    message: "태그를 입력해주세요 (n을 입력하면 종료합니다)",
  });

  if (!newTag || newTag === "n" || newTag === "N") {
    return newTags;
  }

  newTags.push(newTag);

  return await fetchNewTags(newTags, extistTags);
}

async function fetchPostTags(postsDirectory: string): Promise<string[]> {
  const extistTags = getTags(postsDirectory);
  const choicesTags = extistTags.map((tag) => ({ name: tag, value: tag }));
  const selectedTags = await checkbox({
    message: "태그를 선택해주세요",
    choices: [
      ...choicesTags,
      new Separator(),
      { name: "태그 입력하기", value: "new" },
    ],
    loop: false,
  });

  const newIndex = selectedTags.findIndex((tag) => tag === "new");
  const hasNewTag = newIndex >= 0;

  if (hasNewTag) {
    const newTags = await fetchNewTags([], extistTags);

    selectedTags.push(...newTags);
  }

  return hasNewTag
    ? [...selectedTags.slice(0, newIndex), ...selectedTags.slice(newIndex + 1)]
    : selectedTags;
}

function refinePostContent({ title, tags }: PostData): string {
  const postTitle = `\ntitle: ${title}\n`;
  const postDate = `date: ${dayjs().format("YYYY-MM-DD HH:mm:ss")}\n`;
  const postTags =
    tags && tags.length > 0 ? `tags: ${JSON.stringify(tags)}\n` : "";
  const publish = `publish: false\n`;

  return `---${postTitle}${postDate}${postTags}${publish}---`;
}

async function createNewPost(): Promise<void> {
  const cwd = process.cwd();
  const POSTS_DIRECTORY = `${cwd}/posts`;

  try {
    // Ensure the posts directory exists
    if (!fs.existsSync(POSTS_DIRECTORY)) {
      console.error(`Posts directory not found: ${POSTS_DIRECTORY}`);
      return;
    }

    const { postFileName, postTitle } = await fetchPostTitle(POSTS_DIRECTORY);
    const postTags = await fetchPostTags(POSTS_DIRECTORY);
    const postContent = refinePostContent({
      title: postTitle,
      tags: postTags,
    });

    fs.writeFileSync(`${POSTS_DIRECTORY}/${postFileName}.md`, postContent);
    console.log("포스트 생성 완료!");
  } catch (error) {
    console.error("Error creating post:", error);
  }
}

export { createNewPost };
