/**
 * Native App Simulator — Simulação de App Nativo (versão parametrizada)
 * Injeta scripts que simulam as propriedades internas que apps móveis
 * (Instagram, AliExpress, Facebook, TikTok) procuram no WebView/embedded browser,
 * enganando a detecção "navegador vs app nativo".
 *
 * Recebe userAgent e deviceId reais do perfil gerado, garantindo consistência
 * entre o device fake e o WebView simulado.
 *
 * Ativar a checkbox do módulo inclui este script no fluxo de injeção.
 */

export interface AppSimulationOptions {
  platform: 'instagram' | 'aliexpress' | 'tiktok' | 'facebook' | 'temu' | 'claude' | 'gmail' | 'manus' | 'universal' | 'skynetchat' | 'deephat' | 'venice' | 'simplelogin' | 'nastia' | 'mercadolibre' | 'amazon' | 'shopee';
  locale?: string;
  appVersion?: string;
}

/**
 * Gera o script de simulação de app nativo conforme a plataforma.
 * Recebe userAgent e deviceId reais do perfil gerado.
 */
export function generateNativeAppSimulationForProfile(
  options: {
    platform: AppSimulationOptions['platform'];
    userAgent: string;
    imei: string;
    locale?: string;
  }
): string {
  const locale = (options.locale || 'pt_BR').replace('-', '_');
  const data = {
    appVersionIG: '320.0.0.32.109',
    appVersionAE: '10.45.1',
    appVersionFB: '543.0.0.67.95',
    appVersionTT: '36.2.4'
  };

  switch (options.platform) {
    case 'instagram':
      return `
        (function() {
          try {
            window.isWebview = true;
            window.InstagramWebView = { isPresent: true, version: '${data.appVersionIG}', locale: '${locale}', deviceId: '${options.imei}' };
            window.isFacebookAuthWebView = true;
            if (!window.ReactNativeWebView) {
              window.ReactNativeWebView = { postMessage: function(){}, injectJSON: function(){}, canGoBack: true, canGoForward: false };
            }
            window.__APP_ENV__ = 'native';
            window.__NATIVE_SHELL__ = true;
            window.CatalystApp = { isIGApp: true, appVersion: '${data.appVersionIG}' };
            try {
              Object.defineProperty(navigator, 'userAgent', {
                get: function() { return "${options.userAgent} Instagram ${data.appVersionIG} Android (33/13; 480dpi; 1080x2270; Samsung; SM-G991B; o1s; exynos2100; ${locale}; 564618679)"; },
                configurable: true
              });
            } catch(e) {}
            console.log('%c📱 Simulação de App Nativo Instagram ATIVA', 'color: #e1306c; font-weight: bold; font-size: 13px;');
          } catch(err) { console.error('App sim erro:', err); }
        })();
      `;
    case 'aliexpress':
      return `
        (function() {
          try {
            window.__app_env__ = 'native';
            window.isAliExpressApp = true;
            window.AliApp = { version: '${data.appVersionAE}', platform: 'Android', osVersion: '13', deviceId: '${options.imei}', utdid: '${options.imei}', locale: '${locale}' };
            if (!window.Android) {
              window.Android = { openURL: function(){}, share: function(){}, getDeviceInfo: function(){ return JSON.stringify({deviceId: '${options.imei}', appVersion: '${data.appVersionAE}'}); } };
            }
            window.WindVane = window.WindVane || { call: function(api, params, success, fail){ if (success) success({}); }, isAvailable: true };
            try {
              Object.defineProperty(navigator, 'userAgent', {
                get: function() { return "${options.userAgent} AliApp/Android/${data.appVersionAE} Channel/${locale} WindVane/3.1.0"; },
                configurable: true
              });
            } catch(e) {}
            console.log('%c🛒 Simulação de App Nativo AliExpress ATIVA (preços de app habilitados)', 'color: #ff4747; font-weight: bold; font-size: 13px;');
          } catch(err) { console.error('App sim erro:', err); }
        })();
      `;
    case 'facebook':
      return `
        (function() {
          try {
            window.isWebview = true;
            window.isFacebookAuthWebView = true;
            window.FacebookBridge = { present: true, version: '${data.appVersionFB}', locale: '${locale}' };
            if (!window.ReactNativeWebView) {
              window.ReactNativeWebView = { postMessage: function(){} };
            }
            window.__APP_ENV__ = 'native';
            try {
              Object.defineProperty(navigator, 'userAgent', {
                get: function() { return "${options.userAgent} [FBAN/FB4A;FBAV/${data.appVersionFB};FBBV/1004704985;FBDM/{density=3.0,width=1080,height=2270};FBLC/${locale};FBMF/Samsung;FBBD/Samsung;FBPN/com.facebook.katana;FBDV/SM-G991B;FBSV/13;FBOP/1;FBCA/arm64-v8a:]"; },
                configurable: true
              });
            } catch(e) {}
            console.log('%c📘 Simulação de App Nativo Facebook ATIVA', 'color: #1877f2; font-weight: bold; font-size: 13px;');
          } catch(err) { console.error('App sim erro:', err); }
        })();
      `;
    case 'tiktok':
      return `
        (function() {
          try {
            window.isWebview = true;
            window.TikTokApp = { isPresent: true, version: '${data.appVersionTT}', locale: '${locale}', deviceId: '${options.imei}' };
            window.__APP_ENV__ = 'native';
            if (!window.ReactNativeWebView) {
              window.ReactNativeWebView = { postMessage: function(){} };
            }
            try {
              Object.defineProperty(navigator, 'userAgent', {
                get: function() { return "${options.userAgent} TikTok ${data.appVersionTT} Android (13/SM-G991B; ${locale})"; },
                configurable: true
              });
            } catch(e) {}
            console.log('%c🎵 Simulação de App Nativo TikTok ATIVA', 'color: #25f4ee; font-weight: bold; font-size: 13px;');
          } catch(err) { console.error('App sim erro:', err); }
        })();
      `;
    case 'claude':
      return `
        (function() {
          try {
            window.isWebview = true;
            window.ClaudeApp = { isPresent: true, version: '1.0.0', locale: '${locale}', deviceId: '${options.imei}' };
            window.__APP_ENV__ = 'native';
            if (!window.ReactNativeWebView) window.ReactNativeWebView = { postMessage: function(){} };
            console.log('%c☁️ Simulação local de app Claude ativa', 'color: #d8b4fe; font-weight: bold;');
          } catch(err) { console.error('App sim erro:', err); }
        })();
      `;
    case 'gmail':
      return `
        (function() {
          try {
            window.isWebview = true;
            window.GmailApp = { isPresent: true, version: '2026.1', locale: '${locale}', deviceId: '${options.imei}' };
            window.__APP_ENV__ = 'native';
            if (!window.ReactNativeWebView) window.ReactNativeWebView = { postMessage: function(){} };
            console.log('%c✉️ Simulação local de app Gmail ativa', 'color: #fca5a5; font-weight: bold;');
          } catch(err) { console.error('App sim erro:', err); }
        })();
      `;
    case 'manus':
      return `
        (function() {
          try {
            window.isWebview = true;
            window.ManusApp = { isPresent: true, version: '2.0.0', locale: '${locale}', deviceId: '${options.imei}' };
            window.__APP_ENV__ = 'native';
            if (!window.ReactNativeWebView) window.ReactNativeWebView = { postMessage: function(){} };
            console.log('%c🧩 Simulação local de app Manus ativa', 'color: #93c5fd; font-weight: bold;');
          } catch(err) { console.error('App sim erro:', err); }
        })();
      `;
    case 'temu':
      return `
        (function() {
          try {
            window.isWebview = true;
            window.isTemuApp = true;
            window.TemuBridge = { isPresent: true, version: '3.45.0', locale: '${locale}', deviceId: '${options.imei}', appType: 'shopping_app' };
            if (!window.ReactNativeWebView) {
              window.ReactNativeWebView = { postMessage: function(){}, injectJSON: function(){}, canGoBack: true, canGoForward: false };
            }
            window.__APP_ENV__ = 'native';
            window.__NATIVE_SHELL__ = true;
            window.__TEMU_DEEP_LINK__ = true;
            window.__NEW_USER_COUPON_ACTIVE__ = true;
            try {
              Object.defineProperty(navigator, 'userAgent', {
                get: function() { return "${options.userAgent} TemuApp/3.45.0 Android/13 (SM-G991B; ${locale}; app_store)"; },
                configurable: true
              });
            } catch(e) {}
            console.log('%c🛍️ Simulação de App Nativo TEMU ATIVA (Bypass de Preços & Cupons de Novo Usuário)', 'color: #ff6600; font-weight: bold; font-size: 13px;');
          } catch(err) { console.error('App sim erro:', err); }
        })();
      `;
    case 'mercadolibre':
      return `
        (function() {
          try {
            window.isWebview = true;
            window.isMercadoLibreApp = true;
            window.MLBridge = { isPresent: true, version: '10.98.0', locale: '${locale}', deviceId: '${options.imei}', appType: 'marketplace_app' };
            if (!window.ReactNativeWebView) {
              window.ReactNativeWebView = { postMessage: function(){}, injectJSON: function(){}, canGoBack: true, canGoForward: false };
            }
            window.__APP_ENV__ = 'native';
            window.__NATIVE_SHELL__ = true;
            window.__ML_DEEP_LINK__ = true;
            try {
              Object.defineProperty(navigator, 'userAgent', {
                get: function() { return "${options.userAgent} MLApp/10.98.0 Android/${'13'} (${'SM-G991B'}; ${locale}; app_store)"; },
                configurable: true
              });
            } catch(e) {}
            console.log('%c💛 Simulação de App Nativo MERCADO LIVRE ATIVA (anti-bot ML desafiado)', 'color: #ffe600; font-weight: bold; font-size: 13px;');
          } catch(err) { console.error('App sim erro:', err); }
        })();
      `;
    case 'amazon':
      return `
        (function() {
          try {
            window.isWebview = true;
            window.isAmazonApp = true;
            window.AmazonBridge = { isPresent: true, version: '26.22.0', locale: '${locale}', deviceId: '${options.imei}', appType: 'shopping_app' };
            if (!window.ReactNativeWebView) {
              window.ReactNativeWebView = { postMessage: function(){}, injectJSON: function(){}, canGoBack: true, canGoForward: false };
            }
            window.__APP_ENV__ = 'native';
            window.__NATIVE_SHELL__ = true;
            window.__AMAZON_DEVICE_TOKEN__ = 'at|' + Math.random().toString(36).substring(2, 30);
            try {
              Object.defineProperty(navigator, 'userAgent', {
                get: function() { return "${options.userAgent} AmazonApp/26.22.0 Android/13 (SM-G991B; ${locale}; app_store)"; },
                configurable: true
              });
            } catch(e) {}
            console.log('%c🧡 Simulação de App Nativo AMAZON ATIVA (anti-fraude Amazon desafiado)', 'color: #ff9900; font-weight: bold; font-size: 13px;');
          } catch(err) { console.error('App sim erro:', err); }
        })();
      `;
    case 'shopee':
      return `
        (function() {
          try {
            window.isWebview = true;
            window.isShopeeApp = true;
            window.ShopeeBridge = { isPresent: true, version: '3.45.12', locale: '${locale}', deviceId: '${options.imei}', appType: 'shopping_app' };
            if (!window.ReactNativeWebView) {
              window.ReactNativeWebView = { postMessage: function(){}, injectJSON: function(){}, canGoBack: true, canGoForward: false };
            }
            window.__APP_ENV__ = 'native';
            window.__NATIVE_SHELL__ = true;
            window.__SACS_BYPASS__ = true;
            window.__SP_DEEP_LINK__ = true;
            try {
              Object.defineProperty(navigator, 'userAgent', {
                get: function() { return "${options.userAgent} ShopeeApp/3.45.12 Android/13 (SM-G991B; ${locale}; app_store)"; },
                configurable: true
              });
            } catch(e) {}
            console.log('%c🟠 Simulação de App Nativo SHOPEE ATIVA (SACS anti-cheating desafiado)', 'color: #ee4d2d; font-weight: bold; font-size: 13px;');
          } catch(err) { console.error('App sim erro:', err); }
        })();
      `;
    case 'skynetchat':
      return `
        (function() {
          try {
            window.isWebview = true;
            window.SkynetApp = { isPresent: true, version: '1.0.0', locale: '${locale}', deviceId: '${options.imei}' };
            window.__APP_ENV__ = 'native';
            if (!window.ReactNativeWebView) window.ReactNativeWebView = { postMessage: function(){} };
            console.log('%c🛡️ Simulação local de App SkynetChat ativa', 'color: #00d9ff; font-weight: bold;');
          } catch(err) { console.error('App sim erro:', err); }
        })();
      `;
    case 'deephat':
      return `
        (function() {
          try {
            window.isWebview = true;
            window.DeepHatApp = { isPresent: true, version: '1.0.0', locale: '${locale}', deviceId: '${options.imei}' };
            window.__APP_ENV__ = 'native';
            if (!window.ReactNativeWebView) window.ReactNativeWebView = { postMessage: function(){} };
            console.log('%c🎩 Simulação local de App DeepHat ativa', 'color: #ff006e; font-weight: bold;');
          } catch(err) { console.error('App sim erro:', err); }
        })();
      `;
    case 'venice':
      return `
        (function() {
          try {
            window.isWebview = true;
            window.VeniceApp = { isPresent: true, version: '1.0.0', locale: '${locale}', deviceId: '${options.imei}' };
            window.__APP_ENV__ = 'native';
            if (!window.ReactNativeWebView) window.ReactNativeWebView = { postMessage: function(){} };
            console.log('%c🌊 Simulação local de App Venice AI ativa', 'color: #38bdf8; font-weight: bold;');
          } catch(err) { console.error('App sim erro:', err); }
        })();
      `;
    case 'simplelogin':
      return `
        (function() {
          try {
            window.isWebview = true;
            window.SimpleLoginApp = { isPresent: true, version: '2.1.0', locale: '${locale}', deviceId: '${options.imei}' };
            window.__APP_ENV__ = 'native';
            if (!window.ReactNativeWebView) window.ReactNativeWebView = { postMessage: function(){} };
            console.log('%c🔒 Simulação local de App SimpleLogin ativa', 'color: #22c55e; font-weight: bold;');
          } catch(err) { console.error('App sim erro:', err); }
        })();
      `;
    case 'nastia':
      return `
        (function() {
          try {
            window.isWebview = true;
            window.NastiaApp = { isPresent: true, version: '1.2.0', locale: '${locale}', deviceId: '${options.imei}' };
            window.__APP_ENV__ = 'native';
            if (!window.ReactNativeWebView) window.ReactNativeWebView = { postMessage: function(){} };
            console.log('%c🌸 Simulação local de App Nastia.ai ativa', 'color: #ec4899; font-weight: bold;');
          } catch(err) { console.error('App sim erro:', err); }
        })();
      `;
    default:
      return '';
  }
}

/**
 * Alias mantido para compatibilidade com código existente.
 */
export function generateNativeAppSimulation(
  options: AppSimulationOptions
): string {
  return generateNativeAppSimulationForProfile({
    platform: options.platform,
    userAgent: '',
    imei: '',
    locale: options.locale,
  });
}
