import React, { useEffect, useState } from 'react'
import AuctionImg from "../assets/tall-building-white.jpg"
import HeroImg from "../assets/property-auction.jpg"
import HeroImg2 from "../assets/pexels-binyaminmellish-186077.jpg"
import HeroImg3 from "../assets/pexels-binyaminmellish-106399.jpg"
import HeroImg4 from "../assets/pexels-sebastians-731082.jpg"
import { Link } from 'react-router-dom'

// xl:[background-position-y:-180px]
const Hero: React.FC = () => {
  const heroImages = [HeroImg, HeroImg2, HeroImg3, HeroImg4, AuctionImg]
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length)
    }, 5000)

    return () => clearInterval(intervalId)
  }, [heroImages.length])

  return (
    <div
      className="relative bg-cover bg-center b-red h-[60vh]"
      style={{ 
        backgroundImage: `url(${heroImages[currentIndex]})`,
      }}
    >
      <div className="absolute inset-0 bg-black/40" />
      <div className="container mx-auto relative z-10 min-h-[60vh] px-4 md:px-6 flex items-center justify-center">
        <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
          Smart Way to Buy Auctioned Properties in India
        </h1>
        <p className="text-lg md:text-xl mb-8 text-gray-200">
          MyBankAuction makes navigating bank property auctions simple, transparent, and reliable with expert support at every step.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to={'/login'}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-10 bg-[#E3450A] text-white hover:bg-[#E3450A]/90 px-8 py-6 text-lg w-full sm:w-auto"
          >
            Browse Properties
          </Link>
        </div>
        </div>
      </div>
    </div>
  )
}

export default Hero 