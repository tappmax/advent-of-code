import { expect } from 'chai';
import { getHydratedDirectoryMap, getIO, stringToCmdIO } from '../functions';
import { main } from '../index';
import { ICmdOutput } from '../models';

describe(`Test`, () => {
  it(`shouldn't blow up`, () => {
    expect(main()).to.equal(0);
  });
  describe(`getIO`, () => {
    it(`should get cmd io as an output with files`, () => {
      const actual = getIO(false, '1234 test.cpp') as ICmdOutput;
      expect(1234).to.equal(actual.file?.size);
      expect('test.cpp').to.equal(actual.file?.name);
    });
  });
  describe(`Directory`, () => {
    it(`should get the directory file size sum`, () => {
      const testData = ''+
        '$ cd / \n'+
        '$ ls\n'+
        'dir a\n'+
        '14848514 b.txt\n'+
        '8504156 c.dat\n'+
        'dir d\n'+
        '$ cd a\n'+
        '$ ls\n'+
        'dir e\n'+
        '29116 f\n'+
        '2557 g\n'+
        '62596 h.lst\n'+
        '$ cd e\n'+
        '$ ls\n'+
        '584 i\n'+
        '$ cd ..\n'+
        '$ cd ..\n'+
        '$ cd d\n'+
        '$ ls\n'+
        '4060174 j\n'+
        '8033020 d.log\n'+
        '5626152 d.ext\n'+
        '7214296 k\n';

      const directoryMap = getHydratedDirectoryMap(
        testData.split('\n')
          .filter(x => !!x)
          .map(stringToCmdIO)
      );
      
      const expectations = new Map<string, number>([
        ['/', 48381165],
        ['e', 584],
        ['a', 94853],
        ['d', 24933642],
      ]);
      expectations.forEach((expected, dirName) => {
        expect(expected).to.equal(directoryMap.get(dirName)?.getDirectorySize());
      });
    });
  });
});
