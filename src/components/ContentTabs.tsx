import React from 'react';
import { Link, Mail, MessageSquare, Wifi, Phone, FileText, User, Calendar, MapPin } from 'lucide-react';
import { QRCodeData } from '../types/qr-types';
import { URLForm } from './forms/URLForm';
import { TextForm } from './forms/TextForm';
import { EmailForm } from './forms/EmailForm';
import { SMSForm } from './forms/SMSForm';
import { WiFiForm } from './forms/WiFiForm';
import { PhoneForm } from './forms/PhoneForm';
import { VCardForm } from './forms/VCardForm';
import { EventForm } from './forms/EventForm';
import { LocationForm } from './forms/LocationForm';

interface ContentTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  qrData: QRCodeData;
  onDataChange: (data: QRCodeData) => void;
}

const tabs = [
  { id: 'url', label: 'URL', icon: Link, description: 'Site web ou lien' },
  { id: 'text', label: 'Texte', icon: FileText, description: 'Texte libre' },
  { id: 'email', label: 'Email', icon: Mail, description: 'Adresse email' },
  { id: 'sms', label: 'SMS', icon: MessageSquare, description: 'Message texte' },
  { id: 'wifi', label: 'WiFi', icon: Wifi, description: 'Réseau WiFi' },
  { id: 'phone', label: 'Téléphone', icon: Phone, description: 'Numéro de téléphone' },
  { id: 'vcard', label: 'Contact', icon: User, description: 'Carte de visite' },
  { id: 'event', label: 'Événement', icon: Calendar, description: 'Événement calendrier' },
  { id: 'location', label: 'Localisation', icon: MapPin, description: 'Position GPS' }
];

export function ContentTabs({ activeTab, onTabChange, qrData, onDataChange }: ContentTabsProps) {
  const renderForm = () => {
    switch (activeTab) {
      case 'url':
        return <URLForm data={qrData} onChange={onDataChange} />;
      case 'text':
        return <TextForm data={qrData} onChange={onDataChange} />;
      case 'email':
        return <EmailForm data={qrData} onChange={onDataChange} />;
      case 'sms':
        return <SMSForm data={qrData} onChange={onDataChange} />;
      case 'wifi':
        return <WiFiForm data={qrData} onChange={onDataChange} />;
      case 'phone':
        return <PhoneForm data={qrData} onChange={onDataChange} />;
      case 'vcard':
        return <VCardForm data={qrData} onChange={onDataChange} />;
      case 'event':
        return <EventForm data={qrData} onChange={onDataChange} />;
      case 'location':
        return <LocationForm data={qrData} onChange={onDataChange} />;
      default:
        return <URLForm data={qrData} onChange={onDataChange} />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex overflow-x-auto scrollbar-hide pb-px">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center space-x-2 px-3 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <div className="text-left min-w-0">
                  <div>{tab.label}</div>
                  <div className="text-xs text-gray-400 truncate">{tab.description}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Form Content */}
      <div className="p-6">
        {renderForm()}
      </div>
    </div>
  );
}