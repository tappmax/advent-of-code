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
  constructor(
    readonly parentDirectory: Directory | null,
    readonly dirName: string
  ) {}

  public getDirectorySize(): number {
    return this.files
      ?.map(({size}) => size)
      ?.reduce((prev, curr) => (prev += curr), 0);
  }

  public addFile(file: IFile): void {
    this.files.push(file);
  }
}
