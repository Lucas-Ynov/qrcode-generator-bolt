export interface QRCodeData {
  type: 'url' | 'text' | 'email' | 'sms' | 'wifi' | 'phone' | 'vcard' | 'event' | 'location';
  content: string;
  email?: {
    to: string;
    subject?: string;
    body?: string;
  };
  sms?: {
    number: string;
    message?: string;
  };
  wifi?: {
    ssid: string;
    password: string;
    security: 'WPA' | 'WEP' | 'nopass';
    hidden?: boolean;
  };
  phone?: {
    number: string;
  };
  vcard?: {
    firstName: string;
    lastName: string;
    organization?: string;
    phone?: string;
    email?: string;
    website?: string;
    address?: string;
  };
  event?: {
    title: string;
    description?: string;
    location?: string;
    startDate: string;
    endDate: string;
  };
  location?: {
    latitude: number;
    longitude: number;
    query?: string;
  };
}

export interface QRCodeSettings {
  size: number;
  fgColor: string;
  bgColor: string;
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
  
  // Advanced design options
  dotsType: 'square' | 'rounded' | 'dots' | 'classy' | 'classy-rounded' | 'extra-rounded';
  cornersSquareType: 'square' | 'dot' | 'extra-rounded';
  cornersDotType: 'square' | 'dot';
  
  // Gradient options
  gradientType: 'linear' | 'radial' | 'none';
  gradientDirection: number;
  gradientColorStops: Array<{ offset: number; color: string }>;
  
  // Logo options
  logo?: {
    image: string;
    size: number;
    margin: number;
    removeBackground: boolean;
  };
  
  // Frame options
  frame?: {
    style: 'none' | 'square' | 'circle' | 'banner' | 'balloon';
    color: string;
    text?: string;
    textColor: string;
  };
  
  // Animation options
  animation?: {
    type: 'none' | 'fade' | 'scale' | 'rotate';
    duration: number;
  };
}

export interface HistoryItem {
  id: string;
  data: QRCodeData;
  settings: QRCodeSettings;
  url: string;
  createdAt: Date;
  name?: string;
  category?: string;
}

export interface QRTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  data: Partial<QRCodeData>;
  settings: Partial<QRCodeSettings>;
  preview: string;
}