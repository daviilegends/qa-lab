import fs from 'fs';
import path from 'path';

const EVIDENCE_DIR = path.resolve(process.cwd(), 'tests', 'evidence');

export function ensureEvidenceDir() {
  if (!fs.existsSync(EVIDENCE_DIR)) {
    fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
  }
  return EVIDENCE_DIR;
}

function timestamp() {
  const d = new Date();
  return d.toISOString().replace(/[:.]/g, '-');
}

function sanitizeName(name) {
  return name.replace(/[^a-zA-Z0-9-_]/g, '_');
}

export async function saveScreenshot(page, testName, status = 'passed') {
  ensureEvidenceDir();
  const fileName = `POT-${sanitizeName(testName)}-${status}-${timestamp()}.png`;
  const filePath = path.join(EVIDENCE_DIR, fileName);
  await page.screenshot({ path: filePath, fullPage: true });
  return filePath;
}

export function saveJson(obj, prefix = 'order') {
  ensureEvidenceDir();
  const fileName = `${prefix}-${timestamp()}.json`;
  const filePath = path.join(EVIDENCE_DIR, fileName);
  fs.writeFileSync(filePath, JSON.stringify(obj, null, 2), 'utf8');
  return filePath;
}

// New: save screenshot using convention `test_name_date.png`
export async function saveTestScreenshot(page, testName) {
  ensureEvidenceDir();
  const fileName = `${sanitizeName(testName)}-${timestamp()}.png`;
  const filePath = path.join(EVIDENCE_DIR, fileName);
  await page.screenshot({ path: filePath, fullPage: true });
  return filePath;
}

export { EVIDENCE_DIR };
