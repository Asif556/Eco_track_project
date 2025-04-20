import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// Dynamic imports for GSAP to avoid SSR issues
let gsap;
let ScrollTrigger;

if (typeof window !== 'undefined') {
  import('gsap').then((module) => {
    gsap = module.gsap;
    import('gsap/ScrollTrigger').then((stModule) => {
      ScrollTrigger = stModule.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);
      initAnimations();
    });
  });
}

function initAnimations() {
  // Header animation
  gsap.from(".logo", {
    duration: 1,
    y: -50,
    opacity: 0,
    ease: "power3.out"
  });

  gsap.from(".login-btn", {
    duration: 1,
    x: 50,
    opacity: 0,
    ease: "power3.out",
    delay: 0.3
  });

  // Main text animation
  gsap.from(".main-text span", {
    duration: 1.5,
    y: 100,
    opacity: 0,
    stagger: 0.2,
    ease: "back.out(1.7)",
    delay: 0.5
  });

  // Feature cards animation
  gsap.from(".feature-card", {
    duration: 1,
    y: 100,
    opacity: 0,
    stagger: 0.2,
    scrollTrigger: {
      trigger: ".features-section",
      start: "top 80%"
    }
  });

  // Floating elements animation
  gsap.to(".floating-element", {
    y: 20,
    duration: 3,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
  });
}

function Landing() {
  const navigate = useNavigate();

  useEffect(() => {
    // Fallback animations if GSAP fails to load
    if (!gsap) {
      const elements = document.querySelectorAll('.fade-in');
      elements.forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
    }
  }, []);

  return (
    <div className="gradient-bg w-screen min-h-screen relative overflow-hidden" 
         style={{
           background: 'radial-gradient(ellipse at center, #C0F2CB 0%, #A0D8B3 30%, transparent 70%), linear-gradient(135deg, #f5f7fa 0%, #e4f0e8 100%)',
           backgroundSize: '200% 200%'
         }}>
      
      {/* Animated background elements */}
      <motion.div 
        className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 2 }}
      >
        <div className="absolute top-10 left-20 w-64 h-64 bg-[#2BA84A] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-60 right-40 w-80 h-80 bg-[#082B13] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-[#A0D8B3] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </motion.div>

      {/* Header */}
      <header className="relative z-10">
        <div className="h-full w-full flex flex-wrap p-6 lg:p-8">
          <div className="w-full lg:w-1/3 flex logo fade-in" style={{ opacity: 0, transform: 'translateY(-20px)' }}>
            <motion.div 
              className="m-4 w-32 sm:w-40 md:w-32 h-12 bg-[#082B13] rounded-lg flex items-center justify-center text-white font-bold text-xl"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              AgroAI
            </motion.div>
          </div>
          <motion.button 
            className="login-btn bg-[#082B13] ml-auto text-white text-xl h-12 rounded-3xl px-6 flex cursor-pointer gap-2 items-center justify-center hover:bg-[#C0F2CB] hover:text-[#2BA84A] transition-all duration-300 shadow-lg hover:shadow-xl fade-in"
            style={{ opacity: 0, transform: 'translateX(20px)' }}
            onClick={() => navigate('/login')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Login <motion.span animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 2 }}>→</motion.span>
          </motion.button>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="relative z-10">
        {/* Hero Section */}
        <section className="px-6 lg:px-12 py-12 lg:py-24">
          <div className="flex flex-col justify-center items-center w-full text-center mt-10 lg:mt-20">
            <motion.h1 
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight main-text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <div className="fade-in" style={{ opacity: 0, transform: 'translateY(20px)' }}>Join us to empower <motion.span 
                className="text-[#2BA84A] relative inline-block"
                whileHover={{ scale: 1.05 }}
              >
                <span className="relative z-10">sustainable farming</span>
                <span className="absolute bottom-0 left-0 w-full h-2 bg-[#C0F2CB] z-0 opacity-60"></span>
              </motion.span></div>
              <div className="fade-in" style={{ opacity: 0, transform: 'translateY(20px)', transitionDelay: '0.2s' }}>and <motion.span 
                className="text-[#2BA84A] relative inline-block"
                whileHover={{ scale: 1.05 }}
              >
                <span className="relative z-10">smart agriculture</span>
                <span className="absolute bottom-0 left-0 w-full h-2 bg-[#C0F2CB] z-0 opacity-60"></span>
              </motion.span>.</div>
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl text-[#082B13] mt-8 max-w-2xl fade-in"
              style={{ opacity: 0, transform: 'translateY(20px)', transitionDelay: '0.4s' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              Revolutionizing agriculture with AI-powered insights for better yields, healthier plants, and smarter market decisions.
            </motion.p>
            
            <motion.div
              className="mt-12 fade-in"
              style={{ opacity: 0, transform: 'translateY(20px)', transitionDelay: '0.6s' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              <motion.button 
                className="bg-[#2BA84A] text-white text-lg md:text-xl h-14 rounded-3xl px-8 flex cursor-pointer gap-3 items-center justify-center hover:bg-[#082B13] transition-all duration-300 shadow-lg hover:shadow-xl"
                onClick={() => navigate('/demo')}
                whileHover={{ scale: 1.05, boxShadow: "0px 10px 25px rgba(43, 168, 74, 0.3)" }}
                whileTap={{ scale: 0.95 }}
              >
                See Demo <motion.span animate={{ rotate: [0, 15, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>→</motion.span>
              </motion.button>
            </motion.div>
          </div>
        </section>
        
        {/* Main Image with Parallax Effect */}
        <motion.section 
          className="relative w-full h-64 md:h-96 lg:h-[500px] mt-8 md:mt-16 fade-in"
          style={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
        >
          <motion.img 
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            alt="Agriculture field with technology"
            className="absolute left-1/2 transform -translate-x-1/2 w-full max-w-6xl rounded-2xl shadow-2xl object-cover h-full"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            whileHover={{ scale: 1.02 }}
          />
        </motion.section>
        
        {/* Features Section */}
        <section className="features-section px-6 lg:px-12 py-16 lg:py-24 bg-white bg-opacity-70 backdrop-blur-sm mt-16">
          <motion.h2 
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-center text-[#082B13] mb-16 fade-in"
            style={{ opacity: 0, transform: 'translateY(20px)' }}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Why Choose Our Solution?
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Feature Card 1 */}
            <motion.div 
              className="feature-card bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-[#2BA84A] fade-in"
              style={{ opacity: 0, transform: 'translateY(20px)' }}
              whileHover={{ y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="h-48 overflow-hidden rounded-lg mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1586771107445-d3ca888129ce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                  alt="AI analysis" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-5xl mb-4 text-[#2BA84A]">87%+</div>
              <h3 className="text-xl font-bold mb-3 text-[#082B13]">Accuracy</h3>
              <p className="text-gray-700">Reliable predictions for crops, plants, and market insights with industry-leading accuracy.</p>
            </motion.div>
            
            {/* Feature Card 2 */}
            <motion.div 
              className="feature-card bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-[#2BA84A] fade-in"
              style={{ opacity: 0, transform: 'translateY(20px)', transitionDelay: '0.2s' }}
              whileHover={{ y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="h-48 overflow-hidden rounded-lg mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1560493676-04071c5f467b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80" 
                  alt="Data training" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-5xl mb-4 text-[#2BA84A]">10,000+</div>
              <h3 className="text-xl font-bold mb-3 text-[#082B13]">Images Trained</h3>
              <p className="text-gray-700">Ensuring precise disease detection and recommendations through comprehensive training.</p>
            </motion.div>
            
            {/* Feature Card 3 */}
            <motion.div 
              className="feature-card bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-[#2BA84A] fade-in"
              style={{ opacity: 0, transform: 'translateY(20px)', transitionDelay: '0.4s' }}
              whileHover={{ y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="h-48 overflow-hidden rounded-lg mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1986&q=80" 
                  alt="AI models" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-5xl mb-4 text-[#2BA84A]">AI</div>
              <h3 className="text-xl font-bold mb-3 text-[#082B13]">Advanced Models</h3>
              <p className="text-gray-700">CNN, YOLO, and AI models drive accurate crop, plant, and market insights.</p>
            </motion.div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section className="px-6 lg:px-12 py-16 lg:py-24 bg-[#f8faf9]">
          <motion.h2 
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-center text-[#082B13] mb-16 fade-in"
            style={{ opacity: 0, transform: 'translateY(20px)' }}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            What Farmers Say
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Testimonial 1 */}
            <motion.div 
              className="bg-white p-6 rounded-2xl shadow-lg fade-in"
              style={{ opacity: 0, transform: 'translateY(20px)' }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <img 
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80" 
                    alt="Farmer" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold">Rajesh Kumar</h4>
                  <p className="text-sm text-gray-600">Wheat Farmer, Punjab</p>
                </div>
              </div>
              <p className="text-gray-700">"This AI system increased my crop yield by 30% while reducing water usage. Amazing technology!"</p>
            </motion.div>
            
            {/* Testimonial 2 */}
            <motion.div 
              className="bg-white p-6 rounded-2xl shadow-lg fade-in"
              style={{ opacity: 0, transform: 'translateY(20px)', transitionDelay: '0.2s' }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <img 
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1888&q=80" 
                    alt="Farmer" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold">Priya Sharma</h4>
                  <p className="text-sm text-gray-600">Organic Farmer, Kerala</p>
                </div>
              </div>
              <p className="text-gray-700">"The disease detection feature saved my entire banana plantation last season. Highly recommended!"</p>
            </motion.div>
            
            {/* Testimonial 3 */}
            <motion.div 
              className="bg-white p-6 rounded-2xl shadow-lg fade-in"
              style={{ opacity: 0, transform: 'translateY(20px)', transitionDelay: '0.4s' }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80" 
                    alt="Farmer" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold">Amit Patel</h4>
                  <p className="text-sm text-gray-600">Tea Estate Owner, Assam</p>
                </div>
              </div>
              <p className="text-gray-700">"Market predictions helped me get 20% better prices for my tea leaves. Game changer!"</p>
            </motion.div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="px-6 lg:px-12 py-16 lg:py-24 bg-[#082B13] text-white">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2 
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 fade-in"
              style={{ opacity: 0, transform: 'translateY(20px)' }}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              Ready to Transform Your Agriculture Practice?
            </motion.h2>
            <motion.p 
              className="text-lg md:text-xl mb-12 opacity-90 fade-in"
              style={{ opacity: 0, transform: 'translateY(20px)', transitionDelay: '0.2s' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Join thousands of farmers and agricultural experts who are already benefiting from our AI-powered platform.
            </motion.p>
            <motion.div
              className="fade-in"
              style={{ opacity: 0, transform: 'translateY(20px)', transitionDelay: '0.4s' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <motion.button 
                className="bg-[#2BA84A] text-white text-lg md:text-xl h-14 rounded-3xl px-8 flex mx-auto cursor-pointer gap-3 items-center justify-center hover:bg-[#C0F2CB] hover:text-[#082B13] transition-all duration-300 shadow-lg hover:shadow-xl"
                onClick={() => navigate('/signup')}
                whileHover={{ scale: 1.05, boxShadow: "0px 10px 25px rgba(43, 168, 74, 0.5)" }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started Now <motion.span animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>→</motion.span>
              </motion.button>
            </motion.div>
          </div>
        </section>
      </main>
      
      {/* Floating decorative elements */}
      <motion.div 
        className="absolute top-20 left-20 w-6 h-6 bg-[#2BA84A] rounded-full opacity-80 floating-element fade-in" 
        style={{ opacity: 0 }}
        initial={{ y: 0 }}
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute top-40 right-32 w-8 h-8 bg-[#A0D8B3] rounded-full opacity-80 floating-element fade-in" 
        style={{ opacity: 0 }}
        initial={{ y: 10 }}
        animate={{ y: [10, -10, 10] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />
      <motion.div 
        className="absolute bottom-20 left-40 w-5 h-5 bg-[#2BA84A] rounded-full opacity-80 floating-element fade-in" 
        style={{ opacity: 0 }}
        initial={{ y: 5 }}
        animate={{ y: [5, 25, 5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      <motion.div 
        className="absolute bottom-10 right-10 w-6 h-6 bg-[#A0D8B3] rounded-full opacity-80 floating-element fade-in" 
        style={{ opacity: 0 }}
        initial={{ y: 15 }}
        animate={{ y: [15, -5, 15] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
      />
      <motion.div 
        className="absolute top-80 left-1/2 w-7 h-7 bg-[#2BA84A] rounded-full opacity-80 floating-element fade-in" 
        style={{ opacity: 0 }}
        initial={{ y: 0 }}
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
      />
      
      {/* Add some animated blobs in the background */}
      <style jsx global>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .fade-in {
          transition: opacity 0.8s ease, transform 0.8s ease;
        }
      `}</style>
    </div>
  );
}

export default Landing;