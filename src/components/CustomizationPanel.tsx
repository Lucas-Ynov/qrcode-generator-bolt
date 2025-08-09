import React from 'react';
import { QRCodeSettings } from '../types/qr-types';
import { Palette, Maximize, Shield, Zap } from 'lucide-react';

interface CustomizationPanelProps {
  settings: QRCodeSettings;
  onSettingsChange: (settings: QRCodeSettings) => void;
}

const sizePresets = [
  { label: 'Petit', value: 128 },
  { label: 'Moyen', value: 256 },
  { label: 'Grand', value: 384 },
  { label: 'Très grand', value: 512 }
];

const colorPresets = [
  { name: 'Classique', fg: '#000000', bg: '#FFFFFF' },
  { name: 'Bleu', fg: '#1E40AF', bg: '#EFF6FF' },
  { name: 'Vert', fg: '#059669', bg: '#ECFDF5' },
  { name: 'Rouge', fg: '#DC2626', bg: '#FEF2F2' },
  { name: 'Violet', fg: '#7C3AED', bg: '#F3E8FF' },
  { name: 'Orange', fg: '#EA580C', bg: '#FFF7ED' },
  { name: 'Rose', fg: '#E11D48', bg: '#FDF2F8' },
  { name: 'Sombre', fg: '#FFFFFF', bg: '#111827' }
];

const errorLevels = [
  { value: 'L', label: 'Faible (7%)', description: 'Plus de données, moins de résistance' },
  { value: 'M', label: 'Moyen (15%)', description: 'Équilibre recommandé' },
  { value: 'Q', label: 'Élevé (25%)', description: 'Bonne résistance aux dommages' },
  { value: 'H', label: 'Maximum (30%)', description: 'Résistance maximale' }
];

export function CustomizationPanel({ settings, onSettingsChange }: CustomizationPanelProps) {
  const updateSettings = (updates: Partial<QRCodeSettings>) => {
    onSettingsChange({ ...settings, ...updates });
  };

  const applyColorPreset = (preset: typeof colorPresets[0]) => {
    updateSettings({ fgColor: preset.fg, bgColor: preset.bg });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 space-y-6">
        <div className="flex items-center space-x-2 pb-4 border-b border-gray-200">
          <Palette className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">Personnalisation</h3>
        </div>

        {/* Taille */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <Maximize className="w-4 h-4 inline mr-2" />
            Taille du QR code
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
            {sizePresets.map((preset) => (
              <button
                key={preset.value}
                onClick={() => updateSettings({ size: preset.value })}
                className={`p-3 text-sm rounded-lg border transition-colors ${
                  settings.size === preset.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {preset.label}
                <div className="text-xs text-gray-500 mt-1">{preset.value}px</div>
              </button>
            ))}
          </div>
          <div>
            <input
              type="range"
              min="128"
              max="1024"
              step="32"
              value={settings.size}
              onChange={(e) => updateSettings({ size: parseInt(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>128px</span>
              <span className="font-medium">{settings.size}px</span>
              <span>1024px</span>
            </div>
          </div>
        </div>

        {/* Couleurs prédéfinies */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Thèmes de couleurs
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {colorPresets.map((preset) => (
              <button
                key={preset.name}
                onClick={() => applyColorPreset(preset)}
                className={`p-3 rounded-lg border transition-all hover:scale-105 ${
                  settings.fgColor === preset.fg && settings.bgColor === preset.bg
                    ? 'border-blue-500 ring-2 ring-blue-200'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                style={{
                  background: `linear-gradient(135deg, ${preset.bg} 0%, ${preset.bg} 60%, ${preset.fg} 60%, ${preset.fg} 100%)`
                }}
              >
                <div className="text-xs font-medium text-gray-700">{preset.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Couleurs personnalisées */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Couleur de premier plan
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={settings.fgColor}
                onChange={(e) => updateSettings({ fgColor: e.target.value })}
                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={settings.fgColor}
                onChange={(e) => updateSettings({ fgColor: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-transparent"
                placeholder="#000000"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Couleur d'arrière-plan
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={settings.bgColor}
                onChange={(e) => updateSettings({ bgColor: e.target.value })}
                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={settings.bgColor}
                onChange={(e) => updateSettings({ bgColor: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-transparent"
                placeholder="#FFFFFF"
              />
            </div>
          </div>
        </div>

        {/* Niveau de correction d'erreur */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <Shield className="w-4 h-4 inline mr-2" />
            Niveau de correction d'erreur
          </label>
          <div className="space-y-2">
            {errorLevels.map((level) => (
              <button
                key={level.value}
                onClick={() => updateSettings({ errorCorrectionLevel: level.value as 'L' | 'M' | 'Q' | 'H' })}
                className={`w-full p-3 text-left rounded-lg border transition-colors ${
                  settings.errorCorrectionLevel === level.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className={`font-medium ${
                      settings.errorCorrectionLevel === level.value ? 'text-blue-700' : 'text-gray-900'
                    }`}>
                      {level.label}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">{level.description}</div>
                  </div>
                  {settings.errorCorrectionLevel === level.value && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Aperçu des couleurs */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Aperçu des couleurs</h4>
          <div 
            className="w-full h-12 rounded border-2 border-gray-300 flex items-center justify-center"
            style={{ 
              backgroundColor: settings.bgColor,
              color: settings.fgColor,
              borderColor: settings.fgColor 
            }}
          >
            <div 
              className="w-8 h-8 rounded"
              style={{ backgroundColor: settings.fgColor }}
            ></div>
          </div>
        </div>

        {/* Animation Preview */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <Zap className="w-4 h-4 inline mr-2" />
            Animation (aperçu)
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(['none', 'fade', 'scale', 'rotate'] as const).map((type) => (
              <button
                key={type}
                onClick={() => updateSettings({
                  animation: type === 'none' ? undefined : {
                    type,
                    duration: settings.animation?.duration || 1000
                  }
                })}
                className={`p-2 text-xs rounded border capitalize ${
                  (settings.animation?.type || 'none') === type
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300'
                }`}
              >
                {type === 'none' ? 'Aucune' : type}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}