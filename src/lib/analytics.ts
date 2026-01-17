/**
 * Google Analytics 4 Utilities
 *
 * This file contains helper functions to track user behavior and conversions.
 * Replace 'G-XXXXXXXXXX' with your actual Google Analytics Measurement ID.
 */

// Type definitions for gtag
declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'js',
      targetId: string | Date,
      config?: {
        [key: string]: unknown;
      }
    ) => void;
    dataLayer?: unknown[];
  }
}

/**
 * Initialize Google Analytics
 */
export const initGA = (measurementId: string) => {
  if (typeof window === 'undefined') return;

  // Create script tag
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer?.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    send_page_view: true,
  });
};

/**
 * Track custom events
 */
export const trackEvent = (
  eventName: string,
  params?: {
    [key: string]: string | number | boolean;
  }
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
  }
};

/**
 * Track page views
 */
export const trackPageView = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'G-XXXXXXXXXX', {
      page_path: url,
    });
  }
};

/**
 * Pre-defined event trackers for common actions
 */

// Contact form submission
export const trackContactFormSubmit = (method: 'email' | 'whatsapp') => {
  trackEvent('contact_form_submit', {
    method,
    category: 'engagement',
  });
};

// WhatsApp click
export const trackWhatsAppClick = (location: string) => {
  trackEvent('whatsapp_click', {
    location, // 'hero', 'floating_button', 'contact_section', etc.
    category: 'engagement',
  });
};

// Email click
export const trackEmailClick = (location: string) => {
  trackEvent('email_click', {
    location,
    category: 'engagement',
  });
};

// Section view
export const trackSectionView = (sectionName: string) => {
  trackEvent('section_view', {
    section_name: sectionName,
    category: 'navigation',
  });
};

// Service interest
export const trackServiceInterest = (serviceName: string) => {
  trackEvent('service_interest', {
    service_name: serviceName,
    category: 'engagement',
  });
};

// Social media click
export const trackSocialClick = (platform: string, location: string) => {
  trackEvent('social_click', {
    platform,
    location,
    category: 'social',
  });
};

// Download resource
export const trackResourceDownload = (resourceName: string) => {
  trackEvent('resource_download', {
    resource_name: resourceName,
    category: 'conversion',
  });
};

// Outbound link click
export const trackOutboundClick = (url: string, linkText: string) => {
  trackEvent('outbound_click', {
    url,
    link_text: linkText,
    category: 'navigation',
  });
};

// Conversion: consultation request
export const trackConsultationRequest = () => {
  trackEvent('consultation_request', {
    category: 'conversion',
    value: 1,
  });
};

// Video/media interaction
export const trackMediaInteraction = (mediaType: string, mediaTitle: string) => {
  trackEvent('media_interaction', {
    media_type: mediaType,
    media_title: mediaTitle,
    category: 'engagement',
  });
};

// Scroll depth tracking
export const trackScrollDepth = (percentage: number) => {
  trackEvent('scroll_depth', {
    percentage,
    category: 'engagement',
  });
};
