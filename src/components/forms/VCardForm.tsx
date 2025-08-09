import React from 'react';
import { QRCodeData } from '../../types/qr-types';
import { User, Building, Phone, Mail, Globe, MapPin } from 'lucide-react';

interface VCardFormProps {
  data: QRCodeData;
  onChange: (data: QRCodeData) => void;
}

export function VCardForm({ data, onChange }: VCardFormProps) {
  const vcard = data.vcard || {
    firstName: '',
    lastName: '',
    organization: '',
    phone: '',
    email: '',
    website: '',
    address: ''
  };

  const updateVCard = (field: keyof typeof vcard, value: string) => {
    const newVCard = { ...vcard, [field]: value };
    
    // Generate vCard format
    const vCardContent = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${newVCard.firstName} ${newVCard.lastName}`.trim(),
      `N:${newVCard.lastName};${newVCard.firstName};;;`,
      newVCard.organization ? `ORG:${newVCard.organization}` : '',
      newVCard.phone ? `TEL:${newVCard.phone}` : '',
      newVCard.email ? `EMAIL:${newVCard.email}` : '',
      newVCard.website ? `URL:${newVCard.website}` : '',
      newVCard.address ? `ADR:;;${newVCard.address};;;;` : '',
      'END:VCARD'
    ].filter(line => line).join('\n');

    onChange({
      ...data,
      type: 'vcard',
      content: vCardContent,
      vcard: newVCard
    });
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User className="w-4 h-4 inline mr-2" />
            Prénom *
          </label>
          <input
            type="text"
            value={vcard.firstName}
            onChange={(e) => updateVCard('firstName', e.target.value)}
            placeholder="Jean"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nom *
          </label>
          <input
            type="text"
            value={vcard.lastName}
            onChange={(e) => updateVCard('lastName', e.target.value)}
            placeholder="Dupont"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Building className="w-4 h-4 inline mr-2" />
          Organisation
        </label>
        <input
          type="text"
          value={vcard.organization || ''}
          onChange={(e) => updateVCard('organization', e.target.value)}
          placeholder="Mon Entreprise"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Phone className="w-4 h-4 inline mr-2" />
            Téléphone
          </label>
          <input
            type="tel"
            value={vcard.phone || ''}
            onChange={(e) => updateVCard('phone', e.target.value)}
            placeholder="+33 1 23 45 67 89"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Mail className="w-4 h-4 inline mr-2" />
            Email
          </label>
          <input
            type="email"
            value={vcard.email || ''}
            onChange={(e) => updateVCard('email', e.target.value)}
            placeholder="jean.dupont@example.com"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
              vcard.email && !isValidEmail(vcard.email)
                ? 'border-red-300 focus:ring-red-200'
                : 'border-gray-300 focus:ring-blue-200'
            }`}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Globe className="w-4 h-4 inline mr-2" />
          Site web
        </label>
        <input
          type="url"
          value={vcard.website || ''}
          onChange={(e) => updateVCard('website', e.target.value)}
          placeholder="https://monsite.com"
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
            vcard.website && !isValidUrl(vcard.website)
              ? 'border-red-300 focus:ring-red-200'
              : 'border-gray-300 focus:ring-blue-200'
          }`}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <MapPin className="w-4 h-4 inline mr-2" />
          Adresse
        </label>
        <textarea
          value={vcard.address || ''}
          onChange={(e) => updateVCard('address', e.target.value)}
          placeholder="123 Rue de la Paix, 75001 Paris, France"
          rows={2}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-transparent resize-none"
        />
      </div>

      {(vcard.firstName || vcard.lastName) && (
        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
          <p className="text-green-700 text-sm">
            ✓ Contact configuré: {vcard.firstName} {vcard.lastName}
            {vcard.organization && ` - ${vcard.organization}`}
          </p>
        </div>
      )}

      <div className="p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-800 mb-2">📱 Comment ça marche ?</h4>
        <p className="text-sm text-blue-700">
          En scannant ce QR code, les informations de contact seront automatiquement ajoutées au carnet d'adresses du téléphone.
        </p>
      </div>
    </div>
  );
}