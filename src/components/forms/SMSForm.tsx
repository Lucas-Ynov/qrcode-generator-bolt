import React from 'react';
import { QRCodeData } from '../../types/qr-types';
import { MessageSquare, Smartphone } from 'lucide-react';

interface SMSFormProps {
  data: QRCodeData;
  onChange: (data: QRCodeData) => void;
}

export function SMSForm({ data, onChange }: SMSFormProps) {
  const sms = data.sms || { number: '', message: '' };

  const updateSMS = (field: keyof typeof sms, value: string) => {
    const newSMS = { ...sms, [field]: value };
    const content = `sms:${newSMS.number}${newSMS.message ? `?body=${encodeURIComponent(newSMS.message)}` : ''}`;

    onChange({
      ...data,
      type: 'sms',
      content,
      sms: newSMS
    });
  };

  const isValidPhone = (phone: string) => {
    return /^[\+]?[0-9\-\.\s\(\)]{10,}$/.test(phone);
  };

  const formatPhone = (phone: string) => {
    // Supprimer tous les caractères non numériques sauf le +
    return phone.replace(/[^\d+]/g, '');
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Smartphone className="w-4 h-4 inline mr-2" />
          Numéro de téléphone *
        </label>
        <div className="relative">
          <input
            type="tel"
            value={sms.number}
            onChange={(e) => updateSMS('number', e.target.value)}
            placeholder="+33 6 12 34 56 78"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
              sms.number && !isValidPhone(sms.number)
                ? 'border-red-300 focus:ring-red-200'
                : 'border-gray-300 focus:ring-blue-200'
            }`}
          />
          {sms.number && isValidPhone(sms.number) && (
            <MessageSquare className="absolute right-3 top-3.5 w-4 h-4 text-green-500" />
          )}
        </div>
        {sms.number && !isValidPhone(sms.number) && (
          <p className="text-red-500 text-xs mt-1">Veuillez entrer un numéro de téléphone valide</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Message (optionnel)
        </label>
        <textarea
          value={sms.message || ''}
          onChange={(e) => updateSMS('message', e.target.value)}
          placeholder="Écrivez votre message ici..."
          rows={4}
          maxLength={160}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-transparent resize-none"
        />
        <div className="flex justify-between items-center mt-1">
          <p className="text-xs text-gray-500">
            {(sms.message || '').length}/160 caractères
          </p>
          {(sms.message || '').length > 160 && (
            <p className="text-xs text-orange-500">Le message sera tronqué</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 bg-green-50 rounded-lg">
          <h4 className="font-medium text-green-800 mb-2">📱 Formats acceptés</h4>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• +33 6 12 34 56 78</li>
            <li>• 06 12 34 56 78</li>
            <li>• 0612345678</li>
          </ul>
        </div>

        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2">💡 Conseils</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Utilisez le format international</li>
            <li>• Messages courts recommandés</li>
            <li>• Testez avant diffusion</li>
          </ul>
        </div>
      </div>

      {sms.number && isValidPhone(sms.number) && (
        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
          <p className="text-green-700 text-sm">
            ✓ SMS configuré pour: {sms.number}
            {sms.message && ` - "${sms.message.substring(0, 30)}${sms.message.length > 30 ? '...' : ''}"`}
          </p>
        </div>
      )}
    </div>
  );
}