import * as runtime from "react/jsx-runtime";
import { ImageProps } from "next/image";
import { LinkProps } from "next/link";

import * as PostDetailEmements from "../post-detail-elements";

const sharedComponents = {
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => {
    return <PostDetailEmements.H2 {...props} />;
  },
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => {
    return <PostDetailEmements.H3 {...props} />;
  },
  h4: (props: React.HTMLAttributes<HTMLHeadingElement>) => {
    return <PostDetailEmements.H4 {...props} />;
  },
  h5: (props: React.HTMLAttributes<HTMLHeadingElement>) => {
    return <PostDetailEmements.H5 {...props} />;
  },
  h6: (props: React.HTMLAttributes<HTMLHeadingElement>) => {
    return <PostDetailEmements.H6 {...props} />;
  },
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => {
    return <PostDetailEmements.P {...props} />;
  },
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => {
    return <PostDetailEmements.Ul {...props} />;
  },
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => {
    return <PostDetailEmements.Ol {...props} />;
  },
  li: (props: React.HTMLAttributes<HTMLLIElement>) => {
    return <PostDetailEmements.Li {...props} />;
  },
  a: (
    props: LinkProps &
      Pick<React.AnchorHTMLAttributes<HTMLAnchorElement>, "className">
  ) => {
    return <PostDetailEmements.Link {...props} />;
  },
  img: (props: ImageProps) => {
    return <PostDetailEmements.Img {...props} />;
  },
  div: (props: React.HTMLAttributes<HTMLDivElement>) => {
    return <PostDetailEmements.Div {...props} />;
  },
  figure: (props: React.HTMLAttributes<HTMLElement>) => {
    return <PostDetailEmements.Figure {...props} />;
  },
  figcaption: (props: React.HTMLAttributes<HTMLElement>) => {
    return <PostDetailEmements.FigureCaption {...props} />;
  },
};

const useMDXComponent = (code: string) => {
  const fn = new Function(code);

  return fn({ ...runtime }).default;
};

interface MDXProps {
  code: string;
  components?: Record<string, React.ComponentType>;
}

// MDXContent component
export const MDXContent = (props: MDXProps) => {
  const Component = useMDXComponent(props.code);
  return (
    <Component components={{ ...sharedComponents, ...props.components }} />
  );
};
