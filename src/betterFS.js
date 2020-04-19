/**
 * 自己包装的 fs 模块，使之支持 await 并且更好用
 */

const fs = require('fs')
const path = require('path')

/**
 * 读取路径信息(可能是文件也可能是目录)
 * @param {string} path 路径
 */
function getStat(aPath){
    return new Promise((resolve, reject) => {
        fs.stat(aPath, (err, stats) => {
            if (err){
                resolve(null)
            }
            else {
                resolve(stats)
            }
        })
    })
}

/**
 * 路径是否存在
 * @param {string} aPath 要判断路径
 */
async function exists(aPath) {
    return (await getStat(aPath)) !== null
}

/**
 * 获得文件大小
 * @param {string} fPath 文件路径
 */
async function getFileSize(fPath){
    let stat = await getStat(fPath)
    if (stat === null) throw new Error('not exist')
    if (stat.isFile()) {
        return stat.size
    }
    else throw new Error('not a file')
}

/**
 * 判断一个路径是否目录
 * @param {string} aPath 要判断的路径
 */
async function isDirectory(aPath) {
    let stat = await getStat(aPath)
    if (stat && stat.isDirectory()) return true
    else return false
}

/**
 * 判断一个路径是否文件
 * @param {string} aPath 要判断的路径
 */
async function isFile(aPath) {
    let stat = await getStat(aPath)
    if (stat && stat.isFile()) return true
    else return false
}

/**
 * 创建目录
 * @param {string} dir 目录
 */
async function createDir(dir){
    // 先判断是否已经存在
    if (await isDirectory(dir)) return true
    else {
        // 不存在则创建
        // 创建之前首先要确保上级目录存在
        let pDir = path.dirname(dir)
        await createDir(pDir)
        // 创建目录
        fs.mkdirSync(dir)
        return true
    }
}

/**
 * 将 buffer 写入文件
 * @param {string} fPath 要写入的文件路径
 * @param {buffer} fBuf 要写入的内容Buffer
 */
async function writeFile(fPath, fBuf) {
    // 首先要确保上级目录存在
    let pDir = path.dirname(fPath)
    let pStat = await createDir(pDir)
    if (pStat) {
        fs.writeFileSync(fPath, fBuf)
        return true
    }
    else throw new Error('create parent directory ' + pDir + ' failed')
}

/**
 * 获取指定目录下的所有子目录及文件
 * @param {string} dPath 目标目录
 */
async function lsDir(dPath) {
    if (await exists(dPath)) {
        if (await isDirectory(dPath)) {
            let files = []
            let dirs = []
            let items = fs.readdirSync(dPath)
            for (let i=0; i<items.length; i++) {
                let itemName = items[i]
                let stat = await getStat(path.join(dPath,itemName))
                if (stat.isFile()) files.push(itemName)
                if (stat.isDirectory()) dirs.push(itemName)
            }
            return {
                files: files,
                dirs: dirs
            }
        }
        else throw new Error('not a directory')
    }
    else throw new Error('not exist')
}

/**
 * 删除文件
 * @param {string} fPath 文件路径
 */
async function rmFile(fPath) {
    if (await exists(fPath)) {
        if (await isFile(fPath)) {
            fs.unlinkSync(fPath)
            return true
        }
        else throw new Error('not a file')
    }
    else throw new Error('not exist')
}

/**
 * 删除目录及其下所有文件和子目录
 * @param {string} dPath 文件夹路径
 */
async function rmDirectory(dPath) {
    // 递归删掉其下每一个文件和目录
    let ls = await lsDir(dPath)
    let files = ls.files
    for (let i=0; i<files.length; i++) {
        fs.unlinkSync(path.join(dPath,files[i]))
    }
    let dirs = ls.dirs
    for (let i=0; i<dirs.length; i++) {
        await rmDirectory(path.join(dPath,dirs[i]))
    }
    // 然后删掉自身
    fs.rmdirSync(dPath)
    return true
}

module.exports = {
    getStat,
    exists,
    getFileSize,
    isDirectory,
    isFile,
    createDir,
    readFile: fs.readFileSync,
    writeFile,
    lsDir,
    rmFile,
    rmDirectory,
    rawFS : fs
}