import fs from 'fs';
import path from 'path';

import mkdirp from 'mkdirp';

import config from '../../gameconfig';

/**
 * @param vpkTree - древо ресурсов vpk в человекочитаемом виде {fileName => fileInfo} (Типизацию не хочу завозить)
 * @param baseArchiveName - без постфикса, расширения, но с путем
 */
const unpack = (vpkTree, baseArchiveName) => {
    Object.keys(vpkTree).forEach((fileName) => {
        const fileInfo = vpkTree[fileName];
        const archiveName = baseArchiveName + '_' + fileInfo.archiveIndex.toString().padStart(3, '0') + '.vpk';

        const archiveContent = fs.readFileSync(archiveName);
        const fileContent = archiveContent.slice(fileInfo.archiveOffset, fileInfo.archiveOffset + fileInfo.fileLength);

        const resultAbsoluteFileName = path.join(__dirname, config.server_resources, fileName);
        const resultPath = path.dirname(resultAbsoluteFileName);
        mkdirp.sync(resultPath);
        fs.writeFileSync(resultAbsoluteFileName, fileContent);
    });
};

export { unpack };