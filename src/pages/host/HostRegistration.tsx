import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, Mail, Lock, Phone, MapPin, Clock, FileCheck } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function HostRegistration() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    restaurantName: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    city: '',
    cuisine: '',
    openingHours: '',
    closingHours: '',
    certType: '',
    certNumber: '',
    certExpiry: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      navigate('/host/dashboard');
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <Input
              label="Restaurant Name"
              name="restaurantName"
              icon={Store}
              required
              value={formData.restaurantName}
              onChange={handleChange}
            />
            <Input
              label="Email Address"
              name="email"
              type="email"
              icon={Mail}
              required
              value={formData.email}
              onChange={handleChange}
            />
            <Input
              label="Password"
              name="password"
              type="password"
              icon={Lock}
              required
              value={formData.password}
              onChange={handleChange}
            />
            <Input
              label="Phone Number"
              name="phone"
              type="tel"
              icon={Phone}
              required
              value={formData.phone}
              onChange={handleChange}
            />
          </>
        );
      case 2:
        return (
          <>
            <Input
              label="Address"
              name="address"
              icon={MapPin}
              required
              value={formData.address}
              onChange={handleChange}
            />
            <Input
              label="City"
              name="city"
              required
              value={formData.city}
              onChange={handleChange}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Opening Time"
                name="openingHours"
                type="time"
                icon={Clock}
                required
                value={formData.openingHours}
                onChange={handleChange}
              />
              <Input
                label="Closing Time"
                name="closingHours"
                type="time"
                icon={Clock}
                required
                value={formData.closingHours}
                onChange={handleChange}
              />
            </div>
          </>
        );
      case 3:
        return (
          <>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Certification Type
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FileCheck className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  name="certType"
                  value={formData.certType}
                  onChange={handleChange}
                  className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                  required
                >
                  <option value="">Select certification</option>
                  <option value="MUIS">MUIS Certified</option>
                  <option value="JAKIM">JAKIM Certified</option>
                  <option value="HMC">HMC Certified</option>
                </select>
              </div>
            </div>
            <Input
              label="Certification Number"
              name="certNumber"
              required
              value={formData.certNumber}
              onChange={handleChange}
            />
            <Input
              label="Certification Expiry"
              name="certExpiry"
              type="date"
              required
              value={formData.certExpiry}
              onChange={handleChange}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
        <div>
          <Store className="mx-auto h-12 w-12 text-emerald-600" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Register Your Restaurant
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Step {step} of 3: {
              step === 1 ? 'Basic Information' :
              step === 2 ? 'Location & Hours' :
              'Certification Details'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {renderStep()}
          
          <div className="flex justify-between">
            {step > 1 && (
              <Button
                type="button"
                variant="secondary"
                onClick={() => setStep(step - 1)}
              >
                Back
              </Button>
            )}
            <Button
              type="submit"
              className={step === 1 ? 'w-full' : 'ml-auto'}
            >
              {step === 3 ? 'Complete Registration' : 'Next'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}