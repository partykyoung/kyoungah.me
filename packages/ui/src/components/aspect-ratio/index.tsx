interface AspectRatioProps extends React.HTMLAttributes<HTMLDivElement> {
  ratio: number;
}

function AspectRatio({ className, ratio, style, ...props }: AspectRatioProps) {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        paddingBottom: `${100 / ratio}%`,
      }}
    >
      <div
        {...props}
        style={{
          ...style,
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        }}
      />
    </div>
  );
}

export { AspectRatio };
