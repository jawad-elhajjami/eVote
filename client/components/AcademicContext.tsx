import React from 'react'
import { Badge } from './ui/badge'
const AcademicContext = () => {
  return (
    <section className="py-20 px-4 bg-black/20">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-6 bg-blue-500/20 text-blue-300 border-blue-500/30">Academic Project</Badge>
            <h2 className="text-4xl font-bold text-white mb-6">Master's Degree Project</h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              This project was developed as part of the <strong>Réseaux et Services Mobiles</strong> master's program,
              specifically for the <strong>Cryptography & Blockchain</strong> module. It demonstrates practical
              application of advanced cryptographic concepts in a real-world voting scenario.
            </p>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Course Focus</h3>
                <p className="text-gray-300">Cryptography & Blockchain Technologies</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Program</h3>
                <p className="text-gray-300">Réseaux et Services Mobiles</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Level</h3>
                <p className="text-gray-300">Master's Degree</p>
              </div>
            </div>
          </div>
        </div>
      </section>
  )
}

export default AcademicContext
