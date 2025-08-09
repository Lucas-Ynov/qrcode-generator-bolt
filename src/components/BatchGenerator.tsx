import React, { useState, useRef } from 'react';
import { Upload, Download, FileText, Trash2, Play } from 'lucide-react';
import { QRCodeSettings } from '../types/qr-types';

interface BatchItem {
  id: string;
  content: string;
  filename: string;
  status: 'pending' | 'generating' | 'completed' | 'error';
  url?: string;
}

interface BatchGeneratorProps {
  settings: QRCodeSettings;
}

export function BatchGenerator({ settings }: BatchGeneratorProps) {
  const [batchItems, setBatchItems] = useState<BatchItem[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const lines = content.split('\n').filter(line => line.trim());
      
      const newItems: BatchItem[] = lines.map((line, index) => ({
        id: `${Date.now()}-${index}`,
        content: line.trim(),
        filename: `qr-${index + 1}`,
        status: 'pending'
      }));
      
      setBatchItems(newItems);
    };
    
    reader.readAsText(file);
  };

  const handleTextInput = () => {
    const content = textareaRef.current?.value || '';
    const lines = content.split('\n').filter(line => line.trim());
    
    const newItems: BatchItem[] = lines.map((line, index) => ({
      id: `${Date.now()}-${index}`,
      content: line.trim(),
      filename: `qr-${index + 1}`,
      status: 'pending'
    }));
    
    setBatchItems(newItems);
  };

  const generateBatch = async () => {
    if (batchItems.length === 0) return;
    
    setIsGenerating(true);
    
    for (let i = 0; i < batchItems.length; i++) {
      const item = batchItems[i];
      
      // Update status to generating
      setBatchItems(prev => prev.map(prevItem => 
        prevItem.id === item.id 
          ? { ...prevItem, status: 'generating' }
          : prevItem
      ));
      
      try {
        // Simulate QR code generation (replace with actual generation logic)
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Update status to completed
        setBatchItems(prev => prev.map(prevItem => 
          prevItem.id === item.id 
            ? { ...prevItem, status: 'completed', url: `data:image/png;base64,generated-${item.id}` }
            : prevItem
        ));
      } catch (error) {
        // Update status to error
        setBatchItems(prev => prev.map(prevItem => 
          prevItem.id === item.id 
            ? { ...prevItem, status: 'error' }
            : prevItem
        ));
      }
    }
    
    setIsGenerating(false);
  };

  const downloadAll = () => {
    const completedItems = batchItems.filter(item => item.status === 'completed' && item.url);
    
    completedItems.forEach(item => {
      const link = document.createElement('a');
      link.download = `${item.filename}.png`;
      link.href = item.url!;
      link.click();
    });
  };

  const clearBatch = () => {
    setBatchItems([]);
    if (textareaRef.current) {
      textareaRef.current.value = '';
    }
  };

  const removeItem = (id: string) => {
    setBatchItems(prev => prev.filter(item => item.id !== id));
  };

  const getStatusColor = (status: BatchItem['status']) => {
    switch (status) {
      case 'pending': return 'text-gray-500';
      case 'generating': return 'text-blue-500';
      case 'completed': return 'text-green-500';
      case 'error': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: BatchItem['status']) => {
    switch (status) {
      case 'generating': return '⏳';
      case 'completed': return '✅';
      case 'error': return '❌';
      default: return '⏸️';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center space-x-2 pb-4 border-b border-gray-200">
          <FileText className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">Génération en Lot</h3>
        </div>

        <div className="mt-6 space-y-6">
          {/* Input Methods */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Importer depuis un fichier
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.csv"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors"
              >
                <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Fichier TXT ou CSV</p>
                <p className="text-xs text-gray-400">Une ligne = un QR code</p>
              </button>
            </div>

            {/* Text Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Saisie manuelle
              </label>
              <textarea
                ref={textareaRef}
                placeholder="https://example1.com&#10;https://example2.com&#10;https://example3.com"
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-transparent resize-none text-sm"
              />
              <button
                onClick={handleTextInput}
                className="mt-2 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Charger le texte
              </button>
            </div>
          </div>

          {/* Batch Items */}
          {batchItems.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-medium text-gray-700">
                  Éléments à générer ({batchItems.length})
                </h4>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={generateBatch}
                    disabled={isGenerating}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 text-sm"
                  >
                    <Play className="w-4 h-4" />
                    <span>{isGenerating ? 'Génération...' : 'Générer tout'}</span>
                  </button>
                  <button
                    onClick={downloadAll}
                    disabled={!batchItems.some(item => item.status === 'completed')}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 text-sm"
                  >
                    <Download className="w-4 h-4" />
                    <span>Télécharger tout</span>
                  </button>
                  <button
                    onClick={clearBatch}
                    className="p-2 text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="max-h-64 overflow-y-auto space-y-2">
                {batchItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <span className="text-lg">{getStatusIcon(item.status)}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {item.filename}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {item.content}
                        </p>
                      </div>
                      <span className={`text-xs font-medium ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="ml-2 p-1 text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">📋 Instructions</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Importez un fichier TXT/CSV ou saisissez manuellement</li>
              <li>• Une ligne = un QR code généré</li>
              <li>• Les paramètres de design actuels seront appliqués</li>
              <li>• Téléchargez individuellement ou en lot</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}