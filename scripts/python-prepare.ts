import { resolve, basename, extname, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'fs-extra';
import FastGlob from 'fast-glob';
import buildLog from '../utils/buildLog';

// path relative

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PY_OUTPUT_DIR_NAME = 'markdowns';
const PY_ROOT_DIR = resolve(__dirname, '../src/coding/python');
const PY_OUT_DIR = resolve(PY_ROOT_DIR, PY_OUTPUT_DIR_NAME);
/** get target out directory according to srcPath */
export function getTargetOutDirPath(srcPath: string) {
  // concat sub dirs
  const curRelativeDirPath = relative(PY_ROOT_DIR, dirname(srcPath));
  return resolve(PY_ROOT_DIR, PY_OUTPUT_DIR_NAME, curRelativeDirPath);
}
/** get output file path */
export function getOutputFilePath(srcPath: string) {
  const fileName = basename(srcPath, '.ipynb');
  const outDir = getTargetOutDirPath(srcPath);
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
    const transformedContent = cells.reduce((acc, cur) => {
      acc += `\n${processCell(cur)}`;
      return acc;
    }, '');
    return transformedContent;
  }
  buildLog.fail(`transform failed: ${filePath} not a valid jupyter book file`);
  return '';
}

export async function processFile(srcPath: string): Promise<void> {
  if (isOmitPath(srcPath)) {
    return;
  }
  // process files
  const ext = extname(srcPath);
  const filename = basename(srcPath, ext);
  const curOutDirPath = getTargetOutDirPath(srcPath);
  // make sure dir exists
  fs.ensureDirSync(curOutDirPath);
  if (ext === '.ipynb') {
    const transformedContent = transformJupyterBookFile(srcPath);
    const outputFilePath = getOutputFilePath(srcPath);
    return fs.writeFile(outputFilePath, transformedContent);
  } else {
    return fs.copy(srcPath, resolve(curOutDirPath, `${filename}${ext}`));
  }
}
/**
 * traverse python directory
 */
async function dirWalker(dir: string, taskList: Promise<void>[] = []) {
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
      await dirWalker(curSourcePath, taskList);
      continue;
    }
    taskList.push(processFile(curSourcePath));
  }
  return taskList;
}

async function main() {
  // remove cache
  fs.removeSync(PY_OUT_DIR);

  try {
    const taskList = await dirWalker(PY_ROOT_DIR);
    await Promise.all(taskList);
    buildLog.success('all python-prepare works done!');
  } catch (err) {
    buildLog.fail('python-prepare filed');
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
