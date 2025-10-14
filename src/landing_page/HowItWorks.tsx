import React from 'react'


const HowItWorks: React.FC = () => {
  return (
    <section className="py-16 bg-white text-slate-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">How MyBankAuction Works</h2>
        <div className="grid md:grid-cols-4 gap-8">
          {[
            {
              title: 'Explore Properties',
              desc: 'Discover verified assets directly from banks.',
              num: '1',
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E34732" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search h-12 w-12 text-auction-gold"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
              ),
            },
            {
              title: 'Get Auction-Ready',
              desc: 'Access expert tips, tools, and support.',
              num: '2',
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E34732" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-book-open h-12 w-12 text-auction-gold"><path d="M12 7v14"></path><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"></path></svg>
              ),
            },
            {
              title: 'Place Your Bid',
              desc: 'Secure your deal confidently in auctions.',
              num: '3',
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E34732" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trophy h-12 w-12 text-auction-gold"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path></svg>
              ),
            },
            {
              title: 'Seal the Deal',
              desc: 'Finalize ownership with our step-by-step guidance.',
              num: '4',
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E34732" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-house h-12 w-12 text-auction-gold"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
              ),
            },
          ].map((step, idx) => (
            <div className="relative" key={idx}>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 p-4 bg-slate-200 rounded-full ">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-slate-900">{step.title}</h3>
                <p className="text-gray-700">{step.desc}</p>
                {idx < 3 && (
                  <div className="hidden md:block absolute top-12 left-[calc(50%+2.5rem)] w-full h-0.5 bg-primary " />
                )}
                <div className="absolute top-0 right-0 md:top-0 md:left-0 bg-auction-navy text-white w-8 h-8 rounded-full bg-primary flex items-center justify-center font-bold">
                  {step.num}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
