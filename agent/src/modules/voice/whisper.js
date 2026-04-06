const { execSync } = require('child_process');
const fs = require('fs');

async function transcribe(audioPath) {
  const outputPath = audioPath + '.txt';
  try {
    execSync(`python3 -c "
from faster_whisper import WhisperModel
model = WhisperModel('base', device='cpu', compute_type='int8')
segments, _ = model.transcribe('${audioPath}', language='ru')
text = ' '.join([s.text for s in segments])
with open('${outputPath}', 'w') as f:
    f.write(text)
"`, { timeout: 30000 });
    const text = fs.readFileSync(outputPath, 'utf-8').trim();
    try { fs.unlinkSync(outputPath); } catch (_) {}
    return text;
  } catch (err) {
    console.error('[VOICE] Whisper error:', err.message);
    return null;
  }
}

module.exports = { transcribe };
