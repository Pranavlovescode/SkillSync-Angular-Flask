"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ChevronRight, Sparkles, Users, Code, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Hero = () => {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <section className="relative overflow-hidden bg-black text-white pt-16 md:pt-20 lg:pt-28">
      {/* Animated background elements - darker gradients for dark mode */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-[40%] -right-[60%] h-[800px] w-[800px] rounded-full bg-purple-900/10 blur-3xl" />
        <div className="absolute -bottom-[20%] -left-[20%] h-[600px] w-[600px] rounded-full bg-blue-900/10 blur-3xl" />
      </div>

      <div className="container px-4 md:px-6">
        <motion.div
          ref={ref}
          className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <motion.div
            className="flex flex-col items-start space-y-8"
            variants={itemVariants}
          >
            <Badge
              className="bg-purple-900/30 text-purple-300 hover:bg-purple-800/40 px-4 py-2 text-sm animate-pulse"
              variant="secondary"
            >
              <Sparkles className="mr-2 h-4 w-4" /> Revolutionizing Skill
              Matching
            </Badge>

            <motion.h1
              className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"
              variants={itemVariants}
            >
              Connect Skills, <br />
              <span className="text-white">Build Futures</span>
            </motion.h1>

            <motion.p
              className="max-w-[600px] text-gray-300 text-lg sm:text-xl"
              variants={itemVariants}
            >
              SkillSync matches talent with opportunity, connecting skilled
              professionals with the projects and teams that need them most.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-4"
              variants={itemVariants}
            >
              <Link href="/auth/login">
                <Button
                  size="lg"
                  className="h-12 px-8 gap-2 group bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Get Started
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8 border-gray-500 hover:bg-gray-800/50 text-black hover:text-white"
              >
                Learn More
              </Button>
            </motion.div>

            <motion.div
              className="grid grid-cols-3 gap-4 pt-8 text-center"
              variants={itemVariants}
            >
              <div className="rounded-xl bg-gray-900/70 backdrop-blur-sm p-4 border border-gray-700 shadow-lg">
                <h3 className="text-2xl font-bold text-blue-400">2000+</h3>
                <p className="text-sm text-gray-300">Active Users</p>
              </div>
              <div className="rounded-xl bg-gray-900/70 backdrop-blur-sm p-4 border border-gray-700 shadow-lg">
                <h3 className="text-2xl font-bold text-blue-400">500+</h3>
                <p className="text-sm text-gray-300">Projects Matched</p>
              </div>
              <div className="rounded-xl bg-gray-900/70 backdrop-blur-sm p-4 border border-gray-700 shadow-lg">
                <h3 className="text-2xl font-bold text-blue-400">95%</h3>
                <p className="text-sm text-gray-300">Success Rate</p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="relative flex items-center justify-center lg:justify-end"
            variants={itemVariants}
          >
            <div className="relative">
              <motion.div
                className="absolute -top-6 -left-6 bg-blue-900/30 rounded-lg p-4 backdrop-blur-sm border border-blue-700/30 shadow-xl"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: isLoaded ? 1 : 0, opacity: isLoaded ? 1 : 0 }}
                transition={{ delay: 0.6, type: "spring" }}
              >
                <Users className="h-6 w-6 text-blue-300" />
                <p className="text-sm font-medium text-white">Perfect Match</p>
              </motion.div>

              <motion.div
                className="absolute -bottom-6 -right-6 bg-purple-900/30 rounded-lg p-4 backdrop-blur-sm border border-purple-700/30 shadow-xl"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: isLoaded ? 1 : 0, opacity: isLoaded ? 1 : 0 }}
                transition={{ delay: 0.9, type: "spring" }}
              >
                <TrendingUp className="h-6 w-6 text-purple-300" />
                <p className="text-sm font-medium text-white">Grow Together</p>
              </motion.div>

              <motion.div
                className="absolute -bottom-6 -left-6 bg-indigo-900/30 rounded-lg p-4 backdrop-blur-sm border border-indigo-700/30 shadow-xl"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: isLoaded ? 1 : 0, opacity: isLoaded ? 1 : 0 }}
                transition={{ delay: 0.7, type: "spring" }}
              >
                <Code className="h-6 w-6 text-indigo-300" />
                <p className="text-sm font-medium text-white">
                  Skill Development
                </p>
              </motion.div>

              <motion.div
                className="rounded-2xl overflow-hidden border border-gray-700 shadow-2xl"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: isLoaded ? 0 : 100, opacity: isLoaded ? 1 : 0 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 50 }}
              >
                <img
                  src="/skillsync-dashboard.png"
                  alt="SkillSync Dashboard"
                  className="w-full h-auto object-cover"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://placehold.co/600x400/0f172a/e2e8f0?text=SkillSync+Dashboard";
                  }}
                />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="mt-20 mb-10 flex flex-col items-center text-center"
          variants={itemVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <div className="space-y-4 max-w-[800px]">
            <h2 className="text-3xl font-bold text-white">
              Trusted by innovators worldwide
            </h2>
            <p className="text-gray-300">
              Join thousands of professionals and companies who use SkillSync to
              find their perfect match
            </p>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-8 opacity-70">
            {[
              "Company 1",
              "Company 2",
              "Company 3",
              "Company 4",
              "Company 5",
            ].map((company, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: isLoaded ? 0.7 : 0 }}
                transition={{ delay: 0.2 * i + 1 }}
                className="flex items-center justify-center"
              >
                <div className="text-xl font-bold text-gray-400">{company}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
