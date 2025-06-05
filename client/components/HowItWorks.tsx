import React from "react";

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 px-4 bg-black/20">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            How eVote Works
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            A step-by-step look at our cryptographically secure voting process
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-white font-bold text-xl">1</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">
              Authentication
            </h3>
            <p className="text-gray-300">
              Users authenticate using JWT tokens. The system generates a unique
              RSA key pair for each voting session.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-white font-bold text-xl">2</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">
              Vote Signing
            </h3>
            <p className="text-gray-300">
              Each vote is cryptographically signed with the user's private key,
              creating an unforgeable digital signature.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-white font-bold text-xl">3</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">
              Verification
            </h3>
            <p className="text-gray-300">
              The system verifies the signature, checks for duplicate votes, and
              securely stores the ballot.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
