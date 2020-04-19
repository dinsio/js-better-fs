# JS-Better-FS

### A better and developer friendly module based on nodejs fs module.

## **Install**

~~~
npm install js-better-fs --save
~~~

or

~~~
yarn add js-better-fs
~~~

## **API**

- getStat - get a stat of given path, based on fs.stat
  - params
    - path - String - a file/directory path
  - return
    - Promise - null or result of fs.stat

- async exists - check if a path exists
  - params
    - path - String - a file/directory path
  - return
    - Boolean - true or false

- async getFileSize - get size of a file
  - params
    - path - String - a file path
  - return
    - Integer - stat.size
  - error
    - not exist - file not exist
    - not a file - the path is a directory

- async isDirectory - check if a path is a directory
  - params
    - path - String - a directory path
  - return
    - Boolean - true or false

- async isFile - check if a path is a file
  - params
    - path - String - a file path
  - return
    - Boolean - true or false

- async createDir - create a directory, if upper dirs does not exist, create them first
  - params
    - path - String - a directory path
  - return
    - Boolean - true or false

- readFile - the same as fs.readFileSync

- async writeFile - the same as fs.writeFile, except this will create upper dirs first.
  - params
    - path - String - a file path
    - buf - Buffer - the buffer to write
  - return
    - Boolean - true or false
  - error
    - create parent directory failed

- async lsDir - list all files and dirs under the given dir
  - params
    - path - String - a directory path
  - return
    - Object - { files: Array[stat], dirs: Array[stat] }
  - error
    - not a directroy
    - not exist

- async rmFile - remove a file
  - params
    - path - String - a file path
  - return
    - Boolean - true or false
  - error
    - not a file
    - not exist

- async rmDirectory - remove a dir along with all files and dirs under that
  - params
    - path - String - a directory path
  - return
    - Boolean - true or false

- rawFS - the ref to nodejs fs module



## Enjoy it :-)