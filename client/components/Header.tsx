import React from "react";
import Link from "next/link"
import { Vote, Github } from "lucide-react";
import { Button } from "@/components/ui/button"
const Header = () => {
  return (
    <header className="border-b border-white/10 backdrop-blur-sm bg-black/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Vote className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">eVote</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/#features"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Features
            </Link>
            <Link
              href="/#how-it-works"
              className="text-gray-300 hover:text-white transition-colors"
            >
              How it Works
            </Link>
            <Link
              href="/#tech"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Technology
            </Link>
            <Button
              variant="outline"
              className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white"
            >
              <Github className="w-4 h-4 mr-2" />
              View Code
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
