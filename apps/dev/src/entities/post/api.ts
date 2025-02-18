async function getPosts() {
  const response = await fetch("/jsons/page1.json");
  const data = await response.json();

  return data;
}

export { getPosts };
