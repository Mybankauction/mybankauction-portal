export default function Footer() {
  const phone = '9364111642'
  const email = 'hr@mybankauction.com'
  const address = 'Kudlu Gate, Hosur Rd, Bengaluru, Karnataka 560068'
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
  return (
    <footer className=" bg-neutral-900 text-neutral-200">
      <div className="container mx-auto px-4 py-10">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <h3 className="text-lg font-semibold mb-4">Mybankauction</h3>
            <p className="text-sm leading-6 text-neutral-300">
            MyBankAuction.com was built with a simple vision: to make quality assets affordable and accessible for everyone. As part of Simple Stone Assets & Services Pvt. Ltd., we specialize in connecting buyers with bank auction and distressed assets across India. Every property listed is legally verified, transparent, and risk-free, ensuring smooth transactions and long-term value.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="mt-5 space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <span>📍</span>
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {address}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <span>✉️</span>
                <a href={`mailto:${email}`} className="hover:underline">{email}</a>
              </li>
              <li className="flex items-center gap-3">
                <span>📞</span>
                <a href={`tel:${phone}`} className="hover:underline">{phone}</a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">OPENING HOURS</h3>
            <ul className="text-sm divide-y divide-neutral-800 border-y border-neutral-800">
              <li className="flex justify-between py-3"><span>Mon - Thu:</span><span>10am - 7pm</span></li>
              <li className="flex justify-between py-3"><span>Fri - Sat:</span><span>10am - 7pm</span></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-neutral-800">
        <div className="mx-auto w-full max-w-screen-xl px-4 py-4 text-center text-sm text-neutral-400">
          © 2025 Copyright: MyBankAuction.com
        </div>
      </div>
    </footer>
  )
}
