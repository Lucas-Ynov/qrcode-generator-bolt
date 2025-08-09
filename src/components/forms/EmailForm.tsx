import React from 'react';
import { QRCodeData } from '../../types/qr-types';
import { Mail, AtSign } from 'lucide-react';

interface EmailFormProps {
  data: QRCodeData;
  onChange: (data: QRCodeData) => void;
}

export function EmailForm({ data, onChange }: EmailFormProps) {
  const email = data.email || { to: '', subject: '', body: '' };

  const updateEmail = (field: keyof typeof email, value: string) => {
    const newEmail = { ...email, [field]: value };
    const content = `mailto:${newEmail.to}${newEmail.subject || newEmail.body ? '?' : ''}${
      newEmail.subject ? `subject=${encodeURIComponent(newEmail.subject)}` : ''
    }${newEmail.subject && newEmail.body ? '&' : ''}${
      newEmail.body ? `body=${encodeURIComponent(newEmail.body)}` : ''
    }`;

    onChange({
      ...data,
      type: 'email',
      content,
      email: newEmail
    });
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Mail className="w-4 h-4 inline mr-2" />
          Adresse email destinataire *
        </label>
        <div className="relative">
          <input
            type="email"
            value={email.to}
            onChange={(e) => updateEmail('to', e.target.value)}
            placeholder="contact@example.com"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
              email.to && !isValidEmail(email.to)
                ? 'border-red-300 focus:ring-red-200'
                : 'border-gray-300 focus:ring-blue-200'
            }`}
          />
          {email.to && isValidEmail(email.to) && (
            <AtSign className="absolute right-3 top-3.5 w-4 h-4 text-green-500" />
          )}
        </div>
        {email.to && !isValidEmail(email.to) && (
          <p className="text-red-500 text-xs mt-1">Veuillez entrer une adresse email valide</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sujet (optionnel)
        </label>
        <input
          type="text"
          value={email.subject || ''}
          onChange={(e) => updateEmail('subject', e.target.value)}
          placeholder="Sujet de votre email"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Corps du message (optionnel)
        </label>
        <textarea
          value={email.body || ''}
          onChange={(e) => updateEmail('body', e.target.value)}
          placeholder="Écrivez votre message ici..."
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-transparent resize-none"
        />
      </div>

      {email.to && isValidEmail(email.to) && (
        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
          <p className="text-green-700 text-sm">
            ✓ Email configuré: {email.to}
            {email.subject && ` - Sujet: ${email.subject}`}
          </p>
        </div>
      )}

      <div className="p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-800 mb-2">📧 Comment ça marche ?</h4>
        <p className="text-sm text-blue-700">
          En scannant ce QR code, l'application email par défaut s'ouvrira automatiquement avec les informations pré-remplies.
        </p>
      </div>
    </div>
  );
}