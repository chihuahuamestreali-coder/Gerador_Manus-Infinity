/**
 * Delivery Device Generator - Especializado em plataformas de delivery (iFood, AiQFome, Zé Delivery)
 * Focado em geolocalização, tokens de app móvel e bypass de anti-fraude de pedidos.
 */

export interface DeliveryDeviceProfile {
  id: string;
  deviceName: string;
  model: string;
  manufacturer: string;
  userAgent: string;
  macAddress: string;
  imei: string;
  androidId: string;
  fingerprint: string;
  location: {
    lat: number;
    lng: number;
    accuracy: number;
  };
  deliveryTokens: {
    deviceId: string;
    trackingId: string;
    sessionToken: string;
  };
}

const DELIVERY_DEVICES = [
  { model: 'SM-G998B', manufacturer: 'Samsung', name: 'Galaxy S21 Ultra' },
  { model: 'SM-G973F', manufacturer: 'Samsung', name: 'Galaxy S10' },
  { model: 'M2012K11AC', manufacturer: 'Xiaomi', name: 'POCO F3' },
  { model: 'RMX3363', manufacturer: 'Realme', name: 'Realme GT Master' },
];

// Capitais brasileiras para geolocalização realista
const BRAZIL_CAPITALS = [
  { lat: -23.5505, lng: -46.6333, name: 'São Paulo' },
  { lat: -22.9068, lng: -43.1729, name: 'Rio de Janeiro' },
  { lat: -19.9167, lng: -43.9345, name: 'Belo Horizonte' },
  { lat: -15.7975, lng: -47.8919, name: 'Brasília' },
  { lat: -30.0346, lng: -51.2177, name: 'Porto Alegre' },
  { lat: -22.7518, lng: -43.7082, name: 'Seropédica' },
];

export function generateDeliveryDeviceProfile(platform: 'ifood' | 'aiqfome' | 'zedelivery', customLocation?: { lat: number, lng: number }): DeliveryDeviceProfile {
  const device = DELIVERY_DEVICES[Math.floor(Math.random() * DELIVERY_DEVICES.length)];
  const capital = customLocation ? { ...customLocation, name: 'Custom' } : BRAZIL_CAPITALS[Math.floor(Math.random() * BRAZIL_CAPITALS.length)];
  
  // Variação leve na coordenada para não ser o centro exato
  const lat = capital.lat + (Math.random() - 0.5) * 0.002;
  const lng = capital.lng + (Math.random() - 0.5) * 0.002;

  const randHex = (n: number) => Array.from({ length: n }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  
  const androidVer = '13';
  const ua = `Mozilla/5.0 (Linux; Android ${androidVer}; ${device.model}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36`;

  return {
    id: `deliv_${Date.now()}_${randHex(4)}`,
    deviceName: `${device.name} Delivery-Node`,
    model: device.model,
    manufacturer: device.manufacturer,
    userAgent: ua,
    macAddress: `02:00:00:${randHex(2)}:${randHex(2)}:${randHex(2)}`,
    imei: `35${randHex(13)}`,
    androidId: randHex(16),
    fingerprint: `${platform}_fp_${randHex(32)}`,
    location: {
      lat,
      lng,
      accuracy: Math.floor(Math.random() * 20) + 5,
    },
    deliveryTokens: {
      deviceId: `${platform}_did_${randHex(16)}`,
      trackingId: randHex(24),
      sessionToken: randHex(32),
    }
  };
}
