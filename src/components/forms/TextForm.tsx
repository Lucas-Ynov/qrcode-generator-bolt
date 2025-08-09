import React from 'react';
import { QRCodeData } from '../../types/qr-types';
import { FileText, Type } from 'lucide-react';

interface TextFormProps {
  data: QRCodeData;
  onChange: (data: QRCodeData) => void;
}

export function TextForm({ data, onChange }: TextFormProps) {
  const handleTextChange = (value: string) => {
    onChange({
      ...data,
      type: 'text',
      content: value
    });
  };

  const characterCount = data.content.length;
  const maxRecommended = 300; // Recommandation pour QR codes lisibles

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <FileText className="w-4 h-4 inline mr-2" />
          Texte à encoder
        </label>
        <textarea
          value={data.content}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder="Entrez votre texte ici..."
          rows={6}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-transparent resize-none"
        />
        <div className="flex justify-between items-center mt-1">
          <p className={`text-xs ${
            characterCount > maxRecommended ? 'text-orange-500' : 'text-gray-500'
          }`}>
            {characterCount} caractères
          </p>
          {characterCount > maxRecommended && (
            <p className="text-xs text-orange-500">
              Recommandé: moins de {maxRecommended} caractères
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2">💡 Conseils</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Texte court = QR code plus simple</li>
            <li>• Évitez les caractères spéciaux</li>
            <li>• Testez la lisibilité du code</li>
          </ul>
        </div>

        <div className="p-4 bg-amber-50 rounded-lg">
          <h4 className="font-medium text-amber-800 mb-2">⚠️ Limites</h4>
          <ul className="text-sm text-amber-700 space-y-1">
            <li>• Max recommandé: 300 caractères</li>
            <li>• Plus de texte = code plus dense</li>
            <li>• Peut être difficile à scanner</li>
          </ul>
        </div>
      </div>

      {data.content && (
        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-700 text-sm">
            <Type className="w-4 h-4 inline mr-1" />
            Aperçu du texte: "{data.content.substring(0, 50)}{data.content.length > 50 ? '...' : ''}"
          </p>
        </div>
      )}
    </div>
  );
}