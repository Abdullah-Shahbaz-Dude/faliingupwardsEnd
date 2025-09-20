import { useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

interface AccordionItemProps {
  title: string;
  content: React.ReactNode;
  isOpen?: boolean;
}

function AccordionItem({ title, content, isOpen = false }: AccordionItemProps) {
  const [expanded, setExpanded] = useState(isOpen);
  const id = `accordion-content-${title.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div className="border-b border-[#D6E2EA]">
      <button
        className="w-full py-4 px-5 flex justify-between items-center bg-[#D6E2EA]/30 rounded-lg hover:bg-[#D6E2EA]/40"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        aria-controls={id}
      >
        <span className="font-medium text-left text-[#18425e]">{title}</span>
        <div className="w-8 h-8 flex items-center justify-center text-[#7094B7] rounded-full">
          {expanded ? (
            <FiChevronUp className="text-lg" />
          ) : (
            <FiChevronDown className="text-lg" />
          )}
        </div>
      </button>
      <div
        id={id}
        className={`overflow-hidden transition-all duration-300 ${expanded ? "max-h-[1000px] py-4 px-5" : "max-h-0"}`}
        aria-hidden={!expanded}
      >
        <div className="text-gray-800 text-sm sm:text-base leading-relaxed space-y-2">
          {content}
        </div>
      </div>
    </div>
  );
}
export default AccordionItem;
