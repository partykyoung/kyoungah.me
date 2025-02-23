import React from "react";
import { graphql } from "gatsby";

export const query = graphql`
  query ($slug: String) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      frontmatter {
        title
      }
    }
  }
`;

const BlogPost = () => {
  return <div>ㅎㅇ</div>;
};

export default BlogPost;
