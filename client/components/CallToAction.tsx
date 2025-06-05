import React from "react";
import { Button } from "@/components/ui/button"
import { Github, Play } from "lucide-react";
const CallToAction = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold text-white mb-6">
          Ready to Experience Secure Voting?
        </h2>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Explore the demo or dive into the source code to see how cryptographic
          principles ensure election integrity.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
          >
            <Play className="w-5 h-5 mr-2" />
            Try Live Demo
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white/20 text-purple-700 hover:bg-white/10 hover:text-white"
          >
            <Github className="w-5 h-5 mr-2" />
            View Source Code
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
