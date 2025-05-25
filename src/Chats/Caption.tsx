import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { assets } from "../assets/assets";

interface Insight {
  title: string;
  message: string;
}

type InsightCategory = "innovation" | "analytics" | "cloud" | "automation";

const aptusInsights: Record<InsightCategory, Insight[]> = {
  innovation: [
    {
      title: "AI-Powered Innovation",
      message:
        "Unlock the power of AI and data-driven insights with Aptus Data Labs!",
    },
    {
      title: "Transforming Businesses with AI",
      message:
        "From strategy to execution, we deliver intelligent automation and analytics.",
    },
    {
      title: "Data-Driven Decision Making",
      message:
        "Harness AI and analytics to make smarter, faster business decisions.",
    },
    {
      title: "Cloud & AI Synergy",
      message:
        "Optimize operations with cloud-based AI and automation solutions.",
    },
    {
      title: "Redefining Digital Transformation",
      message:
        "Innovate, scale, and accelerate with AI-driven cloud strategies.",
    },
  ],
  analytics: [
    {
      title: "Turn Data into Insights",
      message: "Leverage advanced analytics to drive growth and efficiency.",
    },
    {
      title: "Predict the Future with AI",
      message: "Our predictive analytics help you stay ahead of market trends.",
    },
    {
      title: "Smarter Data, Smarter Business",
      message: "We transform raw data into actionable intelligence.",
    },
    {
      title: "AI-Driven Business Intelligence",
      message:
        "From data mining to machine learning, we optimize your insights.",
    },
    {
      title: "Optimize Performance with AI",
      message:
        "Maximize efficiency with intelligent data solutions from Aptus Data Labs.",
    },
  ],
  cloud: [
    {
      title: "Empowering the Cloud Era",
      message:
        "AI-driven cloud solutions for scalable and secure transformation.",
    },
    {
      title: "Future-Proof Your Business",
      message:
        "Seamlessly migrate and manage your cloud infrastructure with AI.",
    },
    {
      title: "Cloud & AI: The Perfect Duo",
      message:
        "Enhance agility, efficiency, and innovation with cloud-based AI.",
    },
    {
      title: "AI-Powered Cloud Optimization",
      message:
        "Reduce costs and increase performance with AI-driven cloud automation.",
    },
    {
      title: "Seamless Cloud Migration",
      message:
        "Move to the cloud with confidence, backed by intelligent insights.",
    },
  ],
  automation: [
    {
      title: "Intelligent Automation at Scale",
      message:
        "Optimize workflows and eliminate inefficiencies with AI-driven automation.",
    },
    {
      title: "Redefining Productivity with AI",
      message:
        "Leverage AI to automate complex tasks and enhance business operations.",
    },
    {
      title: "AI-Powered Efficiency",
      message:
        "Reduce manual effort and increase accuracy with intelligent automation.",
    },
    {
      title: "Smart Workflows, Smarter Businesses",
      message: "Streamline operations with AI-powered workflow automation.",
    },
    {
      title: "The Future of Work is Automated",
      message: "Transform processes with cutting-edge AI and RPA solutions.",
    },
  ],
};

// Define Props
interface CaptionProps {
  isSidebarOpen: boolean;
  theme: string;
}

export default function Caption({ isSidebarOpen, theme }: CaptionProps) {
  // Define State
  const [caption, setCaption] = useState<Insight>({
    title: "",
    message: "",
  });

  const getRandomInsight = (category: InsightCategory): Insight => {
    const insightsList = aptusInsights[category];
    const randomIndex = Math.floor(Math.random() * insightsList.length);
    return insightsList[randomIndex];
  };

  const getCategory = (): InsightCategory => {
    const categories = Object.keys(aptusInsights) as InsightCategory[];
    const randomCategory =
      categories[Math.floor(Math.random() * categories.length)];
    return randomCategory;
  };

  useEffect(() => {
    const updateInsight = () => {
      const category = getCategory();
      const newInsight = getRandomInsight(category);
      setCaption(newInsight);
    };

    updateInsight();
    const interval = setInterval(updateInsight, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <motion.div
        className={
          isSidebarOpen
            ? "font-medium flex flex-col max-sm:ml-9 transition-all duration-500 ease-in-out font-default max-sm:w-4/5"
            : "font-medium flex flex-col transition-all duration-500 ease-in-out font-default max-sm:w-full max-sm:items-center max-sm:h-full max-sm:gap-2"
        }
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        <div className="xl:hidden max-sm:w-12 max-sm:h-10 max-sm:my-0 my-2">
          <img src={assets.AnnieCircle} />
        </div>
        <p className="text-xl text-atlantis-green text-center pb-2 max-sm:p-0 max-sm:text-xl">
          How Can I help you Today ?
        </p>
        <p
          className={
            isSidebarOpen
              ? `font-normal text-[1em] text-center tracking-wide max-sm:text-[0.8em] flex flex-col transition-colors duration-500 ease-in-out  ${
                  theme === "light" ? "z-50" : ""
                }`
              : `font-normal text-[0.9em] text-center tracking-wide max-sm:text-[0.8em] flex flex-col transition-colors duration-500 ease-in-out ${
                  theme === "light" ? "z-50" : ""
                }`
          }
        >
          <span className="max-sm:hidden">{caption.title}</span>
          {caption.message}
        </p>
      </motion.div>
    </>
  );
}
