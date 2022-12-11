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

export const getIO = (isCommand: boolean, input: string): ICmdInput | ICmdOutput => {
  if (isCommand) {
    const cmd = input.slice(2, 4);
    const isCd = cmd === 'cd';
    return {
      command: isCd ? 'change-directory' : 'list-contents',
      toDirectory: isCd ? input.slice(5) : null
    } as ICmdInput;
  }
  const outputParts = input.split(' ');
  const isDirName = outputParts[0] === 'dir';
  const dirName = isDirName ? outputParts[1] : null;
  const file = isDirName === false
    ? {
      size: +outputParts[0],
      name: outputParts[1]
    } as IFile : null
  return {
    dirName,
    file
  } as ICmdOutput;
};

export const stringToCmdIO = (input: string): ICmdIO => {
  const isCommand = input[0] === '$';
  return {
    isCommand,
    io: getIO(isCommand, input),
  } as ICmdIO;
};

export const isCmdIoListContents = (cmd: ICmdIO): boolean => cmd.isCommand && (cmd.io as ICmdInput).command === 'list-contents';
export const isCmdIoChangeDirectory = (cmd: ICmdIO): boolean => cmd.isCommand && (cmd.io as ICmdInput).command === 'change-directory';
export const cdIsUp = (cmd: ICmdInput): boolean => cmd.toDirectory === '..';

export const getHydratedDirectoryMap = (cmds: ICmdIO[]): ReadonlyMap<string, Directory> => {
  const directoryMap = new Map<string, Directory>();
  // we know the first command is to enter the top-most directory.
  // All other directories will have parents
  directoryMap.set('/', new Directory(null, '/'));
  let currentDirectory = directoryMap.get('/');
  console.time('getHydratedDirectoryMap');
  try {
    for (let i = 1; i < cmds.length; i++) {
      if (typeof currentDirectory === 'undefined') {
        console.log({ds: directoryMap.values()})
        throw new Error(`Current directory cannot be undefined. Prev cmd: ${JSON.stringify(cmds[i-1])}`);
      }
      const cmd = cmds[i];
      if (isCmdIoListContents(cmd)) {
        let indexOfNextCommand = i + 1;
        let nextCmdIsCommand = cmds[indexOfNextCommand].isCommand;
        let nextCmd = cmds[indexOfNextCommand];
        while (nextCmdIsCommand === false) {
          // add files and directories
          const cmdOutput = nextCmd.io as ICmdOutput;
          if (cmdOutput.dirName) {
            directoryMap.set(
              cmdOutput.dirName,
              new Directory(currentDirectory, cmdOutput.dirName)
            );
          }
          if (cmdOutput.file) {
            currentDirectory.addFile(cmdOutput.file);
          }
          // update counters and stuff
          indexOfNextCommand++;
          nextCmd = cmds[indexOfNextCommand];
          if (nextCmd) {
            nextCmdIsCommand = nextCmd.isCommand;
          } else {
            break;
          }
        }
        continue;
      }
      if (isCmdIoChangeDirectory(cmd)) {
        const cmdInput = cmd.io as ICmdInput;
        if (cdIsUp(cmdInput)) {
          if (currentDirectory.parentDirectory === null) {
            throw new Error('Parent directory cannot be null I think');
          }
          const parentDirName = currentDirectory.parentDirectory.dirName;
          currentDirectory = directoryMap.get(parentDirName);
          continue;
        }
        if (typeof cmdInput.toDirectory === 'undefined') {
          throw new Error('toDirectory should not be undefined');
        }
        currentDirectory = directoryMap.get(cmdInput.toDirectory);
        continue;
      }
    }
  } catch (err) {
    console.error(err);
  } finally {
    console.timeEnd('getHydratedDirectoryMap');
  }
  return directoryMap;
}
