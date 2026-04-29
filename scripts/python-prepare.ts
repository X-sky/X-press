import { resolve, basename, extname, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'fs-extra';
import FastGlob from 'fast-glob';
import buildLog from '../utils/buildLog';

// path relative

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export const PY_OUTPUT_DIR_NAME = 'markdowns';
const PY_ROOT_DIR = resolve(__dirname, '../src/coding/python');
const PY_ZH_ROOT_DIR = resolve(__dirname, '../src/zh/coding/python');
const PY_OUT_DIR = resolve(PY_ROOT_DIR, PY_OUTPUT_DIR_NAME);
const PY_ZH_OUT_DIR = resolve(PY_ZH_ROOT_DIR, PY_OUTPUT_DIR_NAME);
/** get target out directory according to srcPath and its root */
export function getTargetOutDirPath(srcPath: string, rootDir: string = PY_ROOT_DIR) {
  // concat sub dirs
  const curRelativeDirPath = relative(rootDir, dirname(srcPath));
  return resolve(rootDir, PY_OUTPUT_DIR_NAME, curRelativeDirPath);
}
/** get output file path */
export function getOutputFilePath(srcPath: string, rootDir: string = PY_ROOT_DIR) {
  const fileName = basename(srcPath, '.ipynb');
  const outDir = getTargetOutDirPath(srcPath, rootDir);
  return resolve(outDir, `${fileName}.md`);
}
/** ignore this file or directory */
const isOmitPath = (p: string) =>
  ['__pycache__', PY_OUTPUT_DIR_NAME, 'README', 'readme']
    .map((name) => name.toLowerCase())
    .some((name) => p.toLowerCase().includes(name));

// code process

const concatLines = (lines: string[]) =>
  lines.reduce((acc, line) => {
    acc += line;
    return acc;
  }, '');

const generateCodeBlock = (str: string) => `
::: details Code Example
\`\`\`python
${str}
\`\`\`
:::
`;

/** part of fields of ipynb cell info */
interface PartialIpynbCellInfo {
  cell_type: 'markdown' | 'code';
  source: string[];
}
/** process jupyter book cell */
function processCell(cell: PartialIpynbCellInfo) {
  const blockStr = concatLines(cell.source);
  if (cell.cell_type === 'markdown') {
    return blockStr;
  } else {
    // wrap default as python code in code block
    return generateCodeBlock(blockStr);
  }
}
/** process jupyter book and write to destination */
export function transformJupyterBookFile(filePath: string): string {
  const content = fs.readJSONSync(filePath);
  if (Array.isArray(content?.cells)) {
    const cells: PartialIpynbCellInfo[] = content.cells || [];
    const transformedContent = cells
      .reduce((acc, cur) => {
        acc += `\n${processCell(cur)}`;
        return acc;
      }, '')
      .slice(1);
    return transformedContent;
  }
  buildLog.fail(`transform failed: ${filePath} not a valid jupyter book file`);
  return '';
}

export async function processFile(srcPath: string, rootDir: string = PY_ROOT_DIR): Promise<void> {
  if (isOmitPath(srcPath)) {
    return;
  }
  // process files
  const curOutDirPath = getTargetOutDirPath(srcPath, rootDir);
  // make sure dir exists
  fs.ensureDirSync(curOutDirPath);
  const transformedContent = transformJupyterBookFile(srcPath);
  const outputFilePath = getOutputFilePath(srcPath, rootDir);
  return fs.writeFile(outputFilePath, transformedContent);
}
/**
 * traverse python directory
 */
async function dirWalker(dir: string, rootDir: string, taskList: Promise<void>[] = []) {
  const paths = await FastGlob('*', {
    cwd: dir,
    absolute: true,
    deep: 1,
    // include dirs
    onlyFiles: false
  });

  // walk files and dirs
  for (const i in paths) {
    const curSourcePath = paths[i];
    if (isOmitPath(curSourcePath)) {
      // ignore this file or dir
      continue;
    }

    if (fs.statSync(curSourcePath).isDirectory()) {
      // recursively walk sub dirs
      await dirWalker(curSourcePath, rootDir, taskList);
      continue;
    } else {
      const ext = extname(curSourcePath);
      if (ext === '.ipynb') {
        taskList.push(processFile(curSourcePath, rootDir));
      }
    }
  }
  return taskList;
}

async function main() {
  // remove cache for both locales
  fs.removeSync(PY_OUT_DIR);
  fs.removeSync(PY_ZH_OUT_DIR);

  try {
    const enTasks = await dirWalker(PY_ROOT_DIR, PY_ROOT_DIR);
    const zhTasks = await dirWalker(PY_ZH_ROOT_DIR, PY_ZH_ROOT_DIR);
    await Promise.all([...enTasks, ...zhTasks]);
    buildLog.success('all python-prepare works done!');
  } catch (err) {
    buildLog.fail('python-prepare failed');
  }
}
const executedFromScript = () => {
  const strippedFileName = __filename.replace(extname(__filename), '');
  const possibleArgs = [__filename, strippedFileName];
  return possibleArgs.includes(process.argv[1]);
};
if (executedFromScript()) {
  // only execute when module is called directly
  main();
}
