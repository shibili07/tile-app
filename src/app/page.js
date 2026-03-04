import Image from 'next/image';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f8f9fa] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Top Section: Logo, Upload & Preview */}
        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          
          {/* Left: Logo and Upload Card */}
          <div className="w-full lg:w-1/3 flex flex-col items-center lg:items-start gap-8">
             <div className="relative w-48 h-16 transition-transform hover:scale-105 duration-300">
                <Image 
                  src="/images/logo.png" 
                  alt="Victorian Plumbing Logo" 
                  fill 
                  className="object-contain"
                />
             </div>

             <div className="bg-white rounded-2xl shadow-xl w-full p-6 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
                <h2 className="text-gray-800 text-lg font-semibold mb-6">Upload Your Room</h2>
                
                <div className="border-2 border-dashed border-blue-200 rounded-xl p-8 flex flex-col items-center justify-center bg-blue-50/30 group transition-colors hover:bg-blue-50 cursor-pointer">
                   <div className="bg-blue-100 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                   </div>
                   <p className="text-gray-600 text-center font-medium">Drag and drop your photo here</p>
                   <p className="text-gray-400 text-sm mt-1">or</p>
                   <button className="mt-4 bg-[#4d5e74] text-white px-8 py-2.5 rounded-lg font-medium hover:bg-[#3d4b5c] transition-colors shadow-lg shadow-gray-200">
                      Choose File
                   </button>
                </div>

                <div className="mt-6 flex items-start gap-3 bg-yellow-50/50 p-4 rounded-lg border border-yellow-100">
                   <span className="text-yellow-500 text-lg">💡</span>
                   <p className="text-xs text-gray-500 leading-relaxed">
                     <span className="font-semibold block text-gray-700">Tip:</span>
                     For best results, use a well-lit photo showing the wall area clearly.
                   </p>
                </div>
             </div>
          </div>

          {/* Right: Preview Window */}
          <div className="w-full lg:w-2/3 flex flex-col gap-6">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden shadow-2xl shadow-gray-200/50">
               {/* Preview Bar */}
               <div className="px-6 py-4 flex items-center justify-between border-b border-gray-50">
                  <div>
                    <h3 className="text-gray-800 font-semibold">Preview</h3>
                    <p className="text-xs text-gray-400 uppercase tracking-wider">Currently showing: Metro Gloss White</p>
                  </div>
                  <div className="flex gap-4 items-center">
                    {/* Icons */}
                    <button className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-50 rounded-full"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg></button>
                    <button className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-50 rounded-full"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg></button>
                    <button className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-50 rounded-full"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg></button>
                    <button className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-50 rounded-full"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg></button>
                  </div>
               </div>
               
               {/* Preview Image */}
               <div className="relative aspect-[16/9] w-full bg-gray-100">
                  <Image 
                    src="/images/kitchen-preview.png" 
                    alt="Kitchen Preview" 
                    fill 
                    className="object-cover"
                  />
               </div>
            </div>

            {/* Action Button */}
            <button className="w-full bg-[#4d5e74] hover:bg-[#3d4b5c] text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-3 transition-all transform hover:-translate-y-1 shadow-xl shadow-gray-400/20 active:scale-[0.98]">
              Start Visualization
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>

        {/* Bottom Section: Demo Rooms */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Try Our Demo Rooms</h2>
            <p className="text-gray-500 mt-2">Don't have a photo? Explore our demo rooms to see how different tiles look</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'Modern Bathroom', img: '/images/bathroom-demo.png' },
              { title: 'Contemporary Kitchen', img: '/images/kitchen-preview.png' },
              { title: 'Minimalist Bathroom', img: '/images/bathroom-demo.png' },
              { title: 'Modern Bathroom', img: '/images/bathroom-demo.png' },
              { title: 'Contemporary Kitchen', img: '/images/kitchen-preview.png' },
              { title: 'Minimalist Bathroom', img: '/images/bathroom-demo.png' },
            ].map((room, idx) => (
              <div key={idx} className="group cursor-pointer">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 transform group-hover:-translate-y-2 group-hover:shadow-2xl">
                  {/* Subtle blur overlay on hover could go here */}
                  <div className="relative aspect-[1.1/1] w-full">
                    {idx < 3 ? (
                       <Image 
                        src={room.img} 
                        alt={room.title} 
                        fill 
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-200">
                        <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      </div>
                    )}
                  </div>
                  <div className="p-5 text-center transition-colors group-hover:bg-gray-50">
                    <span className="text-gray-800 font-semibold">{room.title}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Branding (Optional but adds to premium feel) */}
      <footer className="mt-24 pt-12 border-t border-gray-200 text-center">
        <p className="text-gray-400 text-sm">© 2024 Victorian Plumbing. All rights reserved.</p>
      </footer>
    </main>
  );
}
