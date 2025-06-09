import React from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Key, Shield, Lock, CheckCircle, Users, Zap } from "lucide-react";
const Features = () => {
  return (
    <section id="features" className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Built with Advanced Cryptography
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Every vote is cryptographically signed and verified, ensuring
            integrity and preventing fraud
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-4">
                <Key className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-white">
                RSA Digital Signatures
              </CardTitle>
              <CardDescription className="text-gray-300">
                Each vote is signed with a unique RSA private key, ensuring
                authenticity and non-repudiation
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-white">
                Double-Vote Prevention
              </CardTitle>
              <CardDescription className="text-gray-300">
                Cryptographic validation ensures each user can only vote once
                while maintaining anonymity
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-white">JWT Authentication</CardTitle>
              <CardDescription className="text-gray-300">
                Secure token-based authentication with automatic expiration and
                refresh mechanisms
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-white">Vote Integrity</CardTitle>
              <CardDescription className="text-gray-300">
                Cryptographic hashing ensures votes cannot be tampered with
                after submission
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-green-500 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-white">Voter Anonymity</CardTitle>
              <CardDescription className="text-gray-300">
                Advanced cryptographic techniques ensure complete voter privacy
                and anonymity
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-white">Real-time Results</CardTitle>
              <CardDescription className="text-gray-300">
                Instant vote tallying with cryptographic verification of all
                submitted ballots
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Features;
