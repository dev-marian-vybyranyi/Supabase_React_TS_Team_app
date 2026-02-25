import { Loader2 } from "lucide-react";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
  text?: string;
}

const sizeMap = {
  sm: "h-5 w-5",
  md: "h-8 w-8",
  lg: "h-12 w-12",
};

export default function Loader({
  size = "md",
  fullScreen = false,
  text,
}: LoaderProps) {
  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <Loader2 className={`${sizeMap[size]} animate-spin text-green-600`} />
      {text && (
        <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex w-full items-center justify-center py-8">
      {spinner}
    </div>
  );
}
