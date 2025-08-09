import React from 'react';
import { QRCodeData } from '../../types/qr-types';
import { ExternalLink, Globe } from 'lucide-react';

interface URLFormProps {
  data: QRCodeData;
  onChange: (data: QRCodeData) => void;
}

const commonUrls = [
  { label: 'Site web', prefix: 'https://' },
  { label: 'YouTube', prefix: 'https://youtube.com/watch?v=' },
  { label: 'LinkedIn', prefix: 'https://linkedin.com/in/' },
  { label: 'Instagram', prefix: 'https://instagram.com/' },
  { label: 'Facebook', prefix: 'https://facebook.com/' }
];

export function URLForm({ data, onChange }: URLFormProps) {
  const handleUrlChange = (value: string) => {
    onChange({
      ...data,
      type: 'url',
      content: value
    });
  };

  const addPrefix = (prefix: string) => {
    if (!data.content.startsWith('http')) {
      handleUrlChange(prefix + data.content);
    }
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
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Globe className="w-4 h-4 inline mr-2" />
          URL du site web
        </label>
        <div className="relative">
          <input
            type="url"
            value={data.content}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder="https://example.com"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
              data.content && !isValidUrl(data.content)
                ? 'border-red-300 focus:ring-red-200'
                : 'border-gray-300 focus:ring-blue-200'
            }`}
          />
          {data.content && isValidUrl(data.content) && (
            <ExternalLink className="absolute right-3 top-3.5 w-4 h-4 text-green-500" />
          )}
        </div>
        {data.content && !isValidUrl(data.content) && (
          <p className="text-red-500 text-xs mt-1">Veuillez entrer une URL valide</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Raccourcis rapides
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {commonUrls.map((item, index) => (
            <button
              key={index}
              onClick={() => addPrefix(item.prefix)}
              className="p-2 text-xs bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {data.content && isValidUrl(data.content) && (
        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
          <p className="text-green-700 text-sm">
            ✓ URL valide prête à être convertie en QR code
          </p>
        </div>
      )}
    </div>
  );
}