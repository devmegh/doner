export function ImpactSection() {
  return (
    <section className="py-14 lg:py-20 bg-primary-500 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6">Our Collective Impact</h2>
          <p className="text-lg text-primary-100 max-w-2xl mx-auto mb-12">
            Together, our community is making real change happen. Here's what we've accomplished so far.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold mb-2">$1.2M+</div>
            <p className="text-xl text-primary-100">Funds Raised</p>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold mb-2">450+</div>
            <p className="text-xl text-primary-100">Successful Campaigns</p>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold mb-2">25K+</div>
            <p className="text-xl text-primary-100">Lives Impacted</p>
          </div>
        </div>
      </div>
    </section>
  );
}
