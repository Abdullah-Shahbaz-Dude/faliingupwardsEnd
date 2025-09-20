import Image from "next/image";
import { IMAGE_PATHS } from "@/config/images";

interface ChallengeCardProps {
  text: string;
}

const ChallengeCard = ({ text }: ChallengeCardProps) => {
  return (
    <div className="flex items-start p-6 bg-white/90 backdrop-blur-md border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group">
      <div className="text-[#0B4073] mt-1 mr-4 shrink-0">
        <div className="flex items-center space-x-3">
          <Image
            src={IMAGE_PATHS.favicon}
            alt="icon"
            className="h-6 w-6 group-hover:scale-110 transition-transform"
            width={24}
            height={24}
          />
        </div>
      </div>
      <p className="text-gray-800 text-lg leading-relaxed">
        {text}
      </p>
    </div>
  );
};

export default ChallengeCard;
