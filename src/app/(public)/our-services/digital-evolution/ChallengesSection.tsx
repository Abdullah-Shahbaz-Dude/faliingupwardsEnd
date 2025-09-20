import { IMAGE_PATHS } from "@/config/images";
import { challenges } from "@/data/digital-evolution";
import ChallengeCard from "@/components/common/ChallengeCard";

const ChallengesSection = () => {
  if (!challenges) {
    return (
      <section className="px-4 sm:px-6 md:px-12 py-10">
        <div className="grid gap-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 max-w-7xl mx-auto px-6 md:px-0 mt-16">
          {Array(4)
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                className="animate-pulse bg-gray-200 h-20 w-full rounded-2xl"
              ></div>
            ))}
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 sm:px-6 md:px-12 py-10">
      {/* Heading Container */}
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight text-[#0B4073] leading-tight">
          Are you facing any of these challenges?
        </h2>
      </div>

      <div
        role="list"
        className="grid gap-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 max-w-7xl mx-auto px-6 md:px-0 mt-16"
      >
        {challenges.map((challenge) => (
          <ChallengeCard key={challenge.id} text={challenge.text} />
        ))}
      </div>
    </section>
  );
};
export default ChallengesSection;
