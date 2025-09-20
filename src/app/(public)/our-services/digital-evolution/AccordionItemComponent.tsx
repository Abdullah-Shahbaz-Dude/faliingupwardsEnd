import { digitalEvolutionData } from "@/data/digital-evolution";
import { memo } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDownIcon } from "lucide-react";

const { accordionItems } = digitalEvolutionData;

type AccordionItemComponentProps = {
  openIndex: number | null;
  handleToggle: (index: number) => void;
};

const AccordionItemComponent = memo(
  ({ openIndex, handleToggle }: AccordionItemComponentProps) => {
    const shouldReduceMotion = useReducedMotion();
    const transition = shouldReduceMotion ? { duration: 0 } : { duration: 0.2 };

    if (!accordionItems) {
      return (
        <div className="animate-pulse bg-gray-200 h-10 w-full rounded"></div>
      );
    }
    return (
      <section className="bg-gray-50 p-8 md:p-12 font-sans">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-[#0B4073] mb-6 md:mb-8 text-center">
            What Makes Falling Upwards Different?
          </h2>

          <div className="space-y-4 mt-10">
            {accordionItems.map((item, index) => (
              <div
                key={index}
                className="bg-[#D6E2EA] rounded-xl shadow transition-all duration-300 ease-in-out"
              >
                <button
                  onClick={() => handleToggle(index)}
                  onKeyDown={(e) =>
                    (e.key === "Enter" || e.key === " ") && handleToggle(index)
                  }
                  className="w-full flex justify-between items-center p-10 text-left focus:outline-none focus:ring-2 focus:ring-[#E5ECF6] rounded-t-xl"
                  aria-expanded={openIndex === index}
                  aria-controls={`accordion-content-${index}`}
                  aria-labelledby={`accordion-title-${index}`}
                >
                  <span
                    id={`accordion-title-${index}`}
                    className="text-lg font-semibold "
                  >
                    {item.title}
                  </span>
                  <motion.div
                    initial={false}
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={transition}
                  >
                    <ChevronDownIcon className="w-6 h-6 text-sky-600" />
                  </motion.div>
                </button>

                {/* Accordion Content */}
                <AnimatePresence initial={false}>
                  {openIndex === index && (
                    <motion.div
                      id={`accordion-content-${index}`}
                      role="region"
                      aria-labelledby={`accordion-title-${index}`}
                      key="content"
                      initial="collapsed"
                      animate="open"
                      exit="collapsed"
                      variants={{
                        open: {
                          height: "auto",
                          opacity: 1,
                          minHeight:
                            item.content.length < 50 ? "50px" : "100px",
                        },
                        collapsed: { height: 0, opacity: 0 },
                      }}
                      className="overflow-hidden"
                      transition={transition}
                      style={{ willChange: "height, opacity" }}
                    >
                      <div className="px-5 pb-5 pt-2 text-[#072e53] leading-relaxed border-t border-sky-200">
                        {item.content}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
);

export default AccordionItemComponent;
