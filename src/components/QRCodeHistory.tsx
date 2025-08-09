import React from 'react';
import { History, Trash2, Clock, Download } from 'lucide-react';
import { HistoryItem } from '../types/qr-types';

interface QRCodeHistoryProps {
  history: HistoryItem[];
  onLoadItem: (item: HistoryItem) => void;
  onClearHistory: () => void;
}

export function QRCodeHistory({ history, onLoadItem, onClearHistory }: QRCodeHistoryProps) {
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins}min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    
    return new Date(date).toLocaleDateString('fr-FR');
  };

  const getContentPreview = (item: HistoryItem) => {
    switch (item.data.type) {
      case 'url':
        return `🔗 ${item.data.content.length > 30 ? item.data.content.substring(0, 30) + '...' : item.data.content}`;
      case 'email':
        return `📧 ${item.data.email?.to || 'Email'}`;
      case 'sms':
        return `💬 ${item.data.sms?.number || 'SMS'}`;
      case 'wifi':
        return `📶 ${item.data.wifi?.ssid || 'WiFi'}`;
      case 'phone':
        return `📞 ${item.data.phone?.number || 'Téléphone'}`;
      default:
        return `📄 ${item.data.content.substring(0, 30)}${item.data.content.length > 30 ? '...' : ''}`;
    }
  };

  const downloadQRCode = (item: HistoryItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.download = `qr-code-${item.id}.png`;
    link.href = item.url;
    link.click();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <History className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Historique</h3>
            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded-full">
              {history.length}
            </span>
          </div>
          
          {history.length > 0 && (
            <button
              onClick={onClearHistory}
              className="flex items-center space-x-1 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-3 h-3" />
              <span>Effacer</span>
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucun QR code dans l'historique</p>
            <p className="text-gray-400 text-sm mt-2">
              Vos codes générés apparaîtront ici
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {history.map((item) => (
              <div
                key={item.id}
                onClick={() => onLoadItem(item)}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-colors group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full capitalize">
                        {item.data.type}
                      </span>
                      <span className="text-xs text-gray-400">
                        {formatDate(item.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-800 truncate">
                      {getContentPreview(item)}
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span>{item.settings.size}px</span>
                      <span>Niveau {item.settings.errorCorrectionLevel}</span>
                      <div className="flex items-center space-x-1">
                        <div 
                          className="w-3 h-3 rounded-full border"
                          style={{ backgroundColor: item.settings.fgColor }}
                        ></div>
                        <div 
                          className="w-3 h-3 rounded-full border border-gray-300"
                          style={{ backgroundColor: item.settings.bgColor }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={(e) => downloadQRCode(item, e)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-blue-600 transition-all"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}