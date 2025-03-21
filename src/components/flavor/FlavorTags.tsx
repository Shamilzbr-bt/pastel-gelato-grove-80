
import { cn } from "@/lib/utils";
import { getTagClass } from "@/utils/formatters";

interface FlavorTagsProps {
  tags: string[];
  className?: string;
}

export default function FlavorTags({ tags, className }: FlavorTagsProps) {
  return (
    <div className={cn("flex flex-wrap", className)}>
      {tags.map((tag, index) => (
        <span 
          key={index} 
          className={cn("flavor-tag", getTagClass(tag))}
        >
          {tag}
        </span>
      ))}
    </div>
  );
}
