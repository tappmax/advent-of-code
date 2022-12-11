export interface IFile {
  readonly name: string;
  readonly size: number;
}

export interface ICmdIO {
  readonly isCommand: boolean;
  readonly io: ICmdInput | ICmdOutput;
}

export interface ICmdInput {
  readonly command: 'change-directory' | 'list-contents';
  readonly toDirectory?: string;
}

export interface ICmdOutput {
  readonly file?: IFile;
  readonly dirName?: string;
}

export class Directory {
  private files: IFile[] = [];
  private children: Directory[] = [];
  private totalFileSize = 0;

  constructor(
    readonly parentDirectory: Directory | null,
    readonly dirName: string
  ) {}

  public addFile(file: IFile): void {
    this.totalFileSize += file.size;
    this.files.push(file);
  }

  public addChild(child: Directory): void {
    this.children.push(child);
  }

  public getDirectorySize(): number {
    let sum = this.totalFileSize;
    this.children.forEach(child => {
      sum += child.getDirectorySize();
    });
    return sum;
  }
}
