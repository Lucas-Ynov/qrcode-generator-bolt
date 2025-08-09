import React from 'react';
import { QRCodeData } from '../../types/qr-types';
import { Wifi, Lock, Eye, EyeOff } from 'lucide-react';

interface WiFiFormProps {
  data: QRCodeData;
  onChange: (data: QRCodeData) => void;
}

export function WiFiForm({ data, onChange }: WiFiFormProps) {
  const wifi = data.wifi || { ssid: '', password: '', security: 'WPA' as const, hidden: false };
  const [showPassword, setShowPassword] = React.useState(false);

  const updateWiFi = (field: keyof typeof wifi, value: string | boolean) => {
    const newWiFi = { ...wifi, [field]: value };
    const content = `WIFI:T:${newWiFi.security};S:${newWiFi.ssid};P:${newWiFi.password};H:${newWiFi.hidden ? 'true' : 'false'};;`;

    onChange({
      ...data,
      type: 'wifi',
      content,
      wifi: newWiFi
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Wifi className="w-4 h-4 inline mr-2" />
          Nom du réseau (SSID) *
        </label>
        <input
          type="text"
          value={wifi.ssid}
          onChange={(e) => updateWiFi('ssid', e.target.value)}
          placeholder="MonReseauWiFi"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Type de sécurité
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(['WPA', 'WEP', 'nopass'] as const).map((security) => (
            <button
              key={security}
              onClick={() => updateWiFi('security', security)}
              className={`p-3 text-sm rounded-lg border transition-colors ${
                wifi.security === security
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              {security === 'nopass' ? 'Aucune' : security}
            </button>
          ))}
        </div>
      </div>

      {wifi.security !== 'nopass' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Lock className="w-4 h-4 inline mr-2" />
            Mot de passe *
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={wifi.password}
              onChange={(e) => updateWiFi('password', e.target.value)}
              placeholder="Mot de passe du réseau"
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center">
        <input
          type="checkbox"
          id="hidden"
          checked={wifi.hidden}
          onChange={(e) => updateWiFi('hidden', e.target.checked)}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="hidden" className="ml-2 text-sm text-gray-700">
          Réseau masqué (SSID caché)
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 bg-purple-50 rounded-lg">
          <h4 className="font-medium text-purple-800 mb-2">🔒 Sécurité</h4>
          <ul className="text-sm text-purple-700 space-y-1">
            <li>• WPA/WPA2 recommandé</li>
            <li>• WEP moins sécurisé</li>
            <li>• Aucune = réseau ouvert</li>
          </ul>
        </div>

        <div className="p-4 bg-amber-50 rounded-lg">
          <h4 className="font-medium text-amber-800 mb-2">⚠️ Attention</h4>
          <ul className="text-sm text-amber-700 space-y-1">
            <li>• Ne partagez qu'avec confiance</li>
            <li>• Mot de passe visible dans le QR</li>
            <li>• Changez le mot de passe si nécessaire</li>
          </ul>
        </div>
      </div>

      {wifi.ssid && (wifi.security === 'nopass' || wifi.password) && (
        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
          <p className="text-green-700 text-sm">
            ✓ WiFi configuré: {wifi.ssid} ({wifi.security === 'nopass' ? 'Réseau ouvert' : `Sécurisé ${wifi.security}`})
          </p>
        </div>
      )}
    </div>
  );
}