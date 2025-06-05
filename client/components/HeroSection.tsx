import React from "react";
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, ArrowRight } from "lucide-react";
const HeroSection = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto text-center">
        <Badge className="mb-6 bg-purple-500/20 text-purple-300 border-purple-500/30">
          Master's Project • Cryptography & Blockchain
        </Badge>
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Secure Digital
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {" "}
            Voting{" "}
          </span>
          Platform
        </h1>
        <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
          eVote leverages advanced cryptographic techniques including RSA
          digital signatures and JWT authentication to ensure secure,
          tamper-proof voting with complete voter anonymity.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
          >
            <Play className="w-5 h-5 mr-2" />
            Try Demo
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white/20 text-purple-700 hover:bg-white/10 hover:text-white"
          >
            Learn More
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
