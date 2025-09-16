import { I18nBundle } from '@nuvens/core';

export default {
  ns: 'zippex-hero',
  resources: {
    en: {
      title: 'Redefine your comfort',
      imageAlt: 'Couple relaxing comfortably on a mattress',
      'rating.text': 'Over 1,500 five-star reviews!',
      cta: 'I want my mattress',
    },
    es: {
      title: 'Redefine tu confort',
      imageAlt: 'Pareja relajándose cómodamente en un colchón',
      'rating.text': '¡Más de 1.500 reseñas de cinco estrellas!',
      cta: 'Quiero mi colchón',
    },
    fr: {
      title: 'Redéfinissez votre confort',
      imageAlt: 'Couple se relaxant confortablement sur un matelas',
      'rating.text': 'Plus de 1 500 avis 5 étoiles !',
      cta: 'Je veux mon matelas',
    },
  },
} satisfies I18nBundle;
