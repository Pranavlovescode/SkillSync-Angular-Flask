import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  BookOpen, Code, Globe, Github, Twitter, Linkedin, 
  Mail, Heart, ArrowRight, MessageSquare, User, 
  Briefcase, FileText, HelpCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function Footer() {
  return (
    <>
      <footer className="w-full">
        {/* Newsletter signup section */}
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 py-12 px-6 backdrop-blur-sm border-t border-b border-zinc-800/50">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-md">
              <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-2">
                Join our community
              </h3>
              <p className="text-zinc-300">
                Get weekly updates, new job postings, and skill-building
                resources directly to your inbox.
              </p>
            </div>
            <div className="flex-1 w-full md:w-auto max-w-md relative group">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-5 py-3 pr-12 rounded-lg bg-zinc-900/80 border border-zinc-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
              <Button className="absolute right-1.5 top-1.5 h-9 px-3 rounded-md bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white transition-all group-hover:shadow-[0_0_20px_rgba(109,40,217,0.4)]">
                Subscribe <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Main footer content */}
        <div className="pb-12 px-6 bg-gradient-to-b from-zinc-950 to-zinc-900">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
              {/* Company info */}
              {/* <div className="space-y-4">
                <div className="flex items-center">
                  <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                    SkillSync
                  </h2>
                </div>
                <p className="text-zinc-400 text-sm max-w-xs">
                  Connect, collaborate, and grow with a community of skilled professionals and mentors across the globe.
                </p>
                <div className="flex items-center gap-4 pt-2">
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-500 hover:text-blue-400 transition-all transform hover:scale-110"
                    aria-label="Twitter"
                  >
                    <Twitter className="h-5 w-5" />
                  </a>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-500 hover:text-zinc-100 transition-all transform hover:scale-110"
                    aria-label="GitHub"
                  >
                    <Github className="h-5 w-5" />
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-500 hover:text-blue-500 transition-all transform hover:scale-110"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                  <a
                    href="mailto:contact@skillsync.com"
                    className="text-zinc-500 hover:text-red-400 transition-all transform hover:scale-110"
                    aria-label="Email"
                  >
                    <Mail className="h-5 w-5" />
                  </a>
                </div>
              </div> */}

              {/* Platform links */}
              {/* <div>
                <h3 className="text-lg font-semibold mb-4 text-white">Platform</h3>
                <ul className="space-y-2.5">
                  <li>
                    <Link href="/main" className="text-zinc-400 hover:text-blue-400 transition-colors flex items-center gap-2 group">
                      <span className="h-1 w-1 rounded-full bg-zinc-700 group-hover:bg-blue-400 group-hover:w-2 transition-all"></span>
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link href="/main/explore" className="text-zinc-400 hover:text-blue-400 transition-colors flex items-center gap-2 group">
                      <span className="h-1 w-1 rounded-full bg-zinc-700 group-hover:bg-blue-400 group-hover:w-2 transition-all"></span>
                      Explore
                    </Link>
                  </li>
                  <li>
                    <Link href="/main/posts" className="text-zinc-400 hover:text-blue-400 transition-colors flex items-center gap-2 group">
                      <span className="h-1 w-1 rounded-full bg-zinc-700 group-hover:bg-blue-400 group-hover:w-2 transition-all"></span>
                      Skill Posts
                    </Link>
                  </li>
                  <li>
                    <Link href="/main/create-post" className="text-zinc-400 hover:text-blue-400 transition-colors flex items-center gap-2 group">
                      <span className="h-1 w-1 rounded-full bg-zinc-700 group-hover:bg-blue-400 group-hover:w-2 transition-all"></span>
                      Create Post
                    </Link>
                  </li>
                  <li>
                    <Link href="/main/messages" className="text-zinc-400 hover:text-blue-400 transition-colors flex items-center gap-2 group">
                      <span className="h-1 w-1 rounded-full bg-zinc-700 group-hover:bg-blue-400 group-hover:w-2 transition-all"></span>
                      Messages
                    </Link>
                  </li>
                </ul>
              </div> */}

              {/* Resources links */}
              {/* <div>
                <h3 className="text-lg font-semibold mb-4 text-white">Resources</h3>
                <ul className="space-y-2.5">
                  <li>
                    <a href="/blog" className="text-zinc-400 hover:text-blue-400 transition-colors flex items-center gap-2 group">
                      <span className="h-1 w-1 rounded-full bg-zinc-700 group-hover:bg-blue-400 group-hover:w-2 transition-all"></span>
                      Blog
                    </a>
                  </li>
                  <li>
                    <a href="/tutorials" className="text-zinc-400 hover:text-blue-400 transition-colors flex items-center gap-2 group">
                      <span className="h-1 w-1 rounded-full bg-zinc-700 group-hover:bg-blue-400 group-hover:w-2 transition-all"></span>
                      Tutorials
                    </a>
                  </li>
                  <li>
                    <a href="/webinars" className="text-zinc-400 hover:text-blue-400 transition-colors flex items-center gap-2 group">
                      <span className="h-1 w-1 rounded-full bg-zinc-700 group-hover:bg-blue-400 group-hover:w-2 transition-all"></span>
                      Webinars
                    </a>
                  </li>
                  <li>
                    <a href="/documentation" className="text-zinc-400 hover:text-blue-400 transition-colors flex items-center gap-2 group">
                      <span className="h-1 w-1 rounded-full bg-zinc-700 group-hover:bg-blue-400 group-hover:w-2 transition-all"></span>
                      Documentation
                    </a>
                  </li>
                  <li>
                    <a href="/faq" className="text-zinc-400 hover:text-blue-400 transition-colors flex items-center gap-2 group">
                      <span className="h-1 w-1 rounded-full bg-zinc-700 group-hover:bg-blue-400 group-hover:w-2 transition-all"></span>
                      FAQ
                    </a>
                  </li>
                </ul>
              </div> */}

              {/* Company links */}
              {/* <div>
                <h3 className="text-lg font-semibold mb-4 text-white">Company</h3>
                <ul className="space-y-2.5">
                  <li>
                    <a href="/about" className="text-zinc-400 hover:text-blue-400 transition-colors flex items-center gap-2 group">
                      <span className="h-1 w-1 rounded-full bg-zinc-700 group-hover:bg-blue-400 group-hover:w-2 transition-all"></span>
                      About Us
                    </a>
                  </li>
                  <li>
                    <a href="/careers" className="text-zinc-400 hover:text-blue-400 transition-colors flex items-center gap-2 group">
                      <span className="h-1 w-1 rounded-full bg-zinc-700 group-hover:bg-blue-400 group-hover:w-2 transition-all"></span>
                      Careers
                    </a>
                  </li>
                  <li>
                    <a href="/press" className="text-zinc-400 hover:text-blue-400 transition-colors flex items-center gap-2 group">
                      <span className="h-1 w-1 rounded-full bg-zinc-700 group-hover:bg-blue-400 group-hover:w-2 transition-all"></span>
                      Press
                    </a>
                  </li>
                  <li>
                    <a href="/contact" className="text-zinc-400 hover:text-blue-400 transition-colors flex items-center gap-2 group">
                      <span className="h-1 w-1 rounded-full bg-zinc-700 group-hover:bg-blue-400 group-hover:w-2 transition-all"></span>
                      Contact
                    </a>
                  </li>
                  <li>
                    <a href="/privacy" className="text-zinc-400 hover:text-blue-400 transition-colors flex items-center gap-2 group">
                      <span className="h-1 w-1 rounded-full bg-zinc-700 group-hover:bg-blue-400 group-hover:w-2 transition-all"></span>
                      Privacy Policy
                    </a>
                  </li>
                </ul>
              </div> */}
            </div>

            {/* Quick action buttons */}
            {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
              <Button variant="outline" className="border-zinc-800 hover:border-blue-600 hover:bg-blue-600/10 transition-all gap-2 text-zinc-300 hover:text-blue-400 group">
                <User className="h-4 w-4 text-blue-500 group-hover:text-blue-300" />
                Your Profile
              </Button>
              <Button variant="outline" className="border-zinc-800 hover:border-purple-600 hover:bg-purple-600/10 transition-all gap-2 text-zinc-300 hover:text-purple-400 group">
                <Briefcase className="h-4 w-4 text-purple-500 group-hover:text-purple-300" />
                Find Jobs
              </Button>
              <Button variant="outline" className="border-zinc-800 hover:border-green-600 hover:bg-green-600/10 transition-all gap-2 text-zinc-300 hover:text-green-400 group">
                <FileText className="h-4 w-4 text-green-500 group-hover:text-green-300" />
                Documentation
              </Button>
              <Button variant="outline" className="border-zinc-800 hover:border-orange-600 hover:bg-orange-600/10 transition-all gap-2 text-zinc-300 hover:text-orange-400 group">
                <HelpCircle className="h-4 w-4 text-orange-500 group-hover:text-orange-300" />
                Support
              </Button>
            </div> */}

            {/* Bottom bar with copyright */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-12 pt-8 border-t border-zinc-800/50">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-red-500 animate-pulse" />
                <p className="text-sm text-zinc-500">
                  © {new Date().getFullYear()} SkillSync. All rights reserved.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-6">
                <a
                  href="/terms"
                  className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  Terms of Service
                </a>
                <a
                  href="/privacy"
                  className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  Privacy Policy
                </a>
                <a
                  href="/cookies"
                  className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  Cookie Policy
                </a>
                <a
                  href="/accessibility"
                  className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  Accessibility
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
