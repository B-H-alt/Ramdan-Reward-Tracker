// components/PinModal.js
import { useState } from 'react';
import { verifyPin, hasPinSet, changePin, hashPin, setPinHash } from '../utils/storage';

export default function PinModal({ onSuccess, onCancel, isSetup = false }) {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [step, setStep] = useState(isSetup ? 'set' : 'enter'); // set | confirm | enter
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  const triggerError = (msg) => {
    setError(msg);
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleDigit = (d) => {
    if (step === 'confirm') {
      if (confirmPin.length < 4) setConfirmPin(p => p + d);
    } else {
      if (pin.length < 4) setPin(p => p + d);
    }
    setError('');
  };

  const handleDelete = () => {
    if (step === 'confirm') {
      setConfirmPin(p => p.slice(0, -1));
    } else {
      setPin(p => p.slice(0, -1));
    }
    setError('');
  };

  const handleSubmit = () => {
    if (step === 'set') {
      if (pin.length < 4) return triggerError('PIN must be 4 digits');
      setStep('confirm');
    } else if (step === 'confirm') {
      if (confirmPin !== pin) {
        triggerError("PINs don't match!");
        setConfirmPin('');
        return;
      }
      setPinHash(hashPin(pin));
      onSuccess();
    } else {
      if (!verifyPin(pin)) {
        triggerError('Wrong PIN!');
        setPin('');
        return;
      }
      onSuccess();
    }
  };

  const currentValue = step === 'confirm' ? confirmPin : pin;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
      <div className={`bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl ${shake ? 'animate-wiggle' : ''}`}>
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
            <span className="text-3xl">🔐</span>
          </div>
          <h2 className="font-display text-2xl text-gray-800">
            {step === 'set' ? 'Set Admin PIN' : step === 'confirm' ? 'Confirm PIN' : 'Admin Login'}
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            {step === 'set' ? 'Choose a 4-digit PIN' : step === 'confirm' ? 'Enter PIN again' : 'Enter your PIN to continue'}
          </p>
        </div>

        {/* PIN dots */}
        <div className="flex gap-3 justify-center mb-6">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center transition-all duration-200
              ${i < currentValue.length
                ? 'border-purple-500 bg-purple-500 shadow-lg shadow-purple-200'
                : 'border-gray-200 bg-gray-50'
              }`}>
              {i < currentValue.length && <div className="w-3 h-3 rounded-full bg-white" />}
            </div>
          ))}
        </div>

        {error && (
          <p className="text-center text-red-500 text-sm font-bold mb-4">{error}</p>
        )}

        {/* Numpad */}
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(d => (
            <button
              key={d}
              onClick={() => handleDigit(d.toString())}
              className="h-14 rounded-2xl bg-gray-100 font-display text-2xl text-gray-700 active:scale-90 transition-transform hover:bg-gray-200"
            >
              {d}
            </button>
          ))}
          <button
            onClick={onCancel}
            className="h-14 rounded-2xl bg-red-100 text-red-500 font-bold text-sm active:scale-90 transition-transform"
          >
            Cancel
          </button>
          <button
            onClick={() => handleDigit('0')}
            className="h-14 rounded-2xl bg-gray-100 font-display text-2xl text-gray-700 active:scale-90 transition-transform hover:bg-gray-200"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="h-14 rounded-2xl bg-gray-100 text-gray-500 font-bold text-xl active:scale-90 transition-transform hover:bg-gray-200"
          >
            ⌫
          </button>
        </div>

        <button
          onClick={handleSubmit}
          disabled={currentValue.length < 4}
          className="mt-4 w-full btn-primary bg-gradient-to-r from-purple-600 to-violet-600 text-center disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {step === 'set' ? 'Next →' : step === 'confirm' ? 'Set PIN' : 'Unlock'}
        </button>
      </div>
    </div>
  );
}
