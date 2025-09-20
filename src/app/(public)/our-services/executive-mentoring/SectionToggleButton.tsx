import { JSX } from "react";

// Reusable Components
interface SectionToggleButtonProps {
  isActive: boolean;
  onClick: () => void;
  icon: JSX.Element;
  title: string;
}

const SectionToggleButton: React.FC<SectionToggleButtonProps> = ({
  isActive,
  onClick,
  icon,
  title,
}) => (
  <button
    onClick={onClick}
    className={`group p-6 rounded-xl transition-all duration-300 flex flex-col items-center text-center ${
      isActive
        ? "bg-[#0B4073] text-white shadow-lg"
        : "bg-white hover:bg-[#D6E2EA]/30 text-gray-700 shadow-md hover:shadow-lg"
    }`}
  >
    <div
      className={`p-4 rounded-full mb-4 ${isActive ? "bg-white/20" : "bg-[#D6E2EA]"}`}
    >
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
  </button>
);

export default SectionToggleButton;
