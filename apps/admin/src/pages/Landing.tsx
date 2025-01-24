import { Link } from 'react-router-dom';
import { useState } from 'react';

const Landing = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-boxdark-2">
      {/* Header/Navigation */}
      <header className="fixed w-full bg-white/90 backdrop-blur-sm dark:bg-boxdark/90 z-50">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 z-10">
              <img src="/minubumwe.svg" alt="Minubumwe" className="w-10 h-10" />
              <div className="text-2xl font-bold text-primary">Minubumwe</div>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden z-10 p-2 text-gray-600 hover:text-primary dark:text-gray-400"
            >
              {mobileMenuOpen ? (
                // Close Icon
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                // Menu Icon
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-gray-600 hover:text-primary dark:text-gray-400">Home</Link>
              <Link to="/about" className="text-gray-600 hover:text-primary dark:text-gray-400">About</Link>
              <Link to="/projects" className="text-gray-600 hover:text-primary dark:text-gray-400">Projects</Link>
              <Link to="/contact" className="text-gray-600 hover:text-primary dark:text-gray-400">Contact</Link>
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex gap-4">
              <Link 
                to="/signin" 
                className="px-6 py-2 rounded-lg border border-primary text-primary hover:bg-primary hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link 
                to="/ngo-registration" 
                className="px-6 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
              >
                Register NGO
              </Link>
            </div>
          </div>

          {/* Mobile Menu */}
          <div
            className={`fixed inset-0 bg-white/95 dark:bg-boxdark/95 backdrop-blur-sm transform ${
              mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
            } transition-transform duration-300 ease-in-out md:hidden z-40`}
          >
            <div className="flex flex-col h-full pt-24 px-6">
              <div className="flex flex-col space-y-6">
                <Link 
                  to="/" 
                  className="text-xl font-medium text-gray-800 hover:text-primary dark:text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link 
                  to="/about" 
                  className="text-xl font-medium text-gray-800 hover:text-primary dark:text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </Link>
                <Link 
                  to="/projects" 
                  className="text-xl font-medium text-gray-800 hover:text-primary dark:text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Projects
                </Link>
                <Link 
                  to="/contact" 
                  className="text-xl font-medium text-gray-800 hover:text-primary dark:text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </Link>
              </div>

              <div className="mt-12 flex flex-col space-y-4">
                <Link 
                  to="/signin" 
                  className="w-full px-6 py-3 rounded-lg border-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors text-center font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link 
                  to="/ngo-registration" 
                  className="w-full px-6 py-3 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors text-center font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register NGO
                </Link>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 bg-gradient-to-b from-primary/5 to-white dark:from-boxdark dark:to-boxdark-2">
        <div className="container mx-auto px-4">
          <div className="min-h-[80vh] flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-6xl font-bold text-black dark:text-white mb-6">
                Making a Difference in <span className="text-primary">Rwanda</span>
              </h1>
              <p className="text-base md:text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl">
                Join us in our mission to empower communities through sustainable development projects and volunteer initiatives.
              </p>
              <div className="flex gap-4 flex-wrap justify-center md:justify-start">
                <Link
                  to="/about"
                  className="w-full md:w-auto px-8 py-3 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors text-center"
                >
                  Learn More
                </Link>
                <Link
                  to="/ngo-registration"
                  className="w-full md:w-auto px-8 py-3 rounded-lg border border-primary text-primary hover:bg-primary hover:text-white transition-colors text-center"
                >
                  JOIN NOW
                </Link>
              </div>
            </div>
            <div className="flex-1 w-full md:w-auto">
              <img 
                src="/images.png"
                alt="Community Impact" 
                className="rounded-lg shadow-xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-16 bg-white dark:bg-boxdark">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">50+</div>
              <div className="text-gray-600 dark:text-gray-400">Projects Completed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">1000+</div>
              <div className="text-gray-600 dark:text-gray-400">Volunteers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">20+</div>
              <div className="text-gray-600 dark:text-gray-400">Communities Served</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">5000+</div>
              <div className="text-gray-600 dark:text-gray-400">Lives Impacted</div>
            </div>
          </div>
        </div>
      </section>

      {/* Current Projects */}
      <section className="py-16 bg-gray-50 dark:bg-boxdark-2">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-black dark:text-white">
            Our Current Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Project Card 1 */}
            <div className="bg-white dark:bg-boxdark rounded-lg overflow-hidden shadow-md">
              <img src="/images.png" alt="Project 1" className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-black dark:text-white">
                  Community Education
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Providing educational resources and support to rural communities.
                </p>
                <Link to="/projects/1" className="text-primary hover:underline">
                  Learn More →
                </Link>
              </div>
            </div>

            {/* Project Card 2 */}
            <div className="bg-white dark:bg-boxdark rounded-lg overflow-hidden shadow-md">
              <img src="/images.png" alt="Project 2" className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-black dark:text-white">
                  Healthcare Access
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Improving access to healthcare services in remote areas.
                </p>
                <Link to="/projects/2" className="text-primary hover:underline">
                  Learn More →
                </Link>
              </div>
            </div>

            {/* Project Card 3 */}
            <div className="bg-white dark:bg-boxdark rounded-lg overflow-hidden shadow-md">
              <img src="/images.png" alt="Project 3" className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-black dark:text-white">
                  Agricultural Development
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Supporting sustainable farming practices and food security.
                </p>
                <Link to="/projects/3" className="text-primary hover:underline">
                  Learn More →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Join Us in Making a Difference
          </h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Whether you want to volunteer, donate, or partner with us, there are many ways to contribute to our mission.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/volunteer"
              className="px-8 py-3 rounded-lg bg-white text-primary hover:bg-gray-100 transition-colors"
            >
              Volunteer With Us
            </Link>
            <Link
              to="/contact"
              className="px-8 py-3 rounded-lg border-2 border-white text-white hover:bg-white/10 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Minubumwe</h3>
              <p className="text-gray-400">
                Empowering communities through sustainable development and volunteer initiatives.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
                <li><Link to="/projects" className="text-gray-400 hover:text-white">Projects</Link></li>
                <li><Link to="/volunteer" className="text-gray-400 hover:text-white">Volunteer</Link></li>
                <li><Link to="/donate" className="text-gray-400 hover:text-white">Donate</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Kigali, Rwanda</li>
                <li>info@minubumwe.org</li>
                <li>+250 123 456 789</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Facebook</span>
                  {/* Add social media icons */}
                </a>
                {/* Add more social media links */}
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Minubumwe. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing; 