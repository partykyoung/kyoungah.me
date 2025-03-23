import * as runtime from "react/jsx-runtime";

import {
  PostDetailH1,
  PostDetailH2,
  PostDetailH3,
  PostDetailH4,
  PostDetailH5,
  PostDetailH6,
} from "@kyoungah.me/ui/build/components/post-detail";
import clsx from "clsx";

const sharedComponents = {
  h1: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
    return <PostDetailH1 className={clsx("h1", className)} {...props} />;
  },
  h2: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
    return <PostDetailH2 className={clsx("h2", className)} {...props} />;
  },
  h3: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
    return <PostDetailH3 className={clsx("h3", className)} {...props} />;
  },
  h4: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
    return <PostDetailH4 className={clsx("h4", className)} {...props} />;
  },
  h5: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
    return <PostDetailH5 className={clsx("h5", className)} {...props} />;
  },
  h6: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
    return <PostDetailH6 className={clsx("h6", className)} {...props} />;
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
