import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'database.json');

// Memory cache to prevent simultaneous write corruptions
let writeLock = false;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function readDB() {
  try {
    const data = await fs.readFile(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading local database:', error);
    return { invitations: [], rsvps: [], wishes: [] };
  }
}

export async function writeDB(data) {
  // Simple retry loop to handle concurrent writes
  while (writeLock) {
    await wait(20);
  }
  
  writeLock = true;
  try {
    await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing to local database:', error);
    throw error;
  } finally {
    writeLock = false;
  }
}
