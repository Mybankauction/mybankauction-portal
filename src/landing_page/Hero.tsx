import React, { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

import AuctionImg from "../assets/tall-building-white.jpg"
import HeroImg from "../assets/property-auction.jpg"
import HeroImg2 from "../assets/pexels-binyaminmellish-186077.jpg"
import HeroImg3 from "../assets/pexels-binyaminmellish-106399.jpg"
import HeroImg4 from "../assets/pexels-sebastians-731082.jpg"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import LoginForm from '@/components/auth/LoginForm'
import SignupForm from '@/components/auth/SignupForm'

const Hero: React.FC = () => {
  const heroImages = [
    { id: 1, image: HeroImg, alt: 'Auction Property 1' },
    { id: 2, image: HeroImg2, alt: 'Auction Property 2' },
    { id: 3, image: HeroImg3, alt: 'Auction Property 3' },
    { id: 4, image: HeroImg4, alt: 'Auction Property 4' },
    { id: 5, image: AuctionImg, alt: 'Auction Property 5' },
  ]

  const [authOpen, setAuthOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login')

  return (
    <div className="relative h-[60vh]">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 4000 }}
        loop={true}
        className="h-full"
      >
        {heroImages.map((img) => (
          <SwiperSlide key={img.id}>
            <div
              className="w-full h-full bg-cover bg-center relative"
              style={{ backgroundImage: `url(${img.image})` }}
            >
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/40 z-10" />

              {/* Content */}
              <div className="container mx-auto relative z-20 min-h-[60vh] px-4 md:px-6 flex items-center justify-center">
                <div className="max-w-3xl mx-auto text-center text-white">
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                    Smart Way to Buy Auctioned Properties in India
                  </h1>
                  <p className="text-lg md:text-xl mb-8 text-gray-200">
                    MyBankAuction helps you find, bid, and secure bank-auctioned properties with ease —
                    simple, transparent, and fully supported every step of the way.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={() => {
                        setActiveTab('login')
                        setAuthOpen(true)
                      }}
                      className="bg-[#E3450A] hover:bg-[#E3450A]/90 text-white text-lg px-4 py-2 rounded w-full sm:w-auto"
                    >
                      Browse Properties
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Auth Modal */}
      <Dialog open={authOpen} onOpenChange={setAuthOpen}>
        <DialogContent className="max-w-sm max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              {activeTab === 'login' ? 'Login' : 'Sign Up'}
            </DialogTitle>
          </DialogHeader>
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setActiveTab('login')}
              className={`px-4 py-2 rounded border ${
                activeTab === 'login'
                  ? 'bg-[#E34732] text-white border-[#E34732]'
                  : 'bg-white text-neutral-800'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setActiveTab('signup')}
              className={`px-4 py-2 rounded border ${
                activeTab === 'signup'
                  ? 'bg-[#E34732] text-white border-[#E34732]'
                  : 'bg-white text-neutral-800'
              }`}
            >
              Sign Up
            </button>
          </div>
          <div>
            {activeTab === 'login' ? (
              <LoginForm onSuccess={() => setAuthOpen(false)} />
            ) : (
              <SignupForm onSuccess={() => setAuthOpen(false)} />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Hero
