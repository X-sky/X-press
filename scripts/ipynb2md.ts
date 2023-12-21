import { resolve, basename } from 'node:path';
import { readJSONSync, writeFile, removeSync, mkdirSync } from 'fs-extra';
import FastGlob from 'fast-glob';
import buildLog from '../utils/buildLog';

const concatLines = (lines: string[]) =>
  lines.reduce((acc, line) => {
    acc += line;
    return acc;
  }, '');

const generateCodeBlock = (str: string) => `
\`\`\`python
${str}
\`\`\`
`;

/** part of fields of ipynb cell info */
interface PartialIpynbCellInfo {
  cell_type: 'markdown' | 'code';
  source: string[];
}
function processCell(cell: PartialIpynbCellInfo) {
  const blockStr = concatLines(cell.source);
  if (cell.cell_type === 'markdown') {
    return blockStr;
  } else {
    // default as python code
    return generateCodeBlock(blockStr);
  }
}
async function ipynb2md() {
  buildLog.info('prepare ipynb markdowns...');
  const rootDir = resolve(__dirname, '../src/coding/python');
  const outputDir = resolve(rootDir, 'markdowns');
  // remove cache
  removeSync(outputDir);
  mkdirSync(outputDir);
  const sourceFiles = await FastGlob('*.ipynb', {
    cwd: rootDir,
    onlyFiles: true,
    absolute: true
  });
  const taskList: Promise<void>[] = [];
  sourceFiles.forEach((filePath) => {
    const content = readJSONSync(filePath);
    const fileName = basename(filePath, '.ipynb');
    if (Array.isArray(content?.cells)) {
      const outputFileName = resolve(outputDir, `${fileName}.md`);
      const cells: PartialIpynbCellInfo[] = content.cells || [];
      const transformedContent = cells.reduce((acc, cur) => {
        acc += `\n${processCell(cur)}`;
        return acc;
      }, '');
      taskList.push(writeFile(outputFileName, transformedContent));
    }
  });
  Promise.all(taskList)
    .then(() => {
      buildLog.success('all .ipynb files transformed into markdowns!');
    })
    .catch(() => {
      buildLog.fail('.ipynb files transformation fails');
    });
}

ipynb2md();
