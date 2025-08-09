import React from 'react';
import { QRTemplate } from '../types/qr-types';
import { Sparkles, ExternalLink, Wifi, User, Calendar, MapPin, MessageSquare, Phone } from 'lucide-react';

interface TemplatesPanelProps {
  onSelectTemplate: (template: QRTemplate) => void;
}

const templates: QRTemplate[] = [
  {
    id: 'business-card',
    name: 'Carte de visite',
    description: 'Contact professionnel complet',
    category: 'Business',
    preview: '👤',
    data: {
      type: 'vcard',
      vcard: {
        firstName: 'Jean',
        lastName: 'Dupont',
        organization: 'Mon Entreprise',
        phone: '+33 1 23 45 67 89',
        email: 'jean.dupont@example.com',
        website: 'https://monsite.com'
      }
    },
    settings: {
      size: 300,
      dotsType: 'classy',
      cornersSquareType: 'extra-rounded',
      fgColor: '#1E40AF',
      bgColor: '#EFF6FF'
    }
  },
  {
    id: 'wifi-guest',
    name: 'WiFi Invités',
    description: 'Accès WiFi pour visiteurs',
    category: 'Network',
    preview: '📶',
    data: {
      type: 'wifi',
      wifi: {
        ssid: 'WiFi-Invites',
        password: 'motdepasse123',
        security: 'WPA'
      }
    },
    settings: {
      size: 256,
      dotsType: 'rounded',
      cornersSquareType: 'dot',
      fgColor: '#059669',
      bgColor: '#ECFDF5'
    }
  },
  {
    id: 'restaurant-menu',
    name: 'Menu Restaurant',
    description: 'Lien vers menu numérique',
    category: 'Business',
    preview: '🍽️',
    data: {
      type: 'url',
      content: 'https://restaurant-menu.example.com'
    },
    settings: {
      size: 280,
      dotsType: 'classy-rounded',
      cornersSquareType: 'extra-rounded',
      fgColor: '#DC2626',
      bgColor: '#FEF2F2',
      frame: {
        style: 'banner',
        color: '#DC2626',
        text: 'Menu',
        textColor: '#FFFFFF'
      }
    }
  },
  {
    id: 'event-ticket',
    name: 'Billet d\'événement',
    description: 'Informations d\'événement',
    category: 'Event',
    preview: '🎫',
    data: {
      type: 'event',
      event: {
        title: 'Conférence Tech 2024',
        description: 'La plus grande conférence tech de l\'année',
        location: 'Centre de congrès, Paris',
        startDate: '2024-06-15T09:00:00',
        endDate: '2024-06-15T18:00:00'
      }
    },
    settings: {
      size: 320,
      dotsType: 'extra-rounded',
      cornersSquareType: 'extra-rounded',
      gradientType: 'linear',
      gradientDirection: 45,
      gradientColorStops: [
        { offset: 0, color: '#8B5CF6' },
        { offset: 1, color: '#EC4899' }
      ]
    }
  },
  {
    id: 'location-shop',
    name: 'Localisation Boutique',
    description: 'Adresse de votre magasin',
    category: 'Business',
    preview: '📍',
    data: {
      type: 'location',
      location: {
        latitude: 48.8566,
        longitude: 2.3522,
        query: 'Ma Boutique, 123 Rue de la Paix, Paris'
      }
    },
    settings: {
      size: 260,
      dotsType: 'dots',
      cornersSquareType: 'dot',
      fgColor: '#EA580C',
      bgColor: '#FFF7ED'
    }
  },
  {
    id: 'social-instagram',
    name: 'Profil Instagram',
    description: 'Lien vers votre Instagram',
    category: 'Social',
    preview: '📸',
    data: {
      type: 'url',
      content: 'https://instagram.com/moncompte'
    },
    settings: {
      size: 240,
      dotsType: 'classy',
      cornersSquareType: 'extra-rounded',
      gradientType: 'radial',
      gradientColorStops: [
        { offset: 0, color: '#F59E0B' },
        { offset: 0.5, color: '#EF4444' },
        { offset: 1, color: '#8B5CF6' }
      ]
    }
  }
];

const categoryIcons = {
  Business: User,
  Network: Wifi,
  Event: Calendar,
  Social: ExternalLink
};

export function TemplatesPanel({ onSelectTemplate }: TemplatesPanelProps) {
  const categories = Array.from(new Set(templates.map(t => t.category)));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center space-x-2 pb-4 border-b border-gray-200">
          <Sparkles className="w-5 h-5 text-yellow-600" />
          <h3 className="text-lg font-semibold text-gray-900">Modèles</h3>
        </div>

        <div className="mt-6 space-y-6">
          {categories.map(category => {
            const Icon = categoryIcons[category as keyof typeof categoryIcons] || ExternalLink;
            const categoryTemplates = templates.filter(t => t.category === category);

            return (
              <div key={category}>
                <div className="flex items-center space-x-2 mb-3">
                  <Icon className="w-4 h-4 text-gray-600" />
                  <h4 className="text-sm font-medium text-gray-700">{category}</h4>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {categoryTemplates.map(template => (
                    <button
                      key={template.id}
                      onClick={() => onSelectTemplate(template)}
                      className="p-4 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors group"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="text-2xl">{template.preview}</div>
                        <div className="flex-1 min-w-0">
                          <h5 className="font-medium text-gray-900 group-hover:text-blue-700 truncate">
                            {template.name}
                          </h5>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {template.description}
                          </p>
                          
                          {/* Preview of settings */}
                          <div className="flex items-center space-x-2 mt-2">
                            <div 
                              className="w-3 h-3 rounded-full border"
                              style={{ backgroundColor: template.settings.fgColor }}
                            />
                            <div 
                              className="w-3 h-3 rounded-full border border-gray-300"
                              style={{ backgroundColor: template.settings.bgColor }}
                            />
                            <span className="text-xs text-gray-500 capitalize">
                              {template.settings.dotsType}
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-2">💡 Conseil</h4>
          <p className="text-sm text-blue-800">
            Utilisez ces modèles comme point de départ, puis personnalisez-les selon vos besoins avec les options de design avancé.
          </p>
        </div>
      </div>
    </div>
  );
}