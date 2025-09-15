import React, { useState } from 'react'

type FaqItem = {
  question: string
  answer: string
}

const items: FaqItem[] = [
  {
    question: 'What is MyBankAuction.com?',
    answer:
      "It’s a platform under Simple Stone that connects buyers with bank auction and distressed properties across India.",
  },
  {
    question: 'Are these properties safe to buy?',
    answer:
      "All listed properties go through legal checks, title verification, and due diligence.",
  },
  {
    question: 'Who can buy from MyBankAuction.com?',
    answer:
      'Both individuals and businesses can purchase assets through our platform.',
  },
  {
    question: 'What kind of discounts can I expect?',
    answer:
      'Properties are typically available at 40–70% below market value.',
  },
  {
    question:
      'Do you provide assistance in the buying process?',
    answer:
      "Yes. Our team offers guidance, documentation support, and expert advice to make the process easy.",
  },
]

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-slate-200">
      <div className="container mx-auto px-4 md:px-6 ">
        <div className="text-center mb-8">
          <h3 className="text-2xl md:text-3xl font-bold text-auction-navy">
            <span className="block text-black mb-3">Frequently Asked</span>
            <strong className='text-black'>Questions</strong>
          </h3>
        </div>
        <div className="space-y-3">
          {items.map((item, idx) => {
            const isOpen = openIndex === idx
            return (
              <div
                key={idx}
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                aria-expanded={isOpen}
                className={`rounded-lg p-4 transition-all border cursor-pointer ${
                  isOpen
                    ? 'bg-slate-300 shadow-md border-[#E34732]'
                    : 'bg-auction-light-gray border-slate-300 hover:bg-slate-300 hover:border-[#E34732]'
                }`}
              >
                <div
                  className="w-full text-left flex items-start gap-3"
                >
                  <span className="text-auction-gold font-semibold text-black">{idx + 1}.</span>
                  <span className="font-medium text-slate-900">{item.question}</span>
                  <span className={`text-black ml-auto transition-transform ${isOpen ? 'rotate-90' : ''}`}>›</span>
                </div>
                {isOpen && (
                  <div className="mt-3 text-slate-800">
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default FAQ
