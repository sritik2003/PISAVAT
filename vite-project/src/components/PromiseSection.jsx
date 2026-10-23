import React from 'react';

export function PromiseSection() {
  return (
    <section id="promise" className="py-16 bg-[#12151c] border-y border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">Our Quality Promise</h3>
          <p className="text-sm text-gray-400">Strict quality assurance from our roots to your kitchen</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
          {[
            { icon: '🌿', title: '100% Pure & Natural' },
            { icon: '🚫', title: 'No Added Chemicals' },
            { icon: '🛡️', title: 'No Preservatives' },
            { icon: '✨', title: 'Hygienically Packed' },
            { icon: '🔬', title: 'Lab Tested' },
            { icon: '🟢', title: '100% Vegetarian' }
          ].map((promise, i) => (
            <div key={i} className="bg-[#0d0f12] border border-gray-800 p-4 rounded-xl flex flex-col items-center justify-center">
              <span className="text-2xl mb-2">{promise.icon}</span>
              <span className="text-xs font-semibold text-gray-300">{promise.title}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TributeSection() {
  return (
    <section id="tribute" className="py-12 max-w-7xl mx-auto px-4 sm:px-6">
      <div className="bg-gradient-to-r from-amber-950/40 via-gray-900 to-amber-950/40 border border-amber-600/30 rounded-2xl p-6 sm:p-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="max-w-2xl">
          <div className="flex items-center justify-center sm:justify-start space-x-2 mb-2">
            <span className="text-lg">🇮🇳</span>
            <h4 className="text-lg font-bold text-amber-400 uppercase tracking-wide">Kargil Heroes – Our Pride</h4>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed">
            Saluting the indomitable courage of Captain Vikram Batra PVC & Captain Manoj Kumar Pandey PVC. Your sacrifice will always inspire us.
          </p>
        </div>
        <div className="text-center sm:text-right border-t sm:border-t-0 sm:border-l border-amber-600/20 pt-4 sm:pt-0 sm:pl-6">
          <p className="text-xs text-gray-400">FSSAI Lic No.</p>
          <p className="text-sm font-mono font-bold text-amber-400">10722999000125</p>
        </div>
      </div>
    </section>
  );
}