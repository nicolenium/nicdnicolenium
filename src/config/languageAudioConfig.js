
export const LANGUAGE_AUDIO_CODES = {
  'English': 'en-US',
  'Spanish': 'es-ES',
  'French': 'fr-FR',
  'German': 'de-DE',
  'Italian': 'it-IT',
  'Portuguese': 'pt-BR',
  'Russian': 'ru-RU',
  'Japanese': 'ja-JP',
  'Chinese': 'zh-CN',
  'Mandarin': 'zh-CN',
  'Korean': 'ko-KR',
  'Arabic': 'ar-SA',
  'Hindi': 'hi-IN',
  'Turkish': 'tr-TR',
  'Dutch': 'nl-NL',
  'Swedish': 'sv-SE',
  'Polish': 'pl-PL',
  'Greek': 'el-GR',
  'Thai': 'th-TH',
  'Vietnamese': 'vi-VN',
  'Indonesian': 'id-ID'
};

export const getLanguageCode = (languageName) => {
  return LANGUAGE_AUDIO_CODES[languageName] || 'en-US';
};
