import React, { useState } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [status, setStatus] = useState({
    type: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add contact form submission logic here
    console.log('Form submitted:', formData);
    setStatus({
      type: 'success',
      message: 'Message sent successfully! We will get back to you soon.',
    });
  };

  return (
    <>
      <Breadcrumb pageName="Contact Us" />
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Contact Form */}
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Send us a Message
            </h3>
          </div>
          <form className="p-6.5" onSubmit={handleSubmit}>
            <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">
                Name <span className="text-meta-1">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">
                Email <span className="text-meta-1">*</span>
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">
                Subject
              </label>
              <input
                type="text"
                placeholder="Enter subject"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              />
            </div>

            <div className="mb-6">
              <label className="mb-2.5 block text-black dark:text-white">
                Message <span className="text-meta-1">*</span>
              </label>
              <textarea
                rows={6}
                placeholder="Type your message"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
              ></textarea>
            </div>

            {status.message && (
              <div className={`mb-6 ${status.type === 'success' ? 'text-meta-3' : 'text-meta-1'}`}>
                {status.message}
              </div>
            )}

            <button
              type="submit"
              className="flex w-full justify-center rounded bg-primary p-3 font-medium text-white hover:bg-opacity-90"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Contact Information */}
        <div className="flex flex-col gap-8">
          {/* Office Information */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Our Office
              </h3>
            </div>
            <div className="p-6.5">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/5 text-primary">
                    <svg className="fill-current" width="20" height="20" viewBox="0 0 20 20">
                      {/* Add location icon SVG */}
                    </svg>
                  </span>
                  <div>
                    <h4 className="font-medium text-black dark:text-white">Location</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      123 Main Street, Kigali, Rwanda
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/5 text-primary">
                    <svg className="fill-current" width="20" height="20" viewBox="0 0 20 20">
                      {/* Add phone icon SVG */}
                    </svg>
                  </span>
                  <div>
                    <h4 className="font-medium text-black dark:text-white">Phone</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      +250 123 456 789
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/5 text-primary">
                    <svg className="fill-current" width="20" height="20" viewBox="0 0 20 20">
                      {/* Add email icon SVG */}
                    </svg>
                  </span>
                  <div>
                    <h4 className="font-medium text-black dark:text-white">Email</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      info@minubumwe.org
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Find Us on Map
              </h3>
            </div>
            <div className="p-6.5">
              {/* Add map component or iframe here */}
              <div className="aspect-video w-full bg-gray-200 dark:bg-boxdark-2">
                {/* Replace with actual map */}
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  Map Component Here
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact; 