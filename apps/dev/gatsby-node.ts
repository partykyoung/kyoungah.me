import path from "path";

import type { CreateNodeArgs, CreatePagesArgs } from "gatsby";

import { createFilePath } from "gatsby-source-filesystem";

async function createPages({ graphql, actions }: CreatePagesArgs) {
  const { createPage } = actions;

  const result = await graphql(`
    {
      allMdx(sort: { frontmatter: { date: DESC } }) {
        nodes {
          id
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM D, YYYY")
            publish
            tags
            title
          }
          internal {
            contentFilePath
          }
        }
      }
    }
  `);

  const { nodes } = result.data.allMarkdownRemark;

  nodes.forEach((node) => {
    createPage({
      path: node.fields.slug,
      component: `${path.resolve(
        `./src/pages/post.tsx`
      )}?__contentFilePath=${node.internal.contentFilePath}`,
      context: {
        id: node.id,
        slug: node.fields.slug,
        excerpt: node.excerpt,
        title: node.frontmatter.title,
        date: node.frontmatter.date,
      },
    });
  });
}

function onCreateNode({ node, getNode, actions }: CreateNodeArgs) {
  const { createNodeField } = actions;

  if (node.internal.type === `MarkdownRemark`) {
    const slug = createFilePath({ node, getNode, basePath: "posts" });

    createNodeField({
      node,
      name: "slug",
      value: slug,
    });
  }
}

export { createPages, onCreateNode };
