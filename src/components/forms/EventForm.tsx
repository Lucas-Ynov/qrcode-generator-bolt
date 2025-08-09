import React from 'react';
import { QRCodeData } from '../../types/qr-types';
import { Calendar, Clock, MapPin, FileText } from 'lucide-react';

interface EventFormProps {
  data: QRCodeData;
  onChange: (data: QRCodeData) => void;
}

export function EventForm({ data, onChange }: EventFormProps) {
  const event = data.event || {
    title: '',
    description: '',
    location: '',
    startDate: '',
    endDate: ''
  };

  const updateEvent = (field: keyof typeof event, value: string) => {
    const newEvent = { ...event, [field]: value };
    
    // Generate iCal format
    const formatDate = (dateStr: string) => {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const iCalContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//QR Code Generator//Event//EN',
      'BEGIN:VEVENT',
      `SUMMARY:${newEvent.title}`,
      newEvent.description ? `DESCRIPTION:${newEvent.description}` : '',
      newEvent.location ? `LOCATION:${newEvent.location}` : '',
      newEvent.startDate ? `DTSTART:${formatDate(newEvent.startDate)}` : '',
      newEvent.endDate ? `DTEND:${formatDate(newEvent.endDate)}` : '',
      `UID:${Date.now()}@qrcodegen.com`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].filter(line => line).join('\n');

    onChange({
      ...data,
      type: 'event',
      content: iCalContent,
      event: newEvent
    });
  };

  const formatDateForInput = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toISOString().slice(0, 16);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Calendar className="w-4 h-4 inline mr-2" />
          Titre de l'événement *
        </label>
        <input
          type="text"
          value={event.title}
          onChange={(e) => updateEvent('title', e.target.value)}
          placeholder="Réunion équipe"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <FileText className="w-4 h-4 inline mr-2" />
          Description
        </label>
        <textarea
          value={event.description || ''}
          onChange={(e) => updateEvent('description', e.target.value)}
          placeholder="Description de l'événement..."
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-transparent resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <MapPin className="w-4 h-4 inline mr-2" />
          Lieu
        </label>
        <input
          type="text"
          value={event.location || ''}
          onChange={(e) => updateEvent('location', e.target.value)}
          placeholder="Salle de conférence A"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Clock className="w-4 h-4 inline mr-2" />
            Date et heure de début *
          </label>
          <input
            type="datetime-local"
            value={formatDateForInput(event.startDate)}
            onChange={(e) => updateEvent('startDate', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date et heure de fin *
          </label>
          <input
            type="datetime-local"
            value={formatDateForInput(event.endDate)}
            onChange={(e) => updateEvent('endDate', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-transparent"
          />
        </div>
      </div>

      {event.title && event.startDate && event.endDate && (
        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
          <p className="text-green-700 text-sm">
            ✓ Événement configuré: {event.title}
            {event.location && ` à ${event.location}`}
          </p>
        </div>
      )}

      <div className="p-4 bg-purple-50 rounded-lg">
        <h4 className="font-medium text-purple-800 mb-2">📅 Comment ça marche ?</h4>
        <p className="text-sm text-purple-700">
          En scannant ce QR code, l'événement sera automatiquement ajouté au calendrier avec tous les détails.
        </p>
      </div>
    </div>
  );
}