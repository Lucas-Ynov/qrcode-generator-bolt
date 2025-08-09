import React, { useRef, useState } from 'react';
import { QRCodeSettings } from '../types/qr-types';
import { 
  Palette, 
  Upload, 
  Image as ImageIcon, 
  Layers, 
  Square, 
  Circle,
  Zap,
  RotateCw,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react';

interface AdvancedDesignPanelProps {
  settings: QRCodeSettings;
  onSettingsChange: (settings: QRCodeSettings) => void;
}

const dotsStyles = [
  { value: 'square', label: 'Carré', preview: '⬛' },
  { value: 'rounded', label: 'Arrondi', preview: '⬜' },
  { value: 'dots', label: 'Points', preview: '⚫' },
  { value: 'classy', label: 'Élégant', preview: '◆' },
  { value: 'classy-rounded', label: 'Élégant arrondi', preview: '◇' },
  { value: 'extra-rounded', label: 'Très arrondi', preview: '●' }
];

const cornerStyles = [
  { value: 'square', label: 'Carré', preview: '⬛' },
  { value: 'dot', label: 'Point', preview: '⚫' },
  { value: 'extra-rounded', label: 'Arrondi', preview: '●' }
];

const frameStyles = [
  { value: 'none', label: 'Aucun' },
  { value: 'square', label: 'Carré' },
  { value: 'circle', label: 'Cercle' },
  { value: 'banner', label: 'Bannière' },
  { value: 'balloon', label: 'Bulle' }
];

const gradientPresets = [
  { name: 'Sunset', colors: [{ offset: 0, color: '#FF6B6B' }, { offset: 1, color: '#FFE66D' }] },
  { name: 'Ocean', colors: [{ offset: 0, color: '#667eea' }, { offset: 1, color: '#764ba2' }] },
  { name: 'Forest', colors: [{ offset: 0, color: '#11998e' }, { offset: 1, color: '#38ef7d' }] },
  { name: 'Purple', colors: [{ offset: 0, color: '#667eea' }, { offset: 1, color: '#764ba2' }] },
  { name: 'Fire', colors: [{ offset: 0, color: '#f093fb' }, { offset: 1, color: '#f5576c' }] }
];

export function AdvancedDesignPanel({ settings, onSettingsChange }: AdvancedDesignPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showGradientEditor, setShowGradientEditor] = useState(false);

  const updateSettings = (updates: Partial<QRCodeSettings>) => {
    onSettingsChange({ ...settings, ...updates });
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        updateSettings({
          logo: {
            image: result,
            size: settings.logo?.size || 0.3,
            margin: settings.logo?.margin || 10,
            removeBackground: settings.logo?.removeBackground || false
          }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    updateSettings({ logo: undefined });
  };

  const applyGradientPreset = (preset: typeof gradientPresets[0]) => {
    updateSettings({
      gradientType: 'linear',
      gradientColorStops: preset.colors,
      gradientDirection: 45
    });
  };

  const addGradientStop = () => {
    const stops = settings.gradientColorStops || [
      { offset: 0, color: settings.fgColor },
      { offset: 1, color: settings.fgColor }
    ];
    const newStop = {
      offset: 0.5,
      color: settings.fgColor
    };
    updateSettings({
      gradientColorStops: [...stops, newStop].sort((a, b) => a.offset - b.offset)
    });
  };

  const updateGradientStop = (index: number, field: 'offset' | 'color', value: string | number) => {
    const stops = [...(settings.gradientColorStops || [])];
    stops[index] = { ...stops[index], [field]: value };
    updateSettings({ gradientColorStops: stops });
  };

  const removeGradientStop = (index: number) => {
    const stops = settings.gradientColorStops || [];
    if (stops.length > 2) {
      updateSettings({
        gradientColorStops: stops.filter((_, i) => i !== index)
      });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 space-y-6">
        <div className="flex items-center space-x-2 pb-4 border-b border-gray-200">
          <Layers className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">Design Avancé</h3>
        </div>

        {/* Style des modules */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <Square className="w-4 h-4 inline mr-2" />
            Style des modules
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {dotsStyles.map((style) => (
              <button
                key={style.value}
                onClick={() => updateSettings({ dotsType: style.value as any })}
                className={`p-3 text-sm rounded-lg border transition-colors ${
                  settings.dotsType === style.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="text-lg mb-1">{style.preview}</div>
                <div>{style.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Style des coins */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <Circle className="w-4 h-4 inline mr-2" />
            Style des coins
          </label>
          <div className="grid grid-cols-3 gap-2">
            {cornerStyles.map((style) => (
              <button
                key={style.value}
                onClick={() => updateSettings({ 
                  cornersSquareType: style.value as any,
                  cornersDotType: style.value as any
                })}
                className={`p-3 text-sm rounded-lg border transition-colors ${
                  settings.cornersSquareType === style.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="text-lg mb-1">{style.preview}</div>
                <div>{style.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Gradient */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-700">
              <Palette className="w-4 h-4 inline mr-2" />
              Dégradé
            </label>
            <button
              onClick={() => setShowGradientEditor(!showGradientEditor)}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              {showGradientEditor ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-3">
            <button
              onClick={() => updateSettings({ gradientType: 'none' })}
              className={`p-2 text-xs rounded border ${
                settings.gradientType === 'none'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300'
              }`}
            >
              Aucun
            </button>
            <button
              onClick={() => updateSettings({ gradientType: 'linear' })}
              className={`p-2 text-xs rounded border ${
                settings.gradientType === 'linear'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300'
              }`}
            >
              Linéaire
            </button>
            <button
              onClick={() => updateSettings({ gradientType: 'radial' })}
              className={`p-2 text-xs rounded border ${
                settings.gradientType === 'radial'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300'
              }`}
            >
              Radial
            </button>
          </div>

          {settings.gradientType !== 'none' && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
                {gradientPresets.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => applyGradientPreset(preset)}
                    className="p-2 rounded border border-gray-300 hover:border-gray-400 transition-colors"
                    style={{
                      background: `linear-gradient(45deg, ${preset.colors[0].color}, ${preset.colors[1].color})`
                    }}
                  >
                    <div className="text-xs font-medium text-white drop-shadow">
                      {preset.name}
                    </div>
                  </button>
                ))}
              </div>

              {showGradientEditor && (
                <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Direction (degrés)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      value={settings.gradientDirection || 0}
                      onChange={(e) => updateSettings({ gradientDirection: parseInt(e.target.value) })}
                      className="w-full"
                    />
                    <div className="text-xs text-gray-500 text-center">
                      {settings.gradientDirection || 0}°
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-medium text-gray-600">
                        Points de couleur
                      </label>
                      <button
                        onClick={addGradientStop}
                        className="text-xs text-blue-600 hover:text-blue-700"
                      >
                        + Ajouter
                      </button>
                    </div>
                    
                    <div className="space-y-2">
                      {(settings.gradientColorStops || []).map((stop, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input
                            type="color"
                            value={stop.color}
                            onChange={(e) => updateGradientStop(index, 'color', e.target.value)}
                            className="w-8 h-8 border rounded cursor-pointer"
                          />
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={stop.offset}
                            onChange={(e) => updateGradientStop(index, 'offset', parseFloat(e.target.value))}
                            className="flex-1"
                          />
                          <span className="text-xs text-gray-500 w-12">
                            {Math.round(stop.offset * 100)}%
                          </span>
                          {(settings.gradientColorStops || []).length > 2 && (
                            <button
                              onClick={() => removeGradientStop(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Logo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <ImageIcon className="w-4 h-4 inline mr-2" />
            Logo central
          </label>
          
          {!settings.logo ? (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors"
              >
                <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Cliquez pour ajouter un logo</p>
                <p className="text-xs text-gray-400">PNG, JPG, SVG (max 5MB)</p>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <img
                    src={settings.logo.image}
                    alt="Logo"
                    className="w-10 h-10 object-contain rounded"
                  />
                  <span className="text-sm text-gray-700">Logo ajouté</span>
                </div>
                <button
                  onClick={removeLogo}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Taille du logo
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="0.5"
                  step="0.05"
                  value={settings.logo.size}
                  onChange={(e) => updateSettings({
                    logo: { ...settings.logo!, size: parseFloat(e.target.value) }
                  })}
                  className="w-full"
                />
                <div className="text-xs text-gray-500 text-center">
                  {Math.round(settings.logo.size * 100)}%
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Marge autour du logo
                </label>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={settings.logo.margin}
                  onChange={(e) => updateSettings({
                    logo: { ...settings.logo!, margin: parseInt(e.target.value) }
                  })}
                  className="w-full"
                />
                <div className="text-xs text-gray-500 text-center">
                  {settings.logo.margin}px
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="removeBackground"
                  checked={settings.logo.removeBackground}
                  onChange={(e) => updateSettings({
                    logo: { ...settings.logo!, removeBackground: e.target.checked }
                  })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="removeBackground" className="ml-2 text-xs text-gray-700">
                  Supprimer l'arrière-plan du logo
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Cadre */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Cadre décoratif
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
            {frameStyles.map((style) => (
              <button
                key={style.value}
                onClick={() => updateSettings({
                  frame: style.value === 'none' ? undefined : {
                    style: style.value as any,
                    color: settings.frame?.color || '#000000',
                    text: settings.frame?.text || '',
                    textColor: settings.frame?.textColor || '#FFFFFF'
                  }
                })}
                className={`p-2 text-xs rounded border ${
                  (settings.frame?.style || 'none') === style.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300'
                }`}
              >
                {style.label}
              </button>
            ))}
          </div>

          {settings.frame && settings.frame.style !== 'none' && (
            <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Couleur du cadre
                  </label>
                  <input
                    type="color"
                    value={settings.frame.color}
                    onChange={(e) => updateSettings({
                      frame: { ...settings.frame!, color: e.target.value }
                    })}
                    className="w-full h-8 border rounded cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Couleur du texte
                  </label>
                  <input
                    type="color"
                    value={settings.frame.textColor}
                    onChange={(e) => updateSettings({
                      frame: { ...settings.frame!, textColor: e.target.value }
                    })}
                    className="w-full h-8 border rounded cursor-pointer"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Texte du cadre
                </label>
                <input
                  type="text"
                  value={settings.frame.text || ''}
                  onChange={(e) => updateSettings({
                    frame: { ...settings.frame!, text: e.target.value }
                  })}
                  placeholder="Scannez-moi !"
                  className="w-full px-2 py-1 text-xs border rounded focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Animation */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <Zap className="w-4 h-4 inline mr-2" />
            Animation (aperçu uniquement)
          </label>
          <div className="grid grid-cols-2 gap-2">
            {['none', 'fade', 'scale', 'rotate'].map((type) => (
              <button
                key={type}
                onClick={() => updateSettings({
                  animation: type === 'none' ? undefined : {
                    type: type as any,
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

          {settings.animation && (
            <div className="mt-3">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Durée (ms)
              </label>
              <input
                type="range"
                min="500"
                max="3000"
                step="100"
                value={settings.animation.duration}
                onChange={(e) => updateSettings({
                  animation: { ...settings.animation!, duration: parseInt(e.target.value) }
                })}
                className="w-full"
              />
              <div className="text-xs text-gray-500 text-center">
                {settings.animation.duration}ms
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}