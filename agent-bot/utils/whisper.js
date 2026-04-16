const axios = require('axios');
const FormData = require('form-data');

/**
 * Распознать голосовое сообщение через OpenAI Whisper API
 * @param {Buffer} fileBuffer — OGG-файл
 * @returns {Promise<string>} — распознанный текст
 */
async function transcribeVoice(fileBuffer) {
  const form = new FormData();
  form.append('file', fileBuffer, {
    filename: 'voice.ogg',
    contentType: 'audio/ogg'
  });
  form.append('model', 'whisper-1');
  form.append('language', 'ru');

  const response = await axios.post(
    'https://api.openai.com/v1/audio/transcriptions',
    form,
    {
      headers: {
        ...form.getHeaders(),
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      timeout: 30000
    }
  );

  return response.data.text;
}

module.exports = { transcribeVoice };
