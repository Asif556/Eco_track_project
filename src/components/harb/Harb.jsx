import React, { useState } from 'react';
import Nav from '../../Nav';
import { ref, set } from "firebase/database";
import { database } from '../../firebase';
import { motion, AnimatePresence } from 'framer-motion';

const CheckoutForm = ({ formData, onSuccess, onClose }) => {
  const [paymentError, setPaymentError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvc: ''
  });

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiry = (value) => {
    const v = value.replace(/[^0-9]/g, '');
    if (v.length >= 3) {
      return `${v.slice(0, 2)}/${v.slice(2)}`;
    }
    return value;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);
    setPaymentError(null);

    // Validate card details
    if (!cardDetails.number || cardDetails.number.replace(/\s/g, '').length !== 16) {
      setPaymentError('Please enter a valid 16-digit card number');
      setProcessing(false);
      return;
    }

    if (!cardDetails.name) {
      setPaymentError('Please enter cardholder name');
      setProcessing(false);
      return;
    }

    if (!cardDetails.expiry || cardDetails.expiry.length !== 5) {
      setPaymentError('Please enter a valid expiry date (MM/YY)');
      setProcessing(false);
      return;
    }

    if (!cardDetails.cvc || cardDetails.cvc.length < 3) {
      setPaymentError('Please enter a valid CVC');
      setProcessing(false);
      return;
    }

    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate successful payment
    setPaymentSuccess(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onSuccess();
  };

  if (paymentSuccess) {
    return (
      <motion.div 
        className="fixed inset-0 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-[#082B13]/90 to-[#0a5c2c]/90"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        />

        <motion.div 
          className="relative bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4 z-10 flex flex-col items-center justify-center"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 260,
              damping: 20
            }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6"
          >
            <motion.svg
              className="w-12 h-12 text-green-500"
              viewBox="0 0 24 24"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: 0.5,
                delay: 0.2,
                type: "spring",
                stiffness: 100
              }}
            >
              <path
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </motion.svg>
          </motion.div>

          <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-6">Your payment of Rs.99.00 has been processed</p>

          <div className="w-full bg-gray-100 rounded-lg p-4 mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Card:</span>
              <span className="font-medium">•••• •••• •••• {cardDetails.number.slice(-4)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date:</span>
              <span className="font-medium">{new Date().toLocaleDateString()}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-[#082B13] to-[#0a5c2c] text-white py-3 px-4 rounded-lg hover:opacity-90 transition-all duration-300"
          >
            Done
          </button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="fixed inset-0 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Animated background */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-[#082B13]/90 to-[#0a5c2c]/90"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Floating animated circles */}
        <motion.div 
          className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-white/10"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-1/3 right-1/3 w-40 h-40 rounded-full bg-white/10"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>

      <motion.div 
        className="relative bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4 z-10"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: "spring", damping: 25 }}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Complete Payment</h2>
          <p className="text-gray-600">Rs.99 one-time registration fee</p>
        </div>

        <div className="mb-6 p-4 bg-gradient-to-r from-[#082B13]/10 to-[#0a5c2c]/10 rounded-lg border border-[#082B13]/20">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700">Total Amount:</span>
            <span className="text-2xl font-bold text-[#082B13]">RS. 99.00</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
              <input
                type="text"
                name="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#082B13] focus:border-transparent"
                placeholder="1234 5678 9012 3456"
                value={formatCardNumber(cardDetails.number)}
                onChange={(e) => {
                  const formatted = formatCardNumber(e.target.value);
                  setCardDetails({...cardDetails, number: formatted.replace(/\s/g, '')});
                }}
                maxLength={19}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
              <input
                type="text"
                name="name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#082B13] focus:border-transparent"
                placeholder="John Doe"
                value={cardDetails.name}
                onChange={handleCardChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                <input
                  type="text"
                  name="expiry"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#082B13] focus:border-transparent"
                  placeholder="MM/YY"
                  value={formatExpiry(cardDetails.expiry)}
                  onChange={(e) => {
                    const formatted = formatExpiry(e.target.value);
                    setCardDetails({...cardDetails, expiry: formatted});
                  }}
                  maxLength={5}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                <input
                  type="text"
                  name="cvc"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#082B13] focus:border-transparent"
                  placeholder="123"
                  value={cardDetails.cvc}
                  onChange={handleCardChange}
                  maxLength={4}
                />
              </div>
            </div>
          </div>

          {paymentError && (
            <div className="text-red-500 text-sm text-center py-2 px-3 bg-red-50 rounded-md">
              {paymentError}
            </div>
          )}

          <button
            type="submit"
            disabled={processing}
            className={`w-full bg-gradient-to-r from-[#082B13] to-[#0a5c2c] text-white py-3 px-4 rounded-lg hover:opacity-90 transition-all duration-300 ${
              processing ? 'opacity-80 cursor-not-allowed' : ''
            }`}
          >
            {processing ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              'Pay $99.00'
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Secure payment simulation</p>
          <div className="flex justify-center mt-2 space-x-4">
            <div className="w-10 h-6 bg-gray-200 rounded-sm flex items-center justify-center text-xs font-bold">VISA</div>
            <div className="w-10 h-6 bg-gray-200 rounded-sm flex items-center justify-center text-xs font-bold">MC</div>
            <div className="w-10 h-6 bg-gray-200 rounded-sm flex items-center justify-center text-xs font-bold">AMEX</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Harb = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    brandName: '',
    registrationNumber: '',
    headOfficeAddress: '',
    phoneNumber: '',
    emailAddress: '',
    website: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.companyName) errors.companyName = 'Company name is required';
    if (!formData.registrationNumber) errors.registrationNumber = 'Registration number is required';
    if (!formData.headOfficeAddress) errors.headOfficeAddress = 'Address is required';
    if (!formData.phoneNumber) errors.phoneNumber = 'Phone number is required';
    if (!formData.emailAddress) errors.emailAddress = 'Email is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setShowPayment(true);
    }
  };

  const saveToDatabase = async () => {
    setIsLoading(true);
    try {
      const companyId = generateUniqueId();
      const dbRef = ref(database, `companies/${companyId}`);
      
      await set(dbRef, {
        ...formData,
        timestamp: Date.now(),
        paymentStatus: 'completed',
        amountPaid: 99.00
      });
      
      setFormData({
        companyName: '',
        brandName: '',
        registrationNumber: '',
        headOfficeAddress: '',
        phoneNumber: '',
        emailAddress: '',
        website: ''
      });
    } catch (error) {
      console.error("Error saving data: ", error);
      alert(`Error saving data: ${error.message}`);
    } finally {
      setIsLoading(false);
      setShowPayment(false);
    }
  };

  const generateUniqueId = () => {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  };

  return (
    <div className='bg-[#C0F2CB] h-screen overflow-hidden font-lato'>
      <Nav />
      <div className='flex flex-col h-[calc(96vh-76px)] p-4'>
        <div className="w-full h-full bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-2 text-left">
              Fill Out Your Company Details
            </h2>
            <p className="text-gray-600 opacity-72 text-left">
              Provide your company's essential details to streamline verification and connect with potential partners in the industry
            </p>
          </div>

          <div className="px-6 overflow-y-auto flex-grow scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <form onSubmit={handleSubmit} className="space-y-4 pb-2">
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-left">
                  Company Name: *
                </label>
                <div className="border-b border-gray-300 opacity-50">
                  <input 
                    type="text"
                    name="companyName"
                    className="w-full bg-transparent focus:outline-none"
                    placeholder="Medical_com"
                    onChange={handleChange}
                    value={formData.companyName}
                  />
                </div>
                {formErrors.companyName && <p className="text-red-500 text-sm mt-1">{formErrors.companyName}</p>}
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-left"> 
                  Brand Name (if different):
                </label>
                <div className="border-b border-gray-300 opacity-50">
                  <input 
                    type="text"
                    name="brandName"
                    className="w-full bg-transparent focus:outline-none"
                    placeholder="medical"
                    onChange={handleChange}
                    value={formData.brandName}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-left">
                  Registration Number: *
                </label>
                <div className="border-b border-gray-300 opacity-50">
                  <input 
                    type="text"
                    name="registrationNumber"
                    className="w-full bg-transparent focus:outline-none"
                    placeholder="1234 5647 6486"
                    onChange={handleChange}
                    value={formData.registrationNumber}
                  />
                </div>
                {formErrors.registrationNumber && <p className="text-red-500 text-sm mt-1">{formErrors.registrationNumber}</p>}
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-left">
                  Head Office Address: *
                </label>
                <div className="border-b border-gray-300 opacity-50">
                  <input 
                    type="text"
                    name="headOfficeAddress"
                    className="w-full bg-transparent focus:outline-none"
                    placeholder="16/B XYZ,City-PINCode"
                    onChange={handleChange}
                    value={formData.headOfficeAddress}
                  />
                </div>
                {formErrors.headOfficeAddress && <p className="text-red-500 text-sm mt-1">{formErrors.headOfficeAddress}</p>}
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-left">
                  Phone Number: *
                </label>
                <div className="border-b border-gray-300 opacity-50">
                  <input 
                    type="tel"
                    name="phoneNumber"
                    className="w-full bg-transparent focus:outline-none"
                    placeholder="1234567891"
                    onChange={handleChange}
                    value={formData.phoneNumber}
                  />
                </div>
                {formErrors.phoneNumber && <p className="text-red-500 text-sm mt-1">{formErrors.phoneNumber}</p>}
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-left">
                  Email Address: *
                </label>
                <div className="border-b border-gray-300 opacity-50">
                  <input 
                    type="email"
                    name="emailAddress"
                    className="w-full bg-transparent focus:outline-none"
                    placeholder="email@gmail.com"
                    onChange={handleChange}
                    value={formData.emailAddress}
                  />
                </div>
                {formErrors.emailAddress && <p className="text-red-500 text-sm mt-1">{formErrors.emailAddress}</p>}
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-left">
                  Website (if any):
                </label>
                <div className="border-b border-gray-300">
                  <input 
                    type="url"
                    name="website"
                    className="w-full bg-transparent focus:outline-none"
                    placeholder="medical.com"
                    onChange={handleChange}
                    value={formData.website}
                  />
                </div>
              </div>

              <div className="p-6 pt-0">
                <button 
                  type="submit"
                  disabled={isLoading}
                  className={`w-[24%] bg-[#082B13] text-white py-3 px-4 rounded-md hover:bg-green-700 transition duration-200 mt-6 mx-auto block ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? 'Processing...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showPayment && (
          <CheckoutForm 
            formData={formData} 
            onSuccess={saveToDatabase}
            onClose={() => setShowPayment(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Harb;