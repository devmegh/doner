export function HowItWorks() {
  const steps = [
    {
      id: 1,
      title: "Create an Account",
      description: "Sign up in just a few seconds to get started. It's completely free!",
    },
    {
      id: 2,
      title: "Choose a Campaign",
      description: "Browse campaigns or start your own to support causes you care about.",
    },
    {
      id: 3,
      title: "Make a Difference",
      description: "Donate, share with friends, and track your impact over time.",
    },
  ];

  return (
    <section className="py-14 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Start making a difference today with these simple steps
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.id} className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-500">{step.id}</span>
              </div>
              <h3 className="text-xl font-bold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
