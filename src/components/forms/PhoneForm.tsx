import React from 'react';
import { QRCodeData } from '../../types/qr-types';
import { Phone, Smartphone } from 'lucide-react';

interface PhoneFormProps {
  data: QRCodeData;
  onChange: (data: QRCodeData) => void;
}

export function PhoneForm({ data, onChange }: PhoneFormProps) {
  const phone = data.phone || { number: '' };

  const updatePhone = (field: keyof typeof phone, value: string) => {
    const newPhone = { ...phone, [field]: value };
    const content = `tel:${newPhone.number}`;

    onChange({
      ...data,
      type: 'phone',
      content,
      phone: newPhone
    });
  };

  const isValidPhone = (phone: string) => {
    return /^[\+]?[0-9\-\.\s\(\)]{10,}$/.test(phone);
  };

  const formatPhoneDisplay = (phone: string) => {
    // Format français basique
    const cleaned = phone.replace(/[^\d+]/g, '');
    if (cleaned.startsWith('+33')) {
      return cleaned.replace(/(\+33)(\d{1})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5 $6');
    }
    if (cleaned.startsWith('0')) {
      return cleaned.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
    }
    return phone;
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Phone className="w-4 h-4 inline mr-2" />
          Numéro de téléphone *
        </label>
        <div className="relative">
          <input
            type="tel"
            value={phone.number}
            onChange={(e) => updatePhone('number', e.target.value)}
            placeholder="+33 1 23 45 67 89"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
              phone.number && !isValidPhone(phone.number)
                ? 'border-red-300 focus:ring-red-200'
                : 'border-gray-300 focus:ring-blue-200'
            }`}
          />
          {phone.number && isValidPhone(phone.number) && (
            <Smartphone className="absolute right-3 top-3.5 w-4 h-4 text-green-500" />
          )}
        </div>
        {phone.number && !isValidPhone(phone.number) && (
          <p className="text-red-500 text-xs mt-1">Veuillez entrer un numéro de téléphone valide</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-green-50 rounded-lg">
          <h4 className="font-medium text-green-800 mb-2">🇫🇷 France</h4>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• +33 1 23 45 67 89</li>
            <li>• 01 23 45 67 89</li>
            <li>• 0123456789</li>
          </ul>
        </div>

        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2">🌍 International</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• +1 555 123 4567 (US)</li>
            <li>• +44 20 1234 5678 (UK)</li>
            <li>• +49 30 12345678 (DE)</li>
          </ul>
        </div>

        <div className="p-4 bg-purple-50 rounded-lg">
          <h4 className="font-medium text-purple-800 mb-2">📱 Conseils</h4>
          <ul className="text-sm text-purple-700 space-y-1">
            <li>• Utilisez le format international</li>
            <li>• Commencez par +</li>
            <li>• Vérifiez le numéro</li>
          </ul>
        </div>
      </div>

      {phone.number && isValidPhone(phone.number) && (
        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
          <p className="text-green-700 text-sm">
            ✓ Numéro configuré: {formatPhoneDisplay(phone.number)}
          </p>
        </div>
      )}

      <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
        <h4 className="font-medium text-amber-800 mb-2">📞 Comment ça marche ?</h4>
        <p className="text-sm text-amber-700">
          En scannant ce QR code, l'application téléphone s'ouvrira automatiquement avec le numéro pré-composé. 
          L'utilisateur n'aura qu'à appuyer sur "Appeler".
        </p>
      </div>
    </div>
  );
}