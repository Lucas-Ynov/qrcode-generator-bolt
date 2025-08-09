import React from 'react';
import { QRCodeData } from '../../types/qr-types';
import { MapPin, Navigation, Search } from 'lucide-react';

interface LocationFormProps {
  data: QRCodeData;
  onChange: (data: QRCodeData) => void;
}

export function LocationForm({ data, onChange }: LocationFormProps) {
  const location = data.location || {
    latitude: 0,
    longitude: 0,
    query: ''
  };

  const updateLocation = (field: keyof typeof location, value: string | number) => {
    const newLocation = { ...location, [field]: value };
    
    let content = '';
    if (newLocation.query) {
      content = `geo:0,0?q=${encodeURIComponent(newLocation.query)}`;
    } else if (newLocation.latitude && newLocation.longitude) {
      content = `geo:${newLocation.latitude},${newLocation.longitude}`;
    }

    onChange({
      ...data,
      type: 'location',
      content,
      location: newLocation
    });
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          updateLocation('latitude', position.coords.latitude);
          updateLocation('longitude', position.coords.longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Impossible d\'obtenir votre position. Vérifiez les permissions de géolocalisation.');
        }
      );
    } else {
      alert('La géolocalisation n\'est pas supportée par votre navigateur.');
    }
  };

  const popularLocations = [
    { name: 'Tour Eiffel, Paris', query: 'Tour Eiffel, Paris, France' },
    { name: 'Louvre, Paris', query: 'Musée du Louvre, Paris, France' },
    { name: 'Notre-Dame, Paris', query: 'Cathédrale Notre-Dame, Paris, France' },
    { name: 'Arc de Triomphe, Paris', query: 'Arc de Triomphe, Paris, France' }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Localisation</h3>
        <button
          onClick={getCurrentLocation}
          className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          <Navigation className="w-4 h-4" />
          <span>Ma position</span>
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Search className="w-4 h-4 inline mr-2" />
          Rechercher un lieu
        </label>
        <input
          type="text"
          value={location.query || ''}
          onChange={(e) => updateLocation('query', e.target.value)}
          placeholder="Restaurant Le Petit Bistro, Paris"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-transparent"
        />
        <p className="text-xs text-gray-500 mt-1">
          Entrez le nom d'un lieu, une adresse ou un point d'intérêt
        </p>
      </div>

      <div className="text-center text-gray-500 text-sm">ou</div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="w-4 h-4 inline mr-2" />
            Latitude
          </label>
          <input
            type="number"
            step="any"
            value={location.latitude || ''}
            onChange={(e) => updateLocation('latitude', parseFloat(e.target.value) || 0)}
            placeholder="48.8566"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Longitude
          </label>
          <input
            type="number"
            step="any"
            value={location.longitude || ''}
            onChange={(e) => updateLocation('longitude', parseFloat(e.target.value) || 0)}
            placeholder="2.3522"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Lieux populaires
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {popularLocations.map((place, index) => (
            <button
              key={index}
              onClick={() => updateLocation('query', place.query)}
              className="p-2 text-xs bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left"
            >
              {place.name}
            </button>
          ))}
        </div>
      </div>

      {(location.query || (location.latitude && location.longitude)) && (
        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
          <p className="text-green-700 text-sm">
            ✓ Localisation configurée: {
              location.query || `${location.latitude}, ${location.longitude}`
            }
          </p>
        </div>
      )}

      <div className="p-4 bg-amber-50 rounded-lg">
        <h4 className="font-medium text-amber-800 mb-2">🗺️ Comment ça marche ?</h4>
        <p className="text-sm text-amber-700">
          En scannant ce QR code, l'application de cartes par défaut s'ouvrira avec la localisation indiquée.
        </p>
      </div>
    </div>
  );
}