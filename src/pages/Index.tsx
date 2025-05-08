
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, CreditCard, MapPin, QrCode, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MainLayout } from '@/layouts/MainLayout';
import { SectionTitle } from '@/components/ui/section-title';
import { FeatureCard } from '@/components/ui/feature-card';

const Index = () => {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background to-accent/30 pt-20 pb-24">
        <div className="container px-4 mx-auto relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-block px-4 py-1.5 mb-6 text-xs font-semibold tracking-wide uppercase rounded-full bg-primary/10 text-primary"
            >
              University Parking Made Simple
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold tracking-tight mb-6"
            >
              Reserve Your Parking Spot <br className="hidden sm:block" />
              <span className="text-primary">In Seconds</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
            >
              No more driving in circles. Book your spot in advance, pay with UPI, and enter campus with a simple QR code scan.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/parking">
                <Button size="lg" className="w-full sm:w-auto group">
                  Find Parking
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Login
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
        
        {/* Background Decoration */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none"
        >
          <div className="absolute -right-24 -top-24 w-96 h-96 bg-primary opacity-10 rounded-full blur-3xl"></div>
          <div className="absolute -left-24 top-1/3 w-96 h-96 bg-primary opacity-10 rounded-full blur-3xl"></div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container px-4 mx-auto">
          <SectionTitle 
            title="How It Works"
            description="Our streamlined process makes parking on campus effortless"
            align="center"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={Calendar}
              title="Book in Advance"
              description="Reserve your parking spot a day before or check real-time availability for same-day parking."
              index={0}
            />
            <FeatureCard 
              icon={CreditCard}
              title="Pay with UPI"
              description="Securely pay the minimal parking fee using any UPI app of your choice."
              index={1}
            />
            <FeatureCard 
              icon={QrCode}
              title="Scan & Enter"
              description="Show your unique QR code to security personnel at the gate for quick verification."
              index={2}
            />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-accent/40">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row gap-12">
            <div className="md:w-1/2">
              <SectionTitle 
                title="Why Choose ParkIt?"
                description="We're solving the daily campus parking struggle with technology"
              />
              
              <motion.ul 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="space-y-4"
              >
                {[
                  "Save time finding parking every morning",
                  "Eliminate the stress of full parking lots",
                  "Enter campus quickly with QR verification",
                  "Affordable daily rates with UPI payments",
                  "Guaranteed spot when you arrive on campus"
                ].map((benefit, index) => (
                  <motion.li 
                    key={index}
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      visible: { 
                        opacity: 1, 
                        x: 0,
                        transition: { delay: index * 0.1 + 0.2 }
                      }
                    }}
                    className="flex items-start"
                  >
                    <div className="mr-3 mt-1 bg-primary/20 rounded-full p-1">
                      <ShieldCheck className="h-4 w-4 text-primary" />
                    </div>
                    <span>{benefit}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </div>
            
            <div className="md:w-1/2 relative min-h-[300px]">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="absolute inset-0 bg-card rounded-2xl border border-border shadow-lg overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10"></div>
                <div className="relative h-full flex items-center justify-center p-8">
                  <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
                    {Array.from({ length: 9 }).map((_, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 + 0.3 }}
                        viewport={{ once: true }}
                        className={`aspect-square rounded-lg border-2 flex items-center justify-center ${
                          index % 3 === 1 ? 'border-primary bg-primary/5' : 'border-border'
                        }`}
                      >
                        {index % 3 === 1 && (
                          <MapPin className="h-5 w-5 text-primary" />
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-background">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <SectionTitle 
              title="Ready to Simplify Your Campus Parking?"
              description="Join hundreds of students already using ParkIt to make their daily commute easier."
              align="center"
            />
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Create an Account
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Learn More
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
