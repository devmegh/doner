export function TestimonialsSection() {
  const testimonials = [
    {
      id: 1,
      name: "John Smith",
      role: "Campaign Organizer",
      image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&h=150",
      quote: "Donato helped me raise over $10,000 for my community park renovation project in just 3 weeks. The platform was so easy to use, and the support was incredible!",
      rating: 5,
    },
    {
      id: 2,
      name: "Emily Parker",
      role: "Regular Donor",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150",
      quote: "I love being able to see exactly how my donations are making an impact. The monthly updates from campaigns I've supported make me feel connected to the causes I care about.",
      rating: 5,
    },
    {
      id: 3,
      name: "David Kim",
      role: "Campaign Beneficiary",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150",
      quote: "After a devastating fire, we didn't know how we'd rebuild our community center. With Donato, we not only raised the funds we needed but connected with amazing supporters.",
      rating: 5,
    },
  ];

  return (
    <section className="py-14 lg:py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What Our Community Says</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hear from the people who've experienced the impact firsthand
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name} 
                  className="w-12 h-12 rounded-full mr-3 object-cover" 
                />
                <div>
                  <h4 className="font-bold">{testimonial.name}</h4>
                  <p className="text-gray-500 text-sm">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-600 mb-3">{testimonial.quote}</p>
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg 
                    key={i} 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5" 
                    viewBox="0 0 20 20" 
                    fill={i < testimonial.rating ? "currentColor" : "none"}
                    stroke="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
