import {readFileSync} from 'fs';
import {resolve} from 'path';
import {Directory, ICmdInput, ICmdIO, ICmdOutput, IFile} from './models';

export const getCmdIOFromFile = (): ICmdIO[] => {
  const rawFileData = readFileSync(resolve(__dirname, './cmds.txt'));
  return rawFileData
    .toString()
    .split('\n')
    .filter(x => !!x)
    .map(stringToCmdIO);
};

export const getIO = (
  isCommand: boolean,
  input: string
): ICmdInput | ICmdOutput => {
  if (isCommand) {
    const cmd = input.slice(2, 4);
    const isCd = cmd === 'cd';
    return {
      command: isCd ? 'change-directory' : 'list-contents',
      toDirectory: isCd ? input.slice(5) : null,
    } as ICmdInput;
  }
  const outputParts = input.split(' ');
  const isDirName = outputParts[0] === 'dir';
  const dirName = isDirName ? outputParts[1] : null;
  const file =
    isDirName === false
      ? ({
          size: +outputParts[0],
          name: outputParts[1],
        } as IFile)
      : null;
  return {
    dirName,
    file,
  } as ICmdOutput;
};

export const stringToCmdIO = (input: string, index: number): ICmdIO => {
  const isCommand = input[0] === '$';
  return {
    isCommand,
    io: getIO(isCommand, input),
    id: index
  } as ICmdIO;
};

export const isCmdIoListContents = (cmd: ICmdIO): boolean =>
  cmd.isCommand && (cmd.io as ICmdInput).command === 'list-contents';
export const isCmdIoChangeDirectory = (cmd: ICmdIO): boolean =>
  cmd.isCommand && (cmd.io as ICmdInput).command === 'change-directory';
export const cdIsUp = (cmd: ICmdInput): boolean => cmd.toDirectory === '..';

export const getHydratedDirectoryMap = (
  ioList: ICmdIO[]
): Array<Directory> => {
  console.time('getHydratedDirectoryMap');
  const directories = [] as Directory[];
  // we know the first command is to enter the top-most directory.
  // All other directories will have parents
  directories.push(new Directory(null, '/', 0));
  let currentDirectory = directories[0];
  try {
    for (let i = 1; i < ioList.length; i++) {
      if (typeof currentDirectory === 'undefined') {
        console.log({ds: directories.values()});
        throw new Error(
          `Current directory cannot be undefined. Prev cmdIO: ${JSON.stringify(
            ioList[i - 1]
          )}`
        );
      }
      const cmd = ioList[i];
      const id = cmd.id;
      if (isCmdIoListContents(cmd)) {
        let indexOfNextIO = i + 1;
        let nextIOIsCommand = ioList[indexOfNextIO].isCommand;
        let nextIO = ioList[indexOfNextIO];
        while (nextIOIsCommand === false) {
          // add files and directories
          const cmdOutput = nextIO.io as ICmdOutput;
          if (cmdOutput.dirName) {
            const newDir = new Directory(currentDirectory, cmdOutput.dirName, id);
            directories.push(newDir);
            currentDirectory.addChild(newDir);
          }
          if (cmdOutput.file) {
            currentDirectory.addFile(cmdOutput.file);
          }
          // update counters and stuff
          indexOfNextIO++;
          nextIO = ioList[indexOfNextIO];
          if (nextIO) {
            nextIOIsCommand = nextIO.isCommand;
          } else {
            // EOF
            break;
          }
        }
        continue;
      }
      if (isCmdIoChangeDirectory(cmd)) {
        const cmdInput = cmd.io as ICmdInput;
        if (cdIsUp(cmdInput)) {
          if (currentDirectory.parentDirectory === null) {
            console.log(currentDirectory, cmdInput);
            throw new Error('Parent directory cannot be null');
          }
          currentDirectory =  currentDirectory.parentDirectory;
          continue;
        }
        if (typeof cmdInput.toDirectory === 'undefined') {
          throw new Error('toDirectory should not be undefined');
        }
        // TODO: this is wrong
        currentDirectory = directories.find(x => x.dirName === cmdInput.toDirectory) as Directory;
        continue;
      }
    }
  } catch (err) {
    console.error(err);
  } finally {
    console.timeEnd('getHydratedDirectoryMap');
  }
  return directories;
};

export const getDirectorySum = (
  directoryMap: Directory[],
): number => {
  const threshold = 100000;
  let sum = 0;
  directoryMap.forEach(dir => {
    const dirSize = dir.getDirectorySize();
    if (dirSize < threshold) {
      sum += dirSize;
    }
  });
  return sum;
};
