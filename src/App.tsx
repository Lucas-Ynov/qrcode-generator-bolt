import React, { useState, useEffect, useCallback } from 'react';
import { Download, QrCode, Palette, Settings, History, Smartphone, Sparkles, Layers, FileText } from 'lucide-react';
import { QRCodeGenerator } from './components/QRCodeGenerator';
import { QRCodePreview } from './components/QRCodePreview';
import { QRCodeHistory } from './components/QRCodeHistory';
import { ContentTabs } from './components/ContentTabs';
import { CustomizationPanel } from './components/CustomizationPanel';
import { AdvancedDesignPanel } from './components/AdvancedDesignPanel';
import { TemplatesPanel } from './components/TemplatesPanel';
import { BatchGenerator } from './components/BatchGenerator';
import { QRCodeData, QRCodeSettings, HistoryItem, QRTemplate } from './types/qr-types';

function App() {
  const [activeTab, setActiveTab] = useState('url');
  const [qrData, setQrData] = useState<QRCodeData>({
    type: 'url',
    content: 'https://example.com'
  });
  const [settings, setSettings] = useState<QRCodeSettings>({
    size: 256,
    fgColor: '#000000',
    bgColor: '#FFFFFF',
    errorCorrectionLevel: 'M',
    dotsType: 'square',
    cornersSquareType: 'square',
    cornersDotType: 'square',
    gradientType: 'none',
    gradientDirection: 0,
    gradientColorStops: []
  });
  const [showHistory, setShowHistory] = useState(false);
  const [showCustomization, setShowCustomization] = useState(false);
  const [showAdvancedDesign, setShowAdvancedDesign] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showBatchGenerator, setShowBatchGenerator] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  // Charger l'historique au démarrage
  useEffect(() => {
    const savedHistory = localStorage.getItem('qr-code-history');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Sauvegarder l'historique
  const saveToHistory = useCallback((data: QRCodeData, settings: QRCodeSettings, url: string) => {
    const historyItem: HistoryItem = {
      id: Date.now().toString(),
      data,
      settings,
      url,
      createdAt: new Date()
    };
    
    const newHistory = [historyItem, ...history.slice(0, 19)]; // Garder les 20 derniers
    setHistory(newHistory);
    localStorage.setItem('qr-code-history', JSON.stringify(newHistory));
  }, [history]);

  const handleQRCodeGenerated = useCallback((url: string) => {
    setQrCodeUrl(url);
    if (qrData.content.trim()) {
      saveToHistory(qrData, settings, url);
    }
  }, [qrData, settings, saveToHistory]);

  const loadFromHistory = (item: HistoryItem) => {
    setQrData(item.data);
    setSettings(item.settings);
    setActiveTab(item.data.type);
    setShowHistory(false);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('qr-code-history');
  };

  const handleTemplateSelect = (template: QRTemplate) => {
    // Apply template data
    if (template.data.type) {
      setActiveTab(template.data.type);
    }
    
    setQrData({
      type: template.data.type || 'url',
      content: template.data.content || '',
      ...template.data
    });
    
    // Apply template settings
    setSettings({
      ...settings,
      ...template.settings
    });
    
    setShowTemplates(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                <QrCode className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">QR Code Generator</h1>
                <p className="text-sm text-gray-600">Créez vos codes QR personnalisés</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowTemplates(!showTemplates)}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                <span className="hidden sm:inline">Modèles</span>
              </button>
              <button
                onClick={() => setShowBatchGenerator(!showBatchGenerator)}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              >
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">Lot</span>
              </button>
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <History className="w-4 h-4" />
                <span className="hidden sm:inline">Historique</span>
              </button>
              <button
                onClick={() => setShowCustomization(!showCustomization)}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
              >
                <Palette className="w-4 h-4" />
                <span className="hidden sm:inline">Style</span>
              </button>
              <button
                onClick={() => setShowAdvancedDesign(!showAdvancedDesign)}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              >
                <Layers className="w-4 h-4" />
                <span className="hidden sm:inline">Design+</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Configuration Panel */}
          <div className="xl:col-span-2 space-y-6">
            <ContentTabs
              activeTab={activeTab}
              onTabChange={setActiveTab}
              qrData={qrData}
              onDataChange={setQrData}
            />
            
            {showCustomization && (
              <div className="animate-in slide-in-from-top-5 duration-300">
                <CustomizationPanel
                  settings={settings}
                  onSettingsChange={setSettings}
                />
              </div>
            )}
            
            {showAdvancedDesign && (
              <div className="animate-in slide-in-from-top-5 duration-300">
                <AdvancedDesignPanel
                  settings={settings}
                  onSettingsChange={setSettings}
                />
              </div>
            )}
            
            {showBatchGenerator && (
              <div className="animate-in slide-in-from-top-5 duration-300">
                <BatchGenerator
                  settings={settings}
                />
              </div>
            )}
          </div>

          {/* Preview Panel */}
          <div className="space-y-6">
            {showTemplates && (
              <div className="animate-in slide-in-from-top-5 duration-300">
                <TemplatesPanel
                  onSelectTemplate={handleTemplateSelect}
                />
              </div>
            )}
            
            <QRCodePreview
              data={qrData}
              settings={settings}
              onGenerated={handleQRCodeGenerated}
            />
            
            {showHistory && (
              <div className="animate-in slide-in-from-right-5 duration-300">
                <QRCodeHistory
                  history={history}
                  onLoadItem={loadFromHistory}
                  onClearHistory={clearHistory}
                />
              </div>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <QrCode className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Design Avancé</h3>
            <p className="text-gray-600">Personnalisez entièrement vos QR codes avec des styles, couleurs et logos uniques</p>
          </div>

          <div className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Modèles Prêts</h3>
            <p className="text-gray-600">Utilisez nos modèles professionnels pour créer rapidement vos QR codes</p>
          </div>

          <div className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Download className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Export Multi-Format</h3>
            <p className="text-gray-600">Téléchargez en PNG, SVG, JPEG ou WebP selon vos besoins</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600">
              Générateur QR Code avancé gratuit et sans inscription • Design personnalisé et export professionnel
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;