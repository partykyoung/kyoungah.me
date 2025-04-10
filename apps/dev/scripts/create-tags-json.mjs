import fs from "fs";
import matter from "gray-matter";

const cwd = process.cwd();
const POSTS_DERECTORY = `${cwd}/posts`;

function createTags() {
  const tagsMap = new Map();

  // posts 디렉토리 내의 모든 파일을 읽어와 태그 목록 생성
  fs.readdirSync(POSTS_DERECTORY).forEach((post) => {
    const file = fs.readFileSync(`${POSTS_DERECTORY}/${post}`, {
      encoding: "utf-8",
    });

    const {
      data: { tags, publish },
    } = matter(file);

    if (publish === false) {
      return;
    }

    (tags ?? []).forEach((tag) => {
      const count = tagsMap.has(tag) ? tagsMap.get(tag) + 1 : 1;

      tagsMap.set(tag, count);
    });
  });

  // 태그 목록을 JSON 형식으로 변환
  const tagsArray = Array.from(tagsMap, ([tag, count]) => ({
    tag,
    count,
  }));

  const JSONS_DERECTORY = `${cwd}/public/jsons`;

  if (!fs.existsSync(JSONS_DERECTORY)) {
    fs.mkdirSync(JSONS_DERECTORY);
  }

  const filePath = `${JSONS_DERECTORY}/tags.json`;
  const dataToSave = JSON.stringify(tagsArray);

  fs.writeFile(filePath, dataToSave, () => {});
}

createTags();
