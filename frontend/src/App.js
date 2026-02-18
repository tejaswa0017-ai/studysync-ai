import React, { useEffect, useState, useRef } from 'react';
import '@/App.css';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ChefHat, MapPin, Phone, Mail, Clock, Star, Utensils, Award, Heart, Flame, Leaf, UtensilsCrossed, Coffee, Truck, Volume1, CalendarCheck, Users, CarFront, Armchair, UsersRound, Baby } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function App() {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('north-indian');
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 150 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);
  
  const heroRef = useRef(null);

  useEffect(() => {
    fetchCategories();
    fetchMenuItems();
    
    const handleScroll = () => {
      const menuSection = document.getElementById('menu');
      if (menuSection) {
        const rect = menuSection.getBoundingClientRect();
        setIsMenuVisible(rect.top < window.innerHeight && rect.bottom > 0);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    if (selectedCategory) {
      fetchMenuItems(selectedCategory);
    }
  }, [selectedCategory]);

  const handleMouseMove = (event) => {
    if (heroRef.current) {
      const rect = heroRef.current.getBoundingClientRect();
      mouseX.set(event.clientX - rect.left - rect.width / 2);
      mouseY.set(event.clientY - rect.top - rect.height / 2);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API}/menu/categories`);
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchMenuItems = async (category = null) => {
    try {
      const url = category ? `${API}/menu?category=${category}` : `${API}/menu`;
      const response = await axios.get(url);
      setMenuItems(response.data);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/contact`, contactForm);
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setContactForm({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    }
  };

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="App">
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-8 py-4 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 flex items-center gap-8" data-testid="main-nav">
        <button onClick={() => scrollToSection('hero')} className="text-amber-500 font-bold text-xl" data-testid="nav-logo">Taam Jham</button>
        <button onClick={() => scrollToSection('menu')} className="text-zinc-400 hover:text-white transition-colors" data-testid="nav-menu">Menu</button>
        <button onClick={() => scrollToSection('about')} className="text-zinc-400 hover:text-white transition-colors" data-testid="nav-about">About</button>
        <button onClick={() => scrollToSection('contact')} className="text-zinc-400 hover:text-white transition-colors" data-testid="nav-contact">Contact</button>
      </nav>

      <section 
        id="hero" 
        ref={heroRef}
        onMouseMove={handleMouseMove}
        className="relative min-h-screen w-full overflow-hidden bg-zinc-950 flex items-center justify-center"
        data-testid="hero-section"
      >
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at center, rgba(251, 191, 36, 0.15) 0%, rgba(0,0,0,0) 70%)' }} />
        
        <motion.div
          className="absolute"
          style={{
            x: useTransform(x, [-500, 500], [-30, 30]),
            y: useTransform(y, [-500, 500], [-30, 30]),
            top: '10%',
            left: '15%',
            width: '200px',
            height: '200px'
          }}
        >
          <img src="https://images.pexels.com/photos/14935009/pexels-photo-14935009.jpeg" alt="Burger" className="w-full h-full object-cover rounded-2xl shadow-[0_0_40px_rgba(251,191,36,0.3)]" />
        </motion.div>

        <motion.div
          className="absolute"
          style={{
            x: useTransform(x, [-500, 500], [40, -40]),
            y: useTransform(y, [-500, 500], [40, -40]),
            top: '15%',
            right: '10%',
            width: '180px',
            height: '180px'
          }}
        >
          <img src="https://images.pexels.com/photos/33455847/pexels-photo-33455847.jpeg" alt="Pasta" className="w-full h-full object-cover rounded-2xl shadow-[0_0_40px_rgba(251,191,36,0.3)]" />
        </motion.div>

        <motion.div
          className="absolute"
          style={{
            x: useTransform(x, [-500, 500], [-50, 50]),
            y: useTransform(y, [-500, 500], [50, -50]),
            bottom: '15%',
            left: '10%',
            width: '160px',
            height: '160px'
          }}
        >
          <img src="https://images.pexels.com/photos/1395319/pexels-photo-1395319.jpeg" alt="Noodles" className="w-full h-full object-cover rounded-2xl shadow-[0_0_40px_rgba(251,191,36,0.3)]" />
        </motion.div>

        <motion.div
          className="absolute"
          style={{
            x: useTransform(x, [-500, 500], [35, -35]),
            y: useTransform(y, [-500, 500], [-35, 35]),
            bottom: '20%',
            right: '15%',
            width: '150px',
            height: '150px'
          }}
        >
          <img src="https://images.pexels.com/photos/227906/pexels-photo-227906.jpeg" alt="Cocktail" className="w-full h-full object-cover rounded-2xl shadow-[0_0_40px_rgba(251,191,36,0.3)]" />
        </motion.div>

        <motion.div
          className="absolute"
          style={{
            x: useTransform(x, [-500, 500], [-25, 25]),
            y: useTransform(y, [-500, 500], [-25, 25]),
            top: '50%',
            left: '8%',
            width: '140px',
            height: '140px'
          }}
        >
          <img src="https://images.pexels.com/photos/34159113/pexels-photo-34159113.jpeg" alt="Curry" className="w-full h-full object-cover rounded-2xl shadow-[0_0_40px_rgba(251,191,36,0.3)]" />
        </motion.div>

        <motion.div
          className="absolute"
          style={{
            x: useTransform(x, [-500, 500], [30, -30]),
            y: useTransform(y, [-500, 500], [30, -30]),
            top: '45%',
            right: '8%',
            width: '140px',
            height: '140px'
          }}
        >
          <img src="https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg" alt="Fries" className="w-full h-full object-cover rounded-2xl shadow-[0_0_40px_rgba(251,191,36,0.3)]" />
        </motion.div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto" data-testid="hero-content">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <div className="inline-block px-8 py-4 rounded-2xl bg-black/40 backdrop-blur-xl border border-amber-500/30 shadow-[0_0_30px_rgba(251,191,36,0.3)] mb-8">
              <h2 className="text-amber-500 font-['Cinzel'] text-2xl tracking-widest">TAAM JHAM</h2>
              <div className="h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent my-3" />
              <p className="text-zinc-300 text-sm tracking-wider">MULTI-CUISINE RESTAURANT</p>
            </div>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-['Playfair_Display'] text-6xl md:text-8xl font-black tracking-tight leading-none mb-6"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-600">A World of</span>
            <br />
            <span className="text-white">Flavors Await</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-base md:text-lg leading-relaxed text-zinc-300 mb-8 max-w-2xl mx-auto"
          >
            Experience the finest North Indian, Italian, Indo-Chinese cuisines and more,
            crafted with passion and served with pride.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex gap-4 justify-center flex-wrap mb-12"
          >
            <div className="px-6 py-3 rounded-full bg-zinc-900/50 border border-amber-500/30 backdrop-blur-xl flex items-center gap-2 text-amber-500" data-testid="service-all-you-can-eat">
              <UtensilsCrossed className="w-5 h-5" />
              <span className="text-sm font-semibold">All You Can Eat</span>
            </div>
            <div className="px-6 py-3 rounded-full bg-zinc-900/50 border border-amber-500/30 backdrop-blur-xl flex items-center gap-2 text-amber-500" data-testid="service-fireplace">
              <Flame className="w-5 h-5" />
              <span className="text-sm font-semibold">Fireplace</span>
            </div>
            <div className="px-6 py-3 rounded-full bg-zinc-900/50 border border-amber-500/30 backdrop-blur-xl flex items-center gap-2 text-amber-500" data-testid="service-vegetarian">
              <Leaf className="w-5 h-5" />
              <span className="text-sm font-semibold">Vegetarian Options</span>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex gap-4 justify-center flex-wrap"
          >
            <Button 
              onClick={() => scrollToSection('menu')}
              className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-8 py-6 text-lg rounded-full transition-all duration-300 hover:scale-105 shadow-[0_0_20px_rgba(245,158,11,0.4)]" 
              data-testid="hero-explore-menu-btn"
            >
              <Utensils className="mr-2" /> Explore Menu
            </Button>
            <Button 
              onClick={() => scrollToSection('contact')}
              className="bg-transparent border-2 border-amber-500/50 text-amber-500 hover:bg-amber-500/10 px-8 py-6 text-lg rounded-full transition-all duration-300" 
              data-testid="hero-contact-btn"
            >
              <MapPin className="mr-2" /> Visit Us
            </Button>
          </motion.div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-zinc-950" />
      </section>

      <section id="menu" className="py-24 md:py-32 bg-zinc-950" data-testid="menu-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-['Playfair_Display'] text-4xl md:text-6xl font-bold tracking-tight mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-600">Our Menu</span>
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-zinc-300 max-w-2xl mx-auto">Explore our diverse culinary offerings</p>
          </motion.div>

          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full" data-testid="menu-tabs">
            <TabsList className="w-full flex flex-wrap justify-center gap-3 mb-12 bg-transparent" data-testid="menu-tabs-list">
              {categories.map((cat) => (
                <TabsTrigger
                  key={cat.id}
                  value={cat.id}
                  className="px-8 py-4 rounded-full bg-zinc-900/50 border border-white/5 hover:border-amber-500/30 data-[state=active]:bg-amber-500 data-[state=active]:text-black data-[state=active]:border-amber-500 transition-all duration-300 text-zinc-300 data-[state=active]:shadow-[0_0_20px_rgba(245,158,11,0.4)]"
                  data-testid={`menu-tab-${cat.id}`}
                >
                  <span className="mr-2 text-xl">{cat.icon}</span>
                  {cat.name}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={selectedCategory} className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group relative overflow-hidden rounded-xl bg-zinc-900/50 border border-white/5 hover:border-amber-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-black/50"
                    data-testid={`menu-item-${item.id}`}
                  >
                    <div className="aspect-[4/3] overflow-hidden">
                      <img 
                        src={item.image_url || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg'} 
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-2xl font-['Playfair_Display'] font-semibold text-white">{item.name}</h3>
                        {item.is_popular && (
                          <div className="flex items-center gap-1 text-amber-500" data-testid={`popular-badge-${item.id}`}>
                            <Star className="w-4 h-4 fill-amber-500" />
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-zinc-400 mb-4 leading-relaxed">{item.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-amber-500">₹{item.price}</span>
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs ${item.is_veg ? 'bg-green-500/20 text-green-500 border border-green-500/30' : 'bg-red-500/20 text-red-500 border border-red-500/30'}`}>
                            {item.is_veg ? '🟢 Veg' : '🔴 Non-Veg'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <section id="about" className="py-24 md:py-32 bg-zinc-900" data-testid="about-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-['Playfair_Display'] text-4xl md:text-6xl font-bold tracking-tight mb-6">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-600">Our Story</span>
              </h2>
              <p className="text-base md:text-lg leading-relaxed text-zinc-300 mb-6">
                Taam Jham is not just a restaurant; it's a celebration of culinary diversity. 
                Founded with a passion for bringing together the finest flavors from around the world, 
                we pride ourselves on authenticity, quality, and an unforgettable dining experience.
              </p>
              <p className="text-base md:text-lg leading-relaxed text-zinc-300 mb-8">
                From the rich, aromatic spices of North India to the creamy indulgence of Italian classics, 
                and the bold, savory notes of Indo-Chinese fusion, every dish tells a story.
              </p>
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center p-6 rounded-2xl bg-zinc-900/30 border border-white/5" data-testid="stat-years">
                  <Award className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-amber-500 mb-1">10+</div>
                  <div className="text-sm text-zinc-400">Years</div>
                </div>
                <div className="text-center p-6 rounded-2xl bg-zinc-900/30 border border-white/5" data-testid="stat-dishes">
                  <ChefHat className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-amber-500 mb-1">100+</div>
                  <div className="text-sm text-zinc-400">Dishes</div>
                </div>
                <div className="text-center p-6 rounded-2xl bg-zinc-900/30 border border-white/5" data-testid="stat-customers">
                  <Heart className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-amber-500 mb-1">50K+</div>
                  <div className="text-sm text-zinc-400">Happy Customers</div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(251,191,36,0.2)]">
                <img 
                  src="https://images.pexels.com/photos/19343364/pexels-photo-19343364.jpeg" 
                  alt="Restaurant Interior"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="contact" className="py-24 md:py-32 bg-zinc-950" data-testid="contact-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-['Playfair_Display'] text-4xl md:text-6xl font-bold tracking-tight mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-600">Visit Us</span>
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-zinc-300">We'd love to hear from you</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="space-y-8">
                <div className="p-8 rounded-2xl bg-zinc-900/50 border border-white/5 hover:bg-zinc-900/50 transition-all duration-300" data-testid="contact-address">
                  <MapPin className="w-8 h-8 text-amber-500 mb-4" />
                  <h3 className="text-2xl font-['Playfair_Display'] font-semibold text-white mb-2">Address</h3>
                  <p className="text-zinc-400 text-sm mb-2">Located in: Times Square Grand</p>
                  <p className="text-zinc-300">206-212, 2nd Floor, Times Square Grand,<br />Sindhu Bhavan Marg, Bodakdev,<br />Ahmedabad, Gujarat 380059</p>
                </div>
                
                <div className="p-8 rounded-2xl bg-zinc-900/50 border border-white/5 hover:bg-zinc-900/50 transition-all duration-300" data-testid="contact-phone">
                  <Phone className="w-8 h-8 text-amber-500 mb-4" />
                  <h3 className="text-2xl font-['Playfair_Display'] font-semibold text-white mb-2">Phone</h3>
                  <p className="text-zinc-300">+91 092654 48971</p>
                </div>
                
                <div className="p-8 rounded-2xl bg-zinc-900/50 border border-white/5 hover:bg-zinc-900/50 transition-all duration-300" data-testid="contact-hours">
                  <Clock className="w-8 h-8 text-amber-500 mb-4" />
                  <h3 className="text-2xl font-['Playfair_Display'] font-semibold text-white mb-2">Hours</h3>
                  <p className="text-zinc-300">Monday - Sunday<br />11:00 AM - 11:00 PM</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <form onSubmit={handleContactSubmit} className="p-8 rounded-2xl bg-zinc-900/50 border border-white/5" data-testid="contact-form">
                <h3 className="text-2xl font-['Playfair_Display'] font-semibold text-white mb-6">Send us a message</h3>
                <div className="space-y-6">
                  <div>
                    <Input
                      type="text"
                      placeholder="Your Name"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      required
                      className="bg-zinc-800/50 border-white/10 text-white placeholder:text-zinc-500 focus:border-amber-500 focus:ring-amber-500"
                      data-testid="contact-name-input"
                    />
                  </div>
                  <div>
                    <Input
                      type="email"
                      placeholder="Your Email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      required
                      className="bg-zinc-800/50 border-white/10 text-white placeholder:text-zinc-500 focus:border-amber-500 focus:ring-amber-500"
                      data-testid="contact-email-input"
                    />
                  </div>
                  <div>
                    <Input
                      type="tel"
                      placeholder="Your Phone"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                      className="bg-zinc-800/50 border-white/10 text-white placeholder:text-zinc-500 focus:border-amber-500 focus:ring-amber-500"
                      data-testid="contact-phone-input"
                    />
                  </div>
                  <div>
                    <Textarea
                      placeholder="Your Message"
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      required
                      rows={5}
                      className="bg-zinc-800/50 border-white/10 text-white placeholder:text-zinc-500 focus:border-amber-500 focus:ring-amber-500"
                      data-testid="contact-message-textarea"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-6 rounded-full transition-all duration-300 hover:scale-105 shadow-[0_0_20px_rgba(245,158,11,0.4)]"
                    data-testid="contact-submit-btn"
                  >
                    <Mail className="mr-2" /> Send Message
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      <footer className="py-12 bg-black border-t border-white/5" data-testid="footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-zinc-500 mb-4">© 2024 Taam Jham. All rights reserved.</p>
          <p className="text-zinc-600 text-sm">Crafted with passion for culinary excellence</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
