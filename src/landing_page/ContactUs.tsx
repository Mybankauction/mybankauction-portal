import React from 'react'

const ContactUs: React.FC = () => {
  const phone = '9364111642'
  const email = 'hr@mybankauction.com'
  const address = '2nd Floor, Awfis Workspace, Kudlu Gate, Hosur Rd, Bengaluru, Karnataka 560068'
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`

  const cards = [
    {
      title: `Text us at ${phone}`,
      desc: 'Message and data rates may apply',
      cta: 'Text Us',
      href: `sms:${phone}`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-700"><path d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/></svg>
      ),
    },
    {
      title: `Call us at ${phone}`,
      desc: 'Available 10 AM–7 PM CT, 6 days a week.',
      cta: 'Call us',
      href: `tel:${phone}`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-700"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.3 1.78.57 2.63a2 2 0 0 1-.45 2.11L8 9a16 16 0 0 0 7 7l.54-1.23a2 2 0 0 1 2.11-.45c.85.27 1.73.45 2.63.57A2 2 0 0 1 22 16.92z"/></svg>
      ),
    },
    {
      title: 'Send us an email',
      desc: "We'd love to hear from you!",
      cta: 'Email us',
      href: `mailto:${email}`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-700"><path d="M4 4h16v16H4z"/><path d="m22 6-10 7L2 6"/></svg>
      ),
    },
    {
      title: 'Location',
      desc: address,
      cta: 'Open in Maps',
      href: mapsUrl,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-700"><path d="M12 21s-6-5.6-6-10a6 6 0 1 1 12 0c0 4.4-6 10-6 10z"/><circle cx="12" cy="11" r="2"/></svg>
      ),
    },
  ]

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-slate-900 mb-10">Contact Us</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {cards.map((card, i) => (
            <a target="_blank" rel="noopener noreferrer" href={card.href} key={i} className="flex items-start gap-4 bg-slate-200 rounded-md p-6">
              <div className="shrink-0">{card.icon}</div>
              <div>
                <h3 className="font-semibold text-slate-900">{card.title}</h3>
                <p className="text-slate-700 text-sm">{card.desc}</p>
                <span className="mt-2 inline-block text-primary font-medium">{card.cta}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ContactUs