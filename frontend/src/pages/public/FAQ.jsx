import React from 'react';
import PageHeader from '../../components/ui/PageHeader';

const FAQ = () => {
  const faqs = [
    { q: "What types of electric vehicles does Road Axe manufacture?", a: "Road Axe specializes in manufacturing electric 3-wheelers and golf carts, catering to sectors such as food delivery, cargo transport, and passenger services." },
    { q: "How do Road Axe vehicles support various sectors?", a: "Road Axe provides electric vehicle solutions tailored for the food industry, cargo delivery, and passenger transport, ensuring efficient, eco-friendly operations in each sector." },
    { q: "What are the environmental benefits of Road Axe electric vehicles?", a: "Road Axe EVs are powered by electricity, reducing carbon emissions and helping promote a cleaner, greener environment across the sectors they serve." },
    { q: "How can I purchase a Road Axe electric vehicle?", a: "You can purchase a Road Axe electric vehicle by contacting us directly through our website or by visiting one of our dealership partners across India." },
    { q: "Are Road Axe vehicles suitable for commercial use?", a: "Yes, Road Axe electric vehicles are designed for commercial use, offering solutions for cargo transport, food delivery, and passenger services." },
    { q: "How do I contact Road Axe for support or inquiries?", a: "You can reach Road Axe through our website's contact form, by email, or by calling our customer support team. We’re here to assist with all your inquiries." }
  ];

  return (
    <>
      <div className="container-fluid" style={{ height: '90px' }}></div>
      <PageHeader title="FAQs" breadcrumb={[{ label: 'FAQ', active: true }]} />
      
      <div className="container-fluid faq-section py-5">
        <div className="container py-5">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6">
              <div className="accordion accordion-flush bg-light rounded p-4" id="faqAccordion">
                {faqs.map((item, index) => (
                  <div className="accordion-item mb-2 rounded border-0" key={index}>
                    <h2 className="accordion-header">
                      <button className="accordion-button collapsed rounded" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse${index}`}>
                        {item.q}
                      </button>
                    </h2>
                    <div id={`collapse${index}`} className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                      <div className="accordion-body text-muted">{item.a}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-lg-6">
              <div className="bg-primary rounded p-2 shadow">
                <img src="https://res.cloudinary.com/dvcjqpq4d/image/upload/v1777920840/roadx/static/main/img/about.webp" className="img-fluid rounded w-100" alt="FAQ" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FAQ;
