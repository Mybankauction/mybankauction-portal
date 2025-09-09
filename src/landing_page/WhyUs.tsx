import { FaPercent,FaCheckCircle,FaShieldAlt,FaChartLine,FaBoxes,FaHandsHelping } from 'react-icons/fa';

const Icon = ({ type }: { type: string }) => {
  const icons = {
    house: (
      <FaPercent size={42} color="#E34732"/>
    ),
    Target: (
      <FaCheckCircle size={42} color="#E34732" />

    ),
    shield: (
      <FaShieldAlt size={42} color="#E34732" />

    ),
    Star: (
      <FaChartLine size={42} color="#E34732" />
    ),
    Heart: (
      <FaBoxes size={42} color="#E34732"/>


    ),
    Handshake: (
      <FaHandsHelping size={42} color="#E34732"/>
    ),
  };

  return icons[type as keyof typeof icons] || null;
};

const FeatureCard = ({ icon, title, description }: { icon: string, title: string, description: string }) => (
  <div className="text-center bg-slate-300 p-5 md:p-6 bg-auction-light-gray rounded-lg shadow-sm hover:shadow-md smooth-transition hover:translate-y-[-5px]">
    <div className="flex justify-center mb-4">
      <Icon type={icon} />
    </div>
    <h3 className="text-xl font-semibold mb-3 text-auction-navy">{title}</h3>
    <p className="text-gray-800">{description}</p>
  </div>
);

const WhyUs = () => {
  const features = [
    {
      icon: "house",
      title: "40–70% below market value",
      description:
        "best deals on auction properties.",
    },
    {
      icon: "Target",
      title: "Verified clear titles",
      description:
        "no legal hassles or hidden risks.",
    },
    {
      icon: "shield",
      title: "Trusted platform",
      description:
        "backed by Simple Stone expertise.",
    },
    {
      icon: "Star",
      title: "High Growth Potential",
      description:
        "Select assets with 30–70% annual appreciation.",
    },
    {
      icon: "Heart",
      title: "Diverse Opportunities",
      description:
        "Explore land, homes, commercial spaces, vehicles, and even gold.",
    },
    {
      icon: "Handshake",
      title: "End-to-End Support",
      description:
        "Expert guidance at every step of your purchase journey.",
    },
  ];

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-slate-200 text-slate-900">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-auction-navy mb-3">
          Why Choose MyBankAuction?
        </h2>
        <p className="text-gray-800 text-center max-w-3xl mx-auto mb-10 md:mb-12">
          We simplify the process of purchasing bank-owned properties for buyers of all kinds.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
