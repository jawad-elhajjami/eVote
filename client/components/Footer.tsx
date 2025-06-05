import React from "react";
import { Vote } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-white/10 py-8 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded flex items-center justify-center">
              <Vote className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-semibold">eVote</span>
          </div>
          <p className="text-gray-400 text-sm">
            © 2024 eVote - Secure Digital Voting Platform. Academic Project.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
