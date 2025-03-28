import * as runtime from "react/jsx-runtime";

import * as PostDetailEmements from "../post-detail-elements";
import clsx from "clsx";
import { ImageProps } from "next/image";
import { LinkProps } from "next/link";

const sharedComponents = {
  h2: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
    return (
      <PostDetailEmements.H2 className={clsx("h2", className)} {...props} />
    );
  },
  h3: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
    return (
      <PostDetailEmements.H3 className={clsx("h3", className)} {...props} />
    );
  },
  h4: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
    return (
      <PostDetailEmements.H4 className={clsx("h4", className)} {...props} />
    );
  },
  h5: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
    return (
      <PostDetailEmements.H5 className={clsx("h5", className)} {...props} />
    );
  },
  h6: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
    return (
      <PostDetailEmements.H6 className={clsx("h6", className)} {...props} />
    );
  },
  p: ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => {
    return <PostDetailEmements.P className={clsx("p", className)} {...props} />;
  },
  ul: ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => {
    return (
      <PostDetailEmements.Ul className={clsx("ul", className)} {...props} />
    );
  },
  ol: ({ className, ...props }: React.HTMLAttributes<HTMLOListElement>) => {
    return (
      <PostDetailEmements.Ol className={clsx("ol", className)} {...props} />
    );
  },
  li: ({ className, ...props }: React.HTMLAttributes<HTMLLIElement>) => {
    return (
      <PostDetailEmements.Li className={clsx("li", className)} {...props} />
    );
  },
  a: ({
    className,
    ...props
  }: LinkProps &
    Pick<React.AnchorHTMLAttributes<HTMLAnchorElement>, "className">) => {
    return (
      <PostDetailEmements.Link className={clsx("link", className)} {...props} />
    );
  },
  img: ({ className, ...props }: ImageProps) => {
    return (
      <PostDetailEmements.Img className={clsx("img", className)} {...props} />
    );
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
export const MDXContent = ({ code, components = {} }: MDXProps) => {
  const Component = useMDXComponent(code);
  return <Component components={{ ...sharedComponents, ...components }} />;
};
