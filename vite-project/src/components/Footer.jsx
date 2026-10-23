import React from 'react';
import Certificate from '../assets/certificate.jpeg';

export default function Footer() {
  return (
    <footer id="fssai" className="bg-slate-900 border-t border-slate-800 text-slate-300 py-6 px-8 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* FSSAI Certificate Section with Details */}
        <div className="max-w-2xl text-left">
          <h3 className="text-amber-400 font-bold text-sm tracking-wide uppercase mb-1">
            FSSAI CERTIFICATE (GOVT. OF HARYANA)
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed mb-2">
            <span className="text-white font-semibold">FBO Name:</span> manish pratap singh | <span className="text-white font-semibold">Address:</span> 145G.NO.3, Roshan Nagar, Faridabad[cite: 4]
          </p>
          <p className="text-[11px] text-indigo-400 font-mono">
            Registration No: 20826004001943[cite: 4]
          </p>
        </div>

        {/* Certificate Image Thumbnail / Preview */}
        <div className="flex items-center gap-4 border-l border-slate-700 pl-6 text-left">
          <div className="text-center">
            <a href={Certificate} target="_blank" rel="noopener noreferrer">
              <img 
                src={Certificate} 
                alt="FSSAI Certificate" 
                className="w-20 h-28 object-cover rounded border border-slate-700 hover:opacity-80 transition cursor-pointer shadow-md"
              />
            </a>
            <span className="text-[10px] text-slate-400 block mt-1">View Certificate</span>
          </div>
        </div>

      </div>
    </footer>
  );
}