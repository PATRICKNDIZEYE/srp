import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NGORegistrationForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  
  // Form fields state
  const [formData, setFormData] = useState({
    // Basic Info
    ngoName: '',
    physicalAddress: '',
    operationalAddress: '',
    
    // Operations
    domainsOfIntervention: [],
    description: '',
    district: '',
    sectors: [],
    cells: [],
    
    // Target Groups
    targetGroups: [],
    beneficiariesCount: 0,
    staffCount: 0,
    trainedStaffCount: 0,
    
    // Resources
    trainingTypes: '',
    resources: '',
    annualBudget: 0,
    fundingSources: '',
    
    // Contact
    legalRepresentatives: '',
    contactPersons: '',
    contactPhone: '',
    contactEmail: '',
    
    // Documents
    documents: null,
    
    // Security
    password: '',
    confirmPassword: '',
    securityQuestion1: '',
    securityAnswer1: '',
    securityQuestion2: '',
    securityAnswer2: '',
  });

  // Add validation state
  const [stepErrors, setStepErrors] = useState<string[]>([]);

  // Add validation helper functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^\+250\s?7[0-9]{8}$/;
    return phoneRegex.test(phone);
  };

  const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    if (password.length < 8) errors.push('Password must be at least 8 characters');
    if (!/[A-Z]/.test(password)) errors.push('Include at least one uppercase letter');
    if (!/[a-z]/.test(password)) errors.push('Include at least one lowercase letter');
    if (!/[0-9]/.test(password)) errors.push('Include at least one number');
    if (!/[!@#$%^&*]/.test(password)) errors.push('Include at least one special character (!@#$%^&*)');
    return { isValid: errors.length === 0, errors };
  };

  // Update the validateStep function
  const validateStep = (step: number): boolean => {
    const errors: string[] = [];
    
    switch(step) {
      case 1: // Basic Info
        if (!formData.ngoName.trim()) {
          errors.push('NGO Name is required');
        } else if (formData.ngoName.length < 3) {
          errors.push('NGO Name must be at least 3 characters');
        }
        
        if (!formData.physicalAddress.trim()) {
          errors.push('Physical Address is required');
        } else if (formData.physicalAddress.length < 10) {
          errors.push('Please provide a detailed physical address');
        }
        break;

      case 2: // Operations
        if (formData.domainsOfIntervention.length === 0) {
          errors.push('Select at least one domain of intervention');
        }
        
        if (!formData.description.trim()) {
          errors.push('Description is required');
        } else if (formData.description.length < 50) {
          errors.push('Description should be at least 50 characters');
        }
        
        if (!formData.district) {
          errors.push('District selection is required');
        }
        break;

      case 3: // Target Groups
        if (formData.targetGroups.length === 0) {
          errors.push('Select at least one target group');
        }
        
        if (formData.beneficiariesCount <= 0) {
          errors.push('Beneficiary count must be greater than 0');
        }
        
        if (formData.staffCount <= 0) {
          errors.push('Staff count must be greater than 0');
        }
        break;

      case 4: // Resources
        if (!formData.trainingTypes.trim()) {
          errors.push('Training types information is required');
        }
        
        if (!formData.resources.trim()) {
          errors.push('Resources information is required');
        }
        
        if (formData.annualBudget < 1000000) { // Example minimum budget
          errors.push('Annual budget must be at least 1,000,000 RWF');
        }
        
        if (!formData.fundingSources.trim()) {
          errors.push('Funding sources information is required');
        }
        break;

      case 5: // Contact
        if (!formData.legalRepresentatives.trim()) {
          errors.push('Legal representatives information is required');
        }
        
        if (!formData.contactPersons.trim()) {
          errors.push('Contact persons information is required');
        }
        
        if (!formData.contactPhone.trim()) {
          errors.push('Contact phone is required');
        } else if (!validatePhone(formData.contactPhone)) {
          errors.push('Enter a valid Rwanda phone number (+250 XXXXXXXXX)');
        }
        
        if (!formData.contactEmail.trim()) {
          errors.push('Contact email is required');
        } else if (!validateEmail(formData.contactEmail)) {
          errors.push('Enter a valid email address');
        }
        break;

      case 6: // Documents
        if (!formData.documents || formData.documents.length === 0) {
          errors.push('Supporting documents are required');
        } else {
          // Check file types and sizes
          Array.from(formData.documents).forEach(file => {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
              errors.push(`File ${file.name} exceeds 5MB limit`);
            }
            const validTypes = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'];
            if (!validTypes.some(type => file.name.toLowerCase().endsWith(type))) {
              errors.push(`File ${file.name} is not a supported format`);
            }
          });
        }
        break;

      case 7: // Security
        if (!formData.password) {
          errors.push('Password is required');
        } else {
          const passwordValidation = validatePassword(formData.password);
          if (!passwordValidation.isValid) {
            errors.push(...passwordValidation.errors);
          }
        }
        
        if (formData.password !== formData.confirmPassword) {
          errors.push('Passwords do not match');
        }
        
        if (!formData.securityQuestion1 || !formData.securityAnswer1) {
          errors.push('First security question and answer are required');
        }
        
        if (!formData.securityQuestion2 || !formData.securityAnswer2) {
          errors.push('Second security question and answer are required');
        }
        
        if (formData.securityQuestion1 === formData.securityQuestion2) {
          errors.push('Please select different security questions');
        }
        
        if (formData.securityAnswer1.toLowerCase() === formData.securityAnswer2.toLowerCase()) {
          errors.push('Security answers must be different');
        }
        break;
    }
    
    setStepErrors(errors);
    return errors.length === 0;
  };

  // Add real-time validation feedback
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });
    validateStep(currentStep);
  };

  // Add this after the form state
  const [validationMessage, setValidationMessage] = useState<string>('');

  // Update the handleNext function
  const handleNext = () => {
    if (validateStep(currentStep)) {
      setValidationMessage(''); // Clear any error messages
      setCurrentStep(prev => prev + 1);
    } else {
      // Show validation message at the top of the form
      setValidationMessage('Please fill in all required fields correctly before proceeding.');
    }
  };

  // Add field-level error messages
  const getFieldError = (fieldName: string): string => {
    switch(fieldName) {
      case 'ngoName':
        if (touched.ngoName && !formData.ngoName) {
          return 'NGO Name is required';
        } else if (touched.ngoName && formData.ngoName.length < 3) {
          return 'NGO Name must be at least 3 characters';
        }
        break;
      case 'contactEmail':
        if (touched.contactEmail && !formData.contactEmail) {
          return 'Email is required';
        } else if (touched.contactEmail && !validateEmail(formData.contactEmail)) {
          return 'Please enter a valid email address';
        }
        break;
      // Add more cases for other fields
    }
    return '';
  };

  // Add a step completion indicator
  const getStepStatus = (step: number) => {
    if (currentStep > step) {
      return 'complete';
    } else if (currentStep === step) {
      return 'current';
    }
    return 'pending';
  };

  const renderFormStep = () => {
    switch(currentStep) {
      case 1: // Basic Info
        return (
          <div className="space-y-4">
            <div>
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                NGO Name *
              </label>
              <input
                type="text"
                required
                value={formData.ngoName}
                onChange={(e) => setFormData({...formData, ngoName: e.target.value})}
                onBlur={() => handleBlur('ngoName')}
                className={`w-full rounded-lg border ${
                  touched.ngoName && getFieldError('ngoName')
                    ? 'border-red-500 dark:border-red-400'
                    : 'border-stroke dark:border-form-strokedark'
                } bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:bg-form-input dark:focus:border-primary`}
                placeholder="Full legal name of the NGO"
              />
              {touched.ngoName && getFieldError('ngoName') && (
                <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                  {getFieldError('ngoName')}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Physical Address *
              </label>
              <textarea
                required
                value={formData.physicalAddress}
                onChange={(e) => setFormData({...formData, physicalAddress: e.target.value})}
                onBlur={() => handleBlur('physicalAddress')}
                className={`w-full rounded-lg border ${
                  touched.physicalAddress && !formData.physicalAddress
                    ? 'border-red-500 dark:border-red-400'
                    : 'border-stroke dark:border-form-strokedark'
                } bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:bg-form-input dark:focus:border-primary`}
                placeholder="Physical headquarters address (street, building)"
                rows={3}
              />
            </div>

            <div>
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Operational Address
              </label>
              <textarea
                value={formData.operationalAddress}
                onChange={(e) => setFormData({...formData, operationalAddress: e.target.value})}
                onBlur={() => handleBlur('operationalAddress')}
                className={`w-full rounded-lg border ${
                  touched.operationalAddress && !formData.operationalAddress
                    ? 'border-red-500 dark:border-red-400'
                    : 'border-stroke dark:border-form-strokedark'
                } bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:bg-form-input dark:focus:border-primary`}
                placeholder="Field/operational address (if different from physical address)"
                rows={3}
              />
            </div>
          </div>
        );

      case 2: // Operations
        return (
          <div className="space-y-4">
            <div>
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Domains of Intervention *
              </label>
              <div className="grid grid-cols-1 gap-2">
                {['Social Cohesion', 'Community Healing', 'Social Reintegration'].map((domain) => (
                  <label key={domain} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.domainsOfIntervention.includes(domain)}
                      onChange={(e) => {
                        const updatedDomains = e.target.checked
                          ? [...formData.domainsOfIntervention, domain]
                          : formData.domainsOfIntervention.filter(d => d !== domain);
                        setFormData({...formData, domainsOfIntervention: updatedDomains});
                      }}
                      className="form-checkbox h-5 w-5 text-primary rounded border-gray-300 focus:ring-primary"
                    />
                    <span className="text-gray-700 dark:text-gray-300">{domain}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Description of Interventions *
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                onBlur={() => handleBlur('description')}
                className={`w-full rounded-lg border ${
                  touched.description && !formData.description
                    ? 'border-red-500 dark:border-red-400'
                    : 'border-stroke dark:border-form-strokedark'
                } bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:bg-form-input dark:focus:border-primary`}
                placeholder="Brief summary of NGO activities and available resources"
                rows={4}
              />
            </div>

            <div>
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                District *
              </label>
              <select
                required
                value={formData.district}
                onChange={(e) => setFormData({...formData, district: e.target.value})}
                onBlur={() => handleBlur('district')}
                className={`w-full rounded-lg border ${
                  touched.district && !formData.district
                    ? 'border-red-500 dark:border-red-400'
                    : 'border-stroke dark:border-form-strokedark'
                } bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:bg-form-input dark:focus:border-primary`}
              >
                <option value="">Select District</option>
                <option value="gasabo">Gasabo</option>
                <option value="kicukiro">Kicukiro</option>
                <option value="nyarugenge">Nyarugenge</option>
                {/* Add more districts */}
              </select>
            </div>
          </div>
        );

      case 3: // Target Groups
        return (
          <div className="space-y-4">
            <div>
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Target Groups *
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['Women', 'Youth', 'Children', 'Elderly', 'Disabled', 'Other'].map((group) => (
                  <label key={group} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.targetGroups.includes(group)}
                      onChange={(e) => {
                        const updatedGroups = e.target.checked
                          ? [...formData.targetGroups, group]
                          : formData.targetGroups.filter(g => g !== group);
                        setFormData({...formData, targetGroups: updatedGroups});
                      }}
                      className="form-checkbox h-5 w-5 text-primary rounded border-gray-300 focus:ring-primary"
                    />
                    <span className="text-gray-700 dark:text-gray-300">{group}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Targeted Number of Beneficiaries *
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.beneficiariesCount}
                onChange={(e) => setFormData({...formData, beneficiariesCount: parseInt(e.target.value)})}
                onBlur={() => handleBlur('beneficiariesCount')}
                className={`w-full rounded-lg border ${
                  touched.beneficiariesCount && formData.beneficiariesCount <= 0
                    ? 'border-red-500 dark:border-red-400'
                    : 'border-stroke dark:border-form-strokedark'
                } bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:bg-form-input dark:focus:border-primary`}
              />
            </div>

            <div>
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Number of Staff/Community Facilitators *
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.staffCount}
                onChange={(e) => setFormData({...formData, staffCount: parseInt(e.target.value)})}
                onBlur={() => handleBlur('staffCount')}
                className={`w-full rounded-lg border ${
                  touched.staffCount && formData.staffCount <= 0
                    ? 'border-red-500 dark:border-red-400'
                    : 'border-stroke dark:border-form-strokedark'
                } bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:bg-form-input dark:focus:border-primary`}
              />
            </div>
          </div>
        );

      case 4: // Resources
        return (
          <div className="space-y-4">
            <div>
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Types of Training Provided *
              </label>
              <textarea
                required
                value={formData.trainingTypes}
                onChange={(e) => setFormData({...formData, trainingTypes: e.target.value})}
                onBlur={() => handleBlur('trainingTypes')}
                className={`w-full rounded-lg border ${
                  touched.trainingTypes && !formData.trainingTypes
                    ? 'border-red-500 dark:border-red-400'
                    : 'border-stroke dark:border-form-strokedark'
                } bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:bg-form-input dark:focus:border-primary`}
                placeholder="Description of training types offered to staff/facilitators"
                rows={3}
              />
            </div>

            <div>
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Resources (Manuals, Guides) *
              </label>
              <textarea
                required
                value={formData.resources}
                onChange={(e) => setFormData({...formData, resources: e.target.value})}
                onBlur={() => handleBlur('resources')}
                className={`w-full rounded-lg border ${
                  touched.resources && !formData.resources
                    ? 'border-red-500 dark:border-red-400'
                    : 'border-stroke dark:border-form-strokedark'
                } bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:bg-form-input dark:focus:border-primary`}
                placeholder="List of materials/resources the NGO uses"
                rows={3}
              />
            </div>

            <div>
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Annual Estimated Budget (RWF) *
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.annualBudget}
                onChange={(e) => setFormData({...formData, annualBudget: parseInt(e.target.value)})}
                onBlur={() => handleBlur('annualBudget')}
                className={`w-full rounded-lg border ${
                  touched.annualBudget && formData.annualBudget < 1000000
                    ? 'border-red-500 dark:border-red-400'
                    : 'border-stroke dark:border-form-strokedark'
                } bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:bg-form-input dark:focus:border-primary`}
                placeholder="Enter annual budget"
              />
            </div>

            <div>
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Source of Funding *
              </label>
              <textarea
                required
                value={formData.fundingSources}
                onChange={(e) => setFormData({...formData, fundingSources: e.target.value})}
                onBlur={() => handleBlur('fundingSources')}
                className={`w-full rounded-lg border ${
                  touched.fundingSources && !formData.fundingSources
                    ? 'border-red-500 dark:border-red-400'
                    : 'border-stroke dark:border-form-strokedark'
                } bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:bg-form-input dark:focus:border-primary`}
                placeholder="List funding sources (e.g., donors, grants)"
                rows={2}
              />
            </div>
          </div>
        );

      case 5: // Contact
        return (
          <div className="space-y-4">
            <div>
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Legal Representatives *
              </label>
              <input
                type="text"
                required
                value={formData.legalRepresentatives}
                onChange={(e) => setFormData({...formData, legalRepresentatives: e.target.value})}
                onBlur={() => handleBlur('legalRepresentatives')}
                className={`w-full rounded-lg border ${
                  touched.legalRepresentatives && !formData.legalRepresentatives
                    ? 'border-red-500 dark:border-red-400'
                    : 'border-stroke dark:border-form-strokedark'
                } bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:bg-form-input dark:focus:border-primary`}
                placeholder="Names of legal representatives"
              />
            </div>

            <div>
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Contact Persons *
              </label>
              <input
                type="text"
                required
                value={formData.contactPersons}
                onChange={(e) => setFormData({...formData, contactPersons: e.target.value})}
                onBlur={() => handleBlur('contactPersons')}
                className={`w-full rounded-lg border ${
                  touched.contactPersons && !formData.contactPersons
                    ? 'border-red-500 dark:border-red-400'
                    : 'border-stroke dark:border-form-strokedark'
                } bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:bg-form-input dark:focus:border-primary`}
                placeholder="Names of primary contact persons"
              />
            </div>

            <div>
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Contact Phone *
              </label>
              <input
                type="tel"
                required
                value={formData.contactPhone}
                onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
                onBlur={() => handleBlur('contactPhone')}
                className={`w-full rounded-lg border ${
                  touched.contactPhone && !validatePhone(formData.contactPhone)
                    ? 'border-red-500 dark:border-red-400'
                    : 'border-stroke dark:border-form-strokedark'
                } bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:bg-form-input dark:focus:border-primary`}
                placeholder="+250 XXX XXX XXX"
              />
            </div>

            <div>
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Contact Email *
              </label>
              <input
                type="email"
                required
                value={formData.contactEmail}
                onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                onBlur={() => handleBlur('contactEmail')}
                className={`w-full rounded-lg border ${
                  touched.contactEmail && !validateEmail(formData.contactEmail)
                    ? 'border-red-500 dark:border-red-400'
                    : 'border-stroke dark:border-form-strokedark'
                } bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:bg-form-input dark:focus:border-primary`}
                placeholder="email@example.com"
              />
            </div>
          </div>
        );s

      case 6: // Documents
        return (
          <div className="space-y-4">
            <div>
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Supporting Documents *
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                <input
                  type="file"
                  required
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={(e) => setFormData({...formData, documents: e.target.files})}
                  className="hidden"
                  id="documents"
                />
                <label
                  htmlFor="documents"
                  className="cursor-pointer flex flex-col items-center space-y-2"
                >
                  <span className="text-primary">Click to upload documents</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    (Registration certificates, legal documents - PDF/JPEG)
                  </span>
                </label>
              </div>
            </div>
          </div>
        );

      case 7: // Security
        return (
          <div className="space-y-4">
            <div>
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Password *
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                onBlur={() => handleBlur('password')}
                className={`w-full rounded-lg border ${
                  touched.password && !formData.password
                    ? 'border-red-500 dark:border-red-400'
                    : 'border-stroke dark:border-form-strokedark'
                } bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:bg-form-input dark:focus:border-primary`}
                placeholder="Enter secure password"
              />
            </div>

            <div>
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Confirm Password *
              </label>
              <input
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                onBlur={() => handleBlur('confirmPassword')}
                className={`w-full rounded-lg border ${
                  touched.confirmPassword && formData.password !== formData.confirmPassword
                    ? 'border-red-500 dark:border-red-400'
                    : 'border-stroke dark:border-form-strokedark'
                } bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:bg-form-input dark:focus:border-primary`}
                placeholder="Confirm your password"
              />
            </div>

            <div>
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Security Question 1 *
              </label>
              <select
                required
                value={formData.securityQuestion1}
                onChange={(e) => setFormData({...formData, securityQuestion1: e.target.value})}
                onBlur={() => handleBlur('securityQuestion1')}
                className={`w-full rounded-lg border ${
                  touched.securityQuestion1 && !formData.securityQuestion1
                    ? 'border-red-500 dark:border-red-400'
                    : 'border-stroke dark:border-form-strokedark'
                } bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:bg-form-input dark:focus:border-primary`}
              >
                <option value="">Select a security question</option>
                <option value="birthPlace">What city were you born in?</option>
                <option value="firstPet">What was your first pet's name?</option>
                <option value="motherMaiden">What is your mother's maiden name?</option>
              </select>
              <input
                type="text"
                required
                value={formData.securityAnswer1}
                onChange={(e) => setFormData({...formData, securityAnswer1: e.target.value})}
                onBlur={() => handleBlur('securityAnswer1')}
                className={`mt-2 w-full rounded-lg border ${
                  touched.securityAnswer1 && !formData.securityAnswer1
                    ? 'border-red-500 dark:border-red-400'
                    : 'border-stroke dark:border-form-strokedark'
                } bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:bg-form-input dark:focus:border-primary`}
                placeholder="Your answer"
              />
            </div>

            <div>
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Security Question 2 *
              </label>
              <select
                required
                value={formData.securityQuestion2}
                onChange={(e) => setFormData({...formData, securityQuestion2: e.target.value})}
                onBlur={() => handleBlur('securityQuestion2')}
                className={`w-full rounded-lg border ${
                  touched.securityQuestion2 && !formData.securityQuestion2
                    ? 'border-red-500 dark:border-red-400'
                    : 'border-stroke dark:border-form-strokedark'
                } bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:bg-form-input dark:focus:border-primary`}
              >
                <option value="">Select a security question</option>
                <option value="schoolName">What was your first school's name?</option>
                <option value="favoriteTeacher">Who was your favorite teacher?</option>
                <option value="firstCar">What was your first car?</option>
              </select>
              <input
                type="text"
                required
                value={formData.securityAnswer2}
                onChange={(e) => setFormData({...formData, securityAnswer2: e.target.value})}
                onBlur={() => handleBlur('securityAnswer2')}
                className={`mt-2 w-full rounded-lg border ${
                  touched.securityAnswer2 && !formData.securityAnswer2
                    ? 'border-red-500 dark:border-red-400'
                    : 'border-stroke dark:border-form-strokedark'
                } bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:bg-form-input dark:focus:border-primary`}
                placeholder="Your answer"
              />
            </div>

            {/* Show validation errors */}
            {stepErrors.length > 0 && (
              <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/10 rounded-lg">
                {stepErrors.map((error, index) => (
                  <p key={index} className="text-red-500 dark:text-red-400 text-sm">
                    {error}
                  </p>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Add form submission logic here
    console.log('Form submitted:', formData);
    // Redirect to dashboard after successful registration
    navigate('/signin');
  };

  // Add a summary of missing fields
  const getMissingFields = (): string[] => {
    const missing: string[] = [];
    switch(currentStep) {
      case 1:
        if (!formData.ngoName) missing.push('NGO Name');
        if (!formData.physicalAddress) missing.push('Physical Address');
        break;
      // Add cases for other steps
    }
    return missing;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-boxdark-2">
      {/* Header - Same as Landing */}
      <header className="fixed w-full bg-white/90 backdrop-blur-sm dark:bg-boxdark/90 z-50">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <img src="/minubumwe.svg" alt="Minubumwe" className="w-10 h-10" />
            <div className="text-2xl font-bold text-primary">Minubumwe</div>
          </Link>
        </nav>
      </header>

      {/* Registration Form Section */}
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white dark:bg-boxdark rounded-lg shadow-lg p-8">
              <h1 className="text-3xl font-bold text-black dark:text-white mb-6 text-center">
                NGO Registration
              </h1>
              
              {validationMessage && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-200 dark:border-red-800">
                  <p className="text-red-600 dark:text-red-400 text-sm font-medium">
                    {validationMessage}
                  </p>
                </div>
              )}

              {/* Progress Steps */}
              <div className="mb-8">
                <div className="flex justify-between mb-3">
                  {['Basic Info', 'Operations', 'Target Groups', 'Resources', 'Contact', 'Documents', 'Security'].map((step, index) => (
                    <div
                      key={index}
                      className={`flex flex-col items-center ${
                        getStepStatus(index + 1) === 'complete'
                          ? 'text-primary'
                          : getStepStatus(index + 1) === 'current'
                          ? 'text-primary'
                          : 'text-gray-400'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                        getStepStatus(index + 1) === 'complete'
                          ? 'bg-primary text-white'
                          : getStepStatus(index + 1) === 'current'
                          ? 'bg-primary/20 text-primary'
                          : 'bg-gray-200 text-gray-400'
                      }`}>
                        {getStepStatus(index + 1) === 'complete' ? (
                          // Checkmark icon
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          index + 1
                        )}
                      </div>
                      <span className="text-xs font-medium">{step}</span>
                    </div>
                  ))}
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-300"
                    style={{ width: `${((currentStep - 1) / 7) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Form Steps */}
              <form onSubmit={handleSubmit}>
                {renderFormStep()}
                
                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8">
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={() => setCurrentStep(prev => prev - 1)}
                      className="px-6 py-2 rounded-lg border border-primary text-primary hover:bg-primary hover:text-white transition-colors"
                    >
                      Previous
                    </button>
                  )}
                  {currentStep < 7 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="px-6 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="px-6 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
                    >
                      Submit Registration
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

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

export default NGORegistrationForm; 