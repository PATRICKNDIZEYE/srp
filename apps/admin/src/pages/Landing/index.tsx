import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiDroplet, FiTruck, FiDollarSign, FiBarChart2, FiUsers,
  FiAward, FiPhoneCall, FiHelpCircle, FiShield, FiSmartphone,
  FiClock, FiCheck, FiStar, FiMessageCircle, FiMapPin, FiChevronDown, FiChevronUp
} from 'react-icons/fi';
import axiosInstance from '../../utils/axios';

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      id: 1,
      title: 'Gutanga Amata',
      description: 'Gutanga no gukurikirana amata yawe buri munsi',
      icon: <FiDroplet className="w-8 h-8 text-blue-500" />,
      path: '/farmer/submit-milk'
    },
    {
      id: 2,
      title: 'Gukurikirana',
      description: 'Kumenya aho amata yawe ageze kuva yatangwa',
      icon: <FiTruck className="w-8 h-8 text-green-500" />,
      path: '/farmer/dashboard'
    },
    {
      id: 3,
      title: 'Kwishyurwa',
      description: 'Gukurikirana amafaranga n\'ibihembo byawe',
      icon: <FiDollarSign className="w-8 h-8 text-yellow-500" />,
      path: '/farmer/payments'
    },
    {
      id: 4,
      title: 'Raporo',
      description: 'Kureba raporo irambuye y\'umusaruro wawe',
      icon: <FiBarChart2 className="w-8 h-8 text-purple-500" />,
      path: '/farmer/dashboard'
    }
  ];

  const benefits = [
    {
      id: 1,
      title: 'Ubufasha buri gihe',
      description: 'Dufite ikipe ihoraho yo kugufasha',
      icon: <FiPhoneCall className="w-8 h-8 text-indigo-500" />
    },
    {
      id: 2,
      title: 'Ibiciro byiza',
      description: 'Ibiciro birasumbana ugereranyije n\'ahandi',
      icon: <FiAward className="w-8 h-8 text-red-500" />
    },
    {
      id: 3,
      title: 'Uburyo bworoshye',
      description: 'Uburyo bworoshye bwo gutanga no gukurikirana amata',
      icon: <FiHelpCircle className="w-8 h-8 text-orange-500" />
    }
  ];

  const testimonials = [
    {
      id: 1,
      name: 'Mugisha Jean',
      role: 'Umuhinzi wo mu Nyagatare',
      image: 'https://dairybusinessafrica.com/wp-content/uploads/2024/01/9cc5eda8-83fd-499e-b41e-0dcaa4bb5e75.jpg',
      quote: 'SJRP yatumye gutanga amata byoroha cyane. Ubu nshobora gukurikirana aho amata yanjye ageze hose.',
      rating: 5
    },
    {
      id: 2,
      name: 'Uwase Marie',
      role: 'Nyir\'uruganda rw\'amata mu Rwamagana',
      image: 'https://dairybusinessafrica.com/wp-content/uploads/2024/01/9cc5eda8-83fd-499e-b41e-0dcaa4bb5e75.jpg',
      quote: 'Uburyo bwabo bworohereza cyane kandi bufasha mu micungire y\'ibikorwa byacu bya buri munsi.',
      rating: 5
    },
    {
      id: 3,
      name: 'Kamanzi Eric',
      role: 'Umuyobozi wa POC i Nyanza',
      image: 'https://dairybusinessafrica.com/wp-content/uploads/2024/01/9cc5eda8-83fd-499e-b41e-0dcaa4bb5e75.jpg',
      quote: 'Gukoresha SJRP byatumye dutera imbere mu buryo butangaje mu mwaka umwe gusa.',
      rating: 5
    }
  ];

  const howItWorks = [
    {
      id: 1,
      title: 'Iyandikishe',
      description: 'Uzuza amakuru yawe nk\'amazina, aho uherereye, na nimero ya telephone',
      icon: <FiUsers />,
      image: 'https://dairybusinessafrica.com/wp-content/uploads/2024/01/9cc5eda8-83fd-499e-b41e-0dcaa4bb5e75.jpg'
    },
    {
      id: 2,
      title: 'TEGEREZA Ko wakemerwa',
      description: 'Aho amata akusanyirizwa kuri POC iri hafi yawe izakwemera',
      icon: <FiMapPin />,
      image: 'https://dairybusinessafrica.com/wp-content/uploads/2024/01/9cc5eda8-83fd-499e-b41e-0dcaa4bb5e75.jpg'
    },
    {
      id: 3,
      title: 'Tangira Gutanga Amata',
      description: 'Jyana amata kuri POC, bazayapima, bakayanoza, bakayakira',
      icon: <FiDroplet />,
      image: 'https://dairybusinessafrica.com/wp-content/uploads/2024/01/9cc5eda8-83fd-499e-b41e-0dcaa4bb5e75.jpg'
    },
    {
      id: 4,
      title: 'Kwishyurwa',
      description: 'Wakirira amafaranga yawe kuri Mobile Money cyangwa kuri Banki',
      icon: <FiDollarSign />,
      image: 'https://dairybusinessafrica.com/wp-content/uploads/2024/01/9cc5eda8-83fd-499e-b41e-0dcaa4bb5e75.jpg'
    },
    {
      id: 5,
      title: 'Gusaba Inguzanyo',
      description: 'Ushobora gusaba inguzanyo ukurikije umusaruro wawe w\'amata watanze',
      icon: <FiDollarSign />,
      image: 'https://dairybusinessafrica.com/wp-content/uploads/2024/01/9cc5eda8-83fd-499e-b41e-0dcaa4bb5e75.jpg'
    }
  ];

  const newsUpdates = [
    {
      id: 1,
      title: 'Uburyo Bushya bwo Kwishyura',
      description: 'Ubu ushobora kwishyurwa mu buryo bworoshye kurusha mbere. Dushyizeho uburyo bushya bwo kwishyurwa kuri Mobile Money na Bank.',
      date: '2024-03-15',
      link: '/news/payment-system'
    },
    {
      id: 2,
      title: 'Gahunda yo Guteza Imbere Ubuhinzi',
      description: 'SJRP ifatanije na RAB mu guteza imbere ubuhinzi bw\'inka mu Rwanda.',
      date: '2024-03-10',
      link: '/news/farming-program'
    }
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: "Ni ryari nashobora kubona amafaranga y'amata natanze?",
      a: "Kwishyurwa bikorwa buri cyumweru, ku wa gatanu."
    },
    {
      q: "Ese mba nkeneye telephone yo muri categories zihanitse?",
      a: "Oya, urubuga rwacu rukora kuri telephone zose zifite internet."
    },
    {
      q: "Ni gute nakoresha system yanyu?",
      a: "Banza wiyandikishe, nyuma uzajya utanga amata kuri POC hafi yawe."
    },
    {
      q: "Ni gute nasaba inguzanyo?",
      a: "Ugomba kuba waratanze amata nibura amezi 3 yose kandi ufite umusaruro mwiza."
    },
    {
      q: "Ni ryari mbona inguzanyo nasabye?",
      a: "Inguzanyo zisuzumwa mu gihe cy'iminsi 2 nyuma yo kuyisaba."
    }
  ];

  const [stats, setStats] = useState({
    totalFarmers: 0,
    totalMilkLiters: 0,
    activePOCs: 0,
    activeDiaries: 0,
    qualityRate: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axiosInstance.get('/api/stats/dashboard');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
        // Set default values on error
        setStats({
          totalFarmers: 0,
          totalMilkLiters: 0,
          activePOCs: 0,
          activeDiaries: 0,
          qualityRate: 0
        });
      }
    };

    fetchStats();
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navItems = [
    { id: 1, label: 'Ahabanza', sectionId: 'home' },
    { id: 2, label: 'Uko Bikorwa', sectionId: 'howItWorks' },
    { id: 4, label: 'Ibyiza Byacu', sectionId: 'benefits' },
    { id: 5, label: 'Ibibazo', sectionId: 'faq' },
    { id: 6, label: 'Twandikire', sectionId: 'contact' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-blue-600">SJRP</h1>
          <span className="ml-4 text-gray-600">Smart Milk Collection System</span>
        </div>
      </header>

      {/* Top Contact Bar */}
      <div className="bg-blue-900 text-white py-2">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-4">
              <a href="tel:+250 792 575 100" className="flex items-center">
                <FiPhoneCall className="mr-2" /> 250 792 575 100
              </a>
              <a href="mailto:info@SJRP.rw" className="flex items-center">
                <FiMessageCircle className="mr-2" /> info@SJRP.rw
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <FiClock className="mr-2" /> 7:00 - 18:00
              </span>
              <span>Kuwa Mbere - Kuwa Gatandatu</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold">SJRP</h1>
            </div>
            
            <div className="hidden md:flex space-x-8">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.sectionId)}
                  className="text-gray-700 hover:text-blue-600 transition-colors cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/farmer/register')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Iyandikishe
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div id="home" className="container mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex-1">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Murakaza neza kuri <span className="text-blue-600">SJRP</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
    Gukurikirana amata ava ku makusanyirizo
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => navigate('/farmer/register')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
              >
                Iyandikishe
              </button>
              <button
                onClick={() => navigate('/signin')}
                className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-all"
              >
                Injira
              </button>
            </div>
          </div>
          <div className="flex-1">
            <img 
              src="https://dairybusinessafrica.com/wp-content/uploads/2024/01/9cc5eda8-83fd-499e-b41e-0dcaa4bb5e75.jpg"
              alt="Ubuhinzi bw'Inka mu Rwanda"
              className="w-full max-w-lg mx-auto rounded-lg shadow-xl"
            />
          </div>
        </div>

        {/* New Announcement Banner */}
        <div className="bg-blue-600 text-white py-2 pt-5 mt-[50px] pb-5 rounded-lg">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm">
              🎉 Twashyizeho uburyo bushya bwo Kubona amamenyesha! 
              <button 
                
                className="underline ml-2 hover:text-blue-200"
              >
                <b>Ubu biroroshye</b>
              </button>
            </p>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-center mb-4">Uko Bikorwa</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Uburyo bworoshye bwo gutanga no gukurikirana amata yawe
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <motion.div
                key={feature.id}
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-xl shadow-lg"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-24" id="benefits">
          <h2 className="text-3xl font-bold text-center mb-4">Ibyiza by'urubuga rwacu</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Menya ibyiza by'urubuga rwacu mu gufasha abahinzi
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit) => (
              <motion.div
                key={benefit.id}
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-xl shadow-lg text-center"
              >
                <div className="mb-4 flex justify-center">{benefit.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-24 bg-white rounded-xl shadow-lg p-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {stats.totalFarmers}+
              </div>
              <div className="text-gray-600">Abahinzi banditse</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {stats.totalMilkLiters.toLocaleString()}L
              </div>
              <div className="text-gray-600">Amata yose yakiriwe</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {stats.activePOCs}
              </div>
              <div className="text-gray-600">POCs zikora</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {stats.activeDiaries}
              </div>
              <div className="text-gray-600">Diaries zikora</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {stats.qualityRate}%
              </div>
              <div className="text-gray-600">Ubuziranenge</div>
            </div>
          </div>
        </div>

        {/* New How It Works Section with Timeline */}
        <div id="howItWorks" className="mt-32 bg-gray-50 py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-4">Uko Watangira</h2>
            <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
              Intambwe zoroshye zo gutangira gukoresha SJRP
            </p>
            
            <div className="space-y-16">
              {howItWorks.map((step, index) => (
            <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className={`flex flex-col ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  } items-center gap-12`}
                >
                  <div className="flex-1">
                    <div className="relative">
                      <img 
                        src={step.image}
                        alt={step.title}
                        className="rounded-2xl shadow-xl w-full h-96 object-cover"
                      />
                      <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-full shadow-lg">
                        {step.icon}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold">
                        {step.id}
                      </div>
                      <h3 className="text-2xl font-bold">{step.title}</h3>
                    </div>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* New Security Features Section */}
        <div className="mt-32 bg-gray-50 py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-4">Umutekano Wawe Niwo W'ibanze</h2>
            <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
              Dukoresha ikoranabuhanga ry'umutekano wo mu rwego rwo hejuru
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-lg text-center">
                <FiShield className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Umutekano Ukomeye</h3>
                <p className="text-gray-600">Amakuru yawe arinzwe neza kandi ntawe ushobora kuyageraho</p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-lg text-center">
                <FiSmartphone className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Gukoresha Telephone</h3>
                <p className="text-gray-600">Ushobora gukoresha telephone yawe gutanga no gukurikirana amata</p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-lg text-center">
                <FiClock className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Igihe Cyose</h3>
                <p className="text-gray-600">Urubuga rukorera kuri system 24/7 kandi rufite backup</p>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="mt-32 container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Abakoresha SJRP Bavuga Iki?</h2>
          <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
            Reba ibyo abandi bavuga ku buryo bwacu
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <motion.div
                key={testimonial.id}
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-xl shadow-lg"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h3 className="font-semibold">{testimonial.name}</h3>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">"{testimonial.quote}"</p>
                <div className="flex text-yellow-400">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FiStar key={i} className="fill-current" />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div id="faq" className="mt-32 container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Ibibazo Bikunze Kubazwa</h2>
          <div className="max-w-3xl mx-auto">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <button
                    className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-50"
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  >
                    <h3 className="font-semibold">{faq.q}</h3>
                    {openIndex === index ? 
                      <FiChevronUp className="w-5 h-5 text-blue-600" /> : 
                      <FiChevronDown className="w-5 h-5 text-blue-600" />
                    }
                  </button>
                  {openIndex === index && (
                    <div className="p-6 pt-0 text-gray-600 border-t">
                      {faq.a}
                  </div>
                )}
              </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 text-center">
          <h2 className="text-3xl font-bold mb-6">Witegure Gutangira?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Iyandikishe kuri SJRP none maze utangire gukoresha uburyo bworoshye bwo gutanga no gukurikirana amata yawe.
          </p>
          <button
            onClick={() => navigate('/farmer/register')}
            className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
          >
            Iyandikishe nk'Umuhinzi
          </button>
        </div>

        {/* New Contact Section */}
        <div id="contact" className="mt-32 bg-gray-50 py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-4">Ufite Ikibazo?</h2>
            <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
              Twandikire cyangwa uduhamagare, tuzagufasha
            </p>
            <div className="flex flex-col md:flex-row gap-8 max-w-4xl mx-auto">
              <div className="flex-1 bg-white p-8 rounded-xl shadow-lg">
                <FiMessageCircle className="w-12 h-12 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Twandikire</h3>
                <p className="text-gray-600 mb-4">Subiza itarenze amasaha 24</p>
                <a href="mailto:support@SJRP.rw" className="text-blue-600 hover:underline">
                  support@SJRP.rw
                </a>
              </div>
              <div className="flex-1 bg-white p-8 rounded-xl shadow-lg">
                <FiPhoneCall className="w-12 h-12 text-green-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Duhamagare</h3>
                <p className="text-gray-600 mb-4">Kuva 7:00 - 18:00</p>
                <a href="tel:+250792575100" className="text-blue-600 hover:underline">
                  +250 792 575 100
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Add News Updates Section */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-center mb-4">Amakuru Mashya</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {newsUpdates.map((news) => (
              <motion.div
                key={news.id}
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-xl shadow-lg"
              >
                <h3 className="text-xl font-semibold mb-2">{news.title}</h3>
                <p className="text-gray-600 mb-4">{news.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {new Date(news.date).toLocaleDateString('rw-RW')}
                  </span>
                  <button
                    onClick={() => navigate(news.link)}
                    className="text-blue-600 hover:underline"
                  >
                    Soma byinshi →
                  </button>
                </div>
            </motion.div>
          ))}
          </div>
        </div>

        {/* Add Impact Section */}
        <div className="mt-24 bg-blue-50 rounded-xl p-8">
          <h2 className="text-3xl font-bold text-center mb-8">Akamaro ka SJRP mu Rwanda</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <img 
                src="https://dairybusinessafrica.com/wp-content/uploads/2024/01/9cc5eda8-83fd-499e-b41e-0dcaa4bb5e75.jpg"
                alt="Ubuhinzi mu Rwanda"
                className="rounded-lg shadow-xl mb-4 object-cover h-64 w-full"
              />
              <h3 className="text-xl font-semibold mb-2">Guteza Imbere Ubuhinzi</h3>
              <p className="text-gray-600">
                SJRP ifasha abahinzi gukurikirana neza umusaruro wabo no kuwugeza ku isoko mu buryo bworoshye.
              </p>
            </div>
            <div>
              <img 
                src="https://dairybusinessafrica.com/wp-content/uploads/2024/01/9cc5eda8-83fd-499e-b41e-0dcaa4bb5e75.jpg"
                alt="Iterambere mu Rwanda"
                className="rounded-lg shadow-xl mb-4 object-cover h-64 w-full"
              />
              <h3 className="text-xl font-semibold mb-2">Iterambere ry'Ubukungu</h3>
              <p className="text-gray-600">
                Dutera inkunga iterambere ry'ubukungu bw'u Rwanda binyuze mu guteza imbere ubuhinzi bw'inka.
              </p>
            </div>
          </div>
        </div>

        {/* Add new Success Stories Section */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-center mb-8">Abahinzi Bacu Bateye Imbere</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative group">
              <img 
                src="https://dairybusinessafrica.com/wp-content/uploads/2024/01/9cc5eda8-83fd-499e-b41e-0dcaa4bb5e75.jpg"
                alt="Umuhinzi wa mbere"
                className="rounded-lg shadow-xl w-full h-72 object-cover"
              />
            </div>
            <div className="relative group">
              <img 
                src="https://dairybusinessafrica.com/wp-content/uploads/2024/01/9cc5eda8-83fd-499e-b41e-0dcaa4bb5e75.jpg"
                alt="Umuhinzi wa kabiri"
                className="rounded-lg shadow-xl w-full h-72 object-cover"
              />
            </div>
            <div className="relative group">
              <img 
                src="https://dairybusinessafrica.com/wp-content/uploads/2024/01/9cc5eda8-83fd-499e-b41e-0dcaa4bb5e75.jpg"
                alt="Umuhinzi wa gatatu"
                className="rounded-lg shadow-xl w-full h-72 object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white py-8 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-semibold mb-4">Aho duherereye</h3>
              <p className="text-gray-600">Gasabo, Nduba, BUTARE</p>
              <p className="text-gray-600">Tel: +250 792 575 100</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Amasaha y'akazi</h3>
              <p className="text-gray-600">Kuwa mbere - Kuwa gatandatu</p>
              <p className="text-gray-600">7:00 - 18:00</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Twandikire</h3>
              <p className="text-gray-600">Email: info@SJRP.rw</p>
            </div>
          </div>
          <div className="text-center text-gray-600 border-t pt-8">
            <p>{new Date().getFullYear()} SJRP. Uburenganzira bwose .</p>
            <p><b>Contact developer : </b> +250 793639763</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing; 
