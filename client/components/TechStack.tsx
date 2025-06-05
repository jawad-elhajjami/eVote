import React from "react";
import { Card, CardContent } from "@/components/ui/card"
import { Server, Code, Key, Shield } from "lucide-react";
const TechStack = () => {
  return (
    <section id="tech" className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Technology Stack
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Built with modern technologies and cryptographic libraries
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm text-center">
            <CardContent className="pt-6">
              <Server className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">Express.js</h3>
              <p className="text-gray-300 text-sm">RESTful API backend</p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm text-center">
            <CardContent className="pt-6">
              <Code className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">TypeScript</h3>
              <p className="text-gray-300 text-sm">Type-safe development</p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm text-center">
            <CardContent className="pt-6">
              <Key className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">RSA Crypto</h3>
              <p className="text-gray-300 text-sm">Digital signatures</p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm text-center">
            <CardContent className="pt-6">
              <Shield className="w-12 h-12 text-orange-400 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">JWT</h3>
              <p className="text-gray-300 text-sm">Secure authentication</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default TechStack;
