import { resolve, basename, extname, dirname } from 'node:path';
import {
  readJSONSync,
  writeFile,
  removeSync,
  statSync,
  ensureDirSync,
  copy
} from 'fs-extra';
import FastGlob from 'fast-glob';
import buildLog from '../utils/buildLog';
import { relative } from 'node:path';

// path relative

const PY_OUTPUT_DIR_NAME = 'markdowns';
const PY_ROOT_DIR = resolve(__dirname, '../src/coding/python');
const PY_OUT_DIR = resolve(PY_ROOT_DIR, PY_OUTPUT_DIR_NAME);

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
async function transformJupyterBookFile({
  filePath,
  outDir
}: {
  /** ipynb file path */
  filePath: string;
  /** output directory */
  outDir: string;
}): Promise<void> {
  const content = readJSONSync(filePath);
  const fileName = basename(filePath, '.ipynb');
  if (Array.isArray(content?.cells)) {
    const outputFileName = resolve(outDir, `${fileName}.md`);
    const cells: PartialIpynbCellInfo[] = content.cells || [];
    const transformedContent = cells.reduce((acc, cur) => {
      acc += `\n${processCell(cur)}`;
      return acc;
    }, '');
    return writeFile(outputFileName, transformedContent);
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

  /** ignore this file or directory */
  const isOmitPath = (p: string) =>
    ['__pycache__', PY_OUTPUT_DIR_NAME, 'README', 'readme']
      .map((name) => name.toLowerCase())
      .some((name) => p.toLowerCase().includes(name));

  // walk files and dirs
  for (const i in paths) {
    const curSourcePath = paths[i];
    if (isOmitPath(curSourcePath)) {
      // ignore this file or dir
      continue;
    }
    if (statSync(curSourcePath).isDirectory()) {
      // recursively walk sub dirs
      await dirWalker(curSourcePath, taskList);
      continue;
    }
    // process files
    const ext = extname(curSourcePath);
    const filename = basename(curSourcePath, ext);
    // concat sub dirs
    const curRelativeDirPath = relative(PY_ROOT_DIR, dirname(curSourcePath));
    const curOutDirPath = resolve(
      PY_ROOT_DIR,
      PY_OUTPUT_DIR_NAME,
      curRelativeDirPath
    );
    // make sure dir exists
    ensureDirSync(curOutDirPath);
    if (ext === '.ipynb') {
      taskList.push(
        transformJupyterBookFile({
          filePath: curSourcePath,
          outDir: curOutDirPath
        })
      );
    } else {
      taskList.push(
        copy(curSourcePath, resolve(curOutDirPath, `${filename}${ext}`))
      );
    }
  }
  return taskList;
}

async function main() {
  // remove cache
  removeSync(PY_OUT_DIR);

  try {
    const taskList = await dirWalker(PY_ROOT_DIR);
    await Promise.all(taskList);
    buildLog.success('all python-prepare works done!');
  } catch (err) {
    buildLog.fail('python-prepare filed');
  }
}

main();
