const fs = require('fs');
const path = require('path');

const dataPath = process.env.AGENT_DATA_PATH || '/home/activeplay/activeplay-store/agent/data';

function readJSON(filename) {
  try {
    const filePath = path.join(dataPath, filename);
    if (!fs.existsSync(filePath)) return null;
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error(`[Бот] Ошибка чтения ${filename}: ${err.message}`);
    return null;
  }
}

function getRates() {
  return readJSON('rates.json');
}

function getAnchors() {
  return readJSON('anchors.json');
}

function getGames() {
  return readJSON('games.json');
}

function writeJSON(filename, data) {
  try {
    const filePath = path.join(dataPath, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error(`[Бот] Ошибка записи ${filename}: ${err.message}`);
    return false;
  }
}

function writeAnchors(data) {
  // Бэкап перед записью
  const anchors = getAnchors();
  if (anchors) {
    writeJSON('anchors.backup.json', anchors);
  }
  data.updatedAt = new Date().toISOString();
  return writeJSON('anchors.json', data);
}

function restoreAnchorsBackup() {
  const backup = readJSON('anchors.backup.json');
  if (!backup) return false;
  return writeJSON('anchors.json', backup);
}

function getModes() {
  const modes = readJSON('modes.json');
  if (modes) return modes;
  // Дефолтные режимы
  const defaults = {
    rates: 'auto',
    prices: 'auto',
    gameDeals: 'auto',
    subDeals: 'approval',
    news: 'approval',
    lifecycle: 'approval',
    guides: 'approval'
  };
  writeJSON('modes.json', defaults);
  return defaults;
}

function writeModes(data) {
  return writeJSON('modes.json', data);
}

module.exports = {
  getRates, getAnchors, getGames, readJSON,
  writeJSON, writeAnchors, restoreAnchorsBackup,
  getModes, writeModes
};
