"use client";

import { useState, useEffect } from 'react';
import { FiMenu, FiX, FiChevronDown, FiChevronUp, FiArrowRight, FiTwitter, FiFacebook, FiInstagram, FiLinkedin, FiGithub } from 'react-icons/fi';
import { FaDiscord } from 'react-icons/fa';

interface NavItem {
  name: string;
  href: string;
  subItems?: NavItem[];
}

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  const navItems: NavItem[] = [
    { name: 'Home', href: '#' },
    { name: 'How It Works', href: '#' },
    { name: 'Subjects', href: '#' },
    { name: 'FAQ', href: '#' },
    { name: 'About', href: '#' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSubMenu = (itemName: string) => {
    setActiveSubMenu(activeSubMenu === itemName ? null : itemName);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#181C23]/95 backdrop-blur-md py-2 shadow-xl' : 'bg-[#232B39] py-4'}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center">
              <a href="#" className="flex items-center">
                <span className="text-2xl font-bold bg-gradient-to-r from-[#2563EB] to-[#1E40AF] bg-clip-text text-transparent">
                  Askelo
                </span>
              </a>
            </div>
            

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <div key={item.name} className="relative group">
                  <button 
                    onClick={() => item.subItems && toggleSubMenu(item.name)}
                    className="flex items-center text-gray-200 hover:text-[#0EA5E9] transition-colors font-medium"
                  >
                    {item.name}
                    {item.subItems && (
                      activeSubMenu === item.name ? <FiChevronUp/> : <FiChevronDown/>
                    )}
                  </button>
                  {item.subItems && activeSubMenu === item.name && (
                    <div className="absolute left-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-50">
                      {item.subItems.map((subItem) => (
                        <a
                          key={subItem.name}
                          href={subItem.href}
                          className="block px-4 py-2 text-white hover:bg-gray-700 transition-colors"
                        >
                          {subItem.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <a
                href="#"
                className="px-4 py-2 text-gray-200 hover:text-[#0EA5E9] transition-colors"
              >
                Login
              </a>
              <a
                href="#"
                className="px-6 py-2 bg-gradient-to-r from-[#2563EB] to-[#1E40AF] text-white rounded-full hover:from-[#1E40AF] hover:to-[#2563EB] transition-all shadow-lg hover:shadow-blue-500/30"
              >
                Get Started
              </a>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white focus:outline-none"
              >
                {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-gray-900/95 backdrop-blur-md">
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-col space-y-4">
                {navItems.map((item) => (
                  <div key={item.name}>
                    <button
                      onClick={() => item.subItems && toggleSubMenu(item.name)}
                      className="flex items-center justify-between w-full text-white py-2"
                    >
                      <span>{item.name}</span>
                      {item.subItems && (
                        activeSubMenu === item.name ? <FiChevronUp /> : <FiChevronDown />
                      )}
                    </button>
                    {item.subItems && activeSubMenu === item.name && (
                      <div className="ml-4 mt-2 space-y-2">
                        {item.subItems.map((subItem) => (
                          <a
                            key={subItem.name}
                            href={subItem.href}
                            className="block py-2 text-gray-300 hover:text-white"
                          >
                            {subItem.name}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <div className="pt-4 border-t border-gray-800 space-y-4">
                  <a
                    href="#"
                    className="block w-full px-4 py-2 text-center text-white bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg"
                  >
                    Get Started
                  </a>
                  <a
                    href="#"
                    className="block w-full px-4 py-2 text-center text-white border border-gray-700 rounded-lg hover:bg-gray-800"
                  >
                    Login
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-24">{children}</main>

      {/* Footer */}
      <footer className="bg-[#181C23] text-gray-200 pt-16 pb-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Company Info */}
            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-[#2563EB] to-[#1E40AF] bg-clip-text text-transparent mb-4">
                Askelo
              </h3>
              <p className="text-gray-400 mb-6">
                Askelo is your AI-powered homework helper. Get instant, step-by-step explanations for Math, Science, English, and more. Upload a photo or type your question—Askelo helps you understand, not just get answers. We respect your privacy and never store your questions.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-[#0EA5E9] transition-colors">
                  <FiTwitter size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-[#0EA5E9] transition-colors">
                  <FiFacebook size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-[#0EA5E9] transition-colors">
                  <FiInstagram size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-[#0EA5E9] transition-colors">
                  <FiLinkedin size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-[#0EA5E9] transition-colors">
                  <FaDiscord size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-[#0EA5E9] transition-colors">
                  <FiGithub size={20} />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Home</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Services</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Subjects (was Services) */}
            <div>
              <h4 className="text-lg font-semibold mb-4">What Askelo Offers</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-[#0EA5E9] transition-colors">Step-by-step Explanations</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#0EA5E9] transition-colors">Photo Upload for Homework</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#0EA5E9] transition-colors">Math Help</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#0EA5E9] transition-colors">Science Help</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#0EA5E9] transition-colors">English Help</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#0EA5E9] transition-colors">History Help</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#0EA5E9] transition-colors">Privacy First</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#0EA5E9] transition-colors">Free to Use (Beta)</a></li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
              <p className="text-gray-400 mb-4">
                Subscribe to our newsletter for the latest updates and news.
              </p>
              <form className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="px-4 py-2 bg-gray-800 text-white rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-r-lg hover:from-purple-700 hover:to-blue-600 transition-all"
                >
                  <FiArrowRight />
                </button>
              </form>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-[#232B39] mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Askelo. Homework help, made simple.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-500 hover:text-[#0EA5E9] text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-500 hover:text-[#0EA5E9] text-sm transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-500 hover:text-[#0EA5E9] text-sm transition-colors">
                Cookies Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}