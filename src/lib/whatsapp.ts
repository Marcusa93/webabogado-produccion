export const WHATSAPP_NUMBER = '5493813007791';

const DEFAULT_MESSAGE = 'Hola, quiero hacer una consulta sobre mi caso.';

export const whatsappUrl = (message: string = DEFAULT_MESSAGE) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
