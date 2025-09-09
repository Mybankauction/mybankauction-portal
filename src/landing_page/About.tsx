import React from 'react'
import AuctionImg from "../assets/selling-house-at-auction.jpg"

const About: React.FC = () => {
  return (
    <section className="py-12 md:py-16 lg:py-20 bg-white text-slate-900">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-auction-navy mb-8">About Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center-full">
          <div className="space-y-5 text-gray-700 leading-7">
            <p className='leading-9 text-xl font-medium text-gray-700'>
              MyBankAuction.com was built with a simple vision: to make quality assets affordable and accessible for everyone. As part of Simple Stone Assets & Services Pvt Ltd, we specialize in connecting buyers with bank auction and distressed assets across India. Every property listed is legally verified, transparent, and risk-free, ensuring smooth transactions and long-term value.
              Our mission is to bring trust, clarity, and opportunity into the distressed property market — helping home buyers, investors, and businesses secure high-value assets at unmatched prices.</p>
          </div>
          <div className="w-full">
            <img src={AuctionImg} alt="About MyBankAuction" className="w-full h-auto rounded-lg object-cover" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default About