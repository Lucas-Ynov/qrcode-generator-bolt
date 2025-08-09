import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Download, Share2, Copy, Eye, RotateCcw, Maximize2 } from 'lucide-react';
import QRCodeStyling from 'qr-code-styling';
import { saveAs } from 'file-saver';
import { QRCodeData, QRCodeSettings } from '../types/qr-types';

interface QRCodePreviewProps {
  data: QRCodeData;
  settings: QRCodeSettings;
  onGenerated?: (url: string) => void;
}

export function QRCodePreview({ data, settings, onGenerated }: QRCodePreviewProps) {
  const [qrCode, setQrCode] = useState<QRCodeStyling | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [showFullscreen, setShowFullscreen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const generateQRCode = useCallback(async () => {
    if (!data.content.trim()) return;

    setIsGenerating(true);

    try {
      // Configuration du QR code avec les paramètres avancés
      const qrCodeConfig: any = {
        width: settings.size,
        height: settings.size,
        type: 'svg',
        data: data.content,
        margin: 10,
        qrOptions: {
          typeNumber: 0,
          mode: 'Byte',
          errorCorrectionLevel: settings.errorCorrectionLevel
        },
        imageOptions: {
          hideBackgroundDots: true,
          imageSize: settings.logo?.size || 0.4,
          margin: settings.logo?.margin || 0,
          crossOrigin: 'anonymous'
        },
        dotsOptions: {
          color: settings.fgColor,
          type: settings.dotsType
        },
        backgroundOptions: {
          color: settings.bgColor
        },
        cornersSquareOptions: {
          color: settings.fgColor,
          type: settings.cornersSquareType
        },
        cornersDotOptions: {
          color: settings.fgColor,
          type: settings.cornersDotType
        }
      };

      // Appliquer le dégradé si configuré
      if (settings.gradientType !== 'none' && settings.gradientColorStops?.length) {
        const gradient: any = {
          type: settings.gradientType,
          rotation: settings.gradientDirection || 0,
          colorStops: settings.gradientColorStops.map(stop => ({
            offset: stop.offset,
            color: stop.color
          }))
        };

        qrCodeConfig.dotsOptions.gradient = gradient;
        qrCodeConfig.cornersSquareOptions.gradient = gradient;
        qrCodeConfig.cornersDotOptions.gradient = gradient;
      }

      // Ajouter le logo si présent
      if (settings.logo?.image) {
        qrCodeConfig.image = settings.logo.image;
      }

      const qrCodeInstance = new QRCodeStyling(qrCodeConfig);
      setQrCode(qrCodeInstance);

      // Générer et afficher le QR code
      if (ref.current) {
        ref.current.innerHTML = '';
        qrCodeInstance.append(ref.current);
        
        // Générer l'URL pour l'historique et le téléchargement
        qrCodeInstance.getRawData('png').then((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            setQrCodeUrl(url);
            onGenerated?.(url);
          }
        });
      }
    } catch (error) {
      console.error('Erreur lors de la génération du QR code:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [data, settings, onGenerated]);

  useEffect(() => {
    generateQRCode();
  }, [generateQRCode]);

  const downloadQRCode = async (format: 'png' | 'svg' | 'jpeg' | 'webp' = 'png') => {
    if (!qrCode) return;

    try {
      const blob = await qrCode.getRawData(format);
      if (blob) {
        const filename = `qr-code-${Date.now()}.${format}`;
        saveAs(blob, filename);
      }
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
    }
  };

  const shareQRCode = async () => {
    if (!qrCode || !navigator.share) return;

    try {
      const blob = await qrCode.getRawData('png');
      if (blob) {
        const file = new File([blob], 'qr-code.png', { type: 'image/png' });
        await navigator.share({
          title: 'QR Code',
          text: `QR Code pour: ${data.content.substring(0, 50)}...`,
          files: [file]
        });
      }
    } catch (error) {
      console.error('Erreur lors du partage:', error);
    }
  };

  const copyToClipboard = async (type: 'image' | 'content' = 'content') => {
    try {
      if (type === 'content') {
        await navigator.clipboard.writeText(data.content);
      } else if (qrCode) {
        const blob = await qrCode.getRawData('png');
        if (blob) {
          const item = new ClipboardItem({ 'image/png': blob });
          await navigator.clipboard.write([item]);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la copie:', error);
    }
  };

  const regenerateQRCode = () => {
    generateQRCode();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Aperçu du QR Code</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={regenerateQRCode}
              disabled={isGenerating}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Régénérer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowFullscreen(true)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Plein écran"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* QR Code Display */}
        <div className="flex justify-center mb-6">
          <div 
            className={`relative bg-white rounded-lg shadow-sm border border-gray-200 p-4 transition-all duration-300 ${
              settings.animation?.type === 'scale' ? 'hover:scale-105' : ''
            } ${
              settings.animation?.type === 'rotate' ? 'hover:rotate-3' : ''
            }`}
            style={{
              animation: settings.animation?.type === 'fade' 
                ? `fadeIn ${settings.animation.duration}ms ease-in-out` 
                : undefined
            }}
          >
            {isGenerating ? (
              <div className="flex items-center justify-center" style={{ width: settings.size, height: settings.size }}>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div 
                ref={ref} 
                className="flex items-center justify-center"
                style={{ minWidth: settings.size, minHeight: settings.size }}
              />
            )}
            
            {!data.content.trim() && !isGenerating && (
              <div 
                className="flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-300 rounded-lg"
                style={{ width: settings.size, height: settings.size }}
              >
                <div className="text-center">
                  <Eye className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm">Aperçu du QR code</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        {data.content.trim() && !isGenerating && (
          <div className="space-y-4">
            {/* Download Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Télécharger
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['png', 'svg', 'jpeg', 'webp'] as const).map((format) => (
                  <button
                    key={format}
                    onClick={() => downloadQRCode(format)}
                    className="flex items-center justify-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    <Download className="w-3 h-3" />
                    <span>{format.toUpperCase()}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => copyToClipboard('content')}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                <Copy className="w-4 h-4" />
                <span>Copier le contenu</span>
              </button>
              
              <button
                onClick={() => copyToClipboard('image')}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                <Copy className="w-4 h-4" />
                <span>Copier l'image</span>
              </button>

              {navigator.share && (
                <button
                  onClick={shareQRCode}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Partager</span>
                </button>
              )}
            </div>

            {/* QR Code Info */}
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Taille:</span>
                  <span className="ml-2 font-medium">{settings.size}×{settings.size}px</span>
                </div>
                <div>
                  <span className="text-gray-600">Correction:</span>
                  <span className="ml-2 font-medium">Niveau {settings.errorCorrectionLevel}</span>
                </div>
                <div>
                  <span className="text-gray-600">Type:</span>
                  <span className="ml-2 font-medium capitalize">{data.type}</span>
                </div>
                <div>
                  <span className="text-gray-600">Caractères:</span>
                  <span className="ml-2 font-medium">{data.content.length}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {showFullscreen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">QR Code - Plein écran</h3>
              <button
                onClick={() => setShowFullscreen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="flex justify-center">
              <div 
                ref={ref} 
                className="bg-white p-4 rounded-lg shadow-lg"
                style={{ transform: 'scale(1.5)' }}
              />
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}