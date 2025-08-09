import React from 'react';
import { QRCodeData, QRCodeSettings } from '../types/qr-types';

interface QRCodeGeneratorProps {
  data: QRCodeData;
  settings: QRCodeSettings;
}

export function QRCodeGenerator({ data, settings }: QRCodeGeneratorProps) {
  // Ce composant pourrait contenir la logique de génération partagée
  // Pour l'instant, la logique est dans QRCodePreview
  return null;
}