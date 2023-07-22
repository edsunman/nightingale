import { execSync } from 'child_process'
import { promises as fs } from 'fs'

let args = process.argv.slice(2)
let keepSvelteFile = false

if (args[1] === '--keep') {
    keepSvelteFile = true
}

let res = execSync('npx @threlte/gltf@next ' + args[0] + '.glb -T', {
    cwd: 'static/objects'
}).toString()
console.log(res.toString())

console.log('--')
removeCreatedFiles('static/objects', args[0], keepSvelteFile)

async function deleteFile(filePath) {
    try {
        await fs.unlink(filePath)
        console.log(`Deleted ${filePath}`)
    } catch (error) {
        console.error(`Error trying to delete the file: ${error.message}`)
    }
}

async function removeCreatedFiles(dirPath, fileName, keep) {
    try {
        let files = await fs.readdir(dirPath)
        let filesCount = 0
        let capitalFileName = capitalizeFirstLetter(fileName)
        files.forEach((item) => {
            if (item.endsWith(fileName + '.glb')) {
                deleteFile(dirPath + '/' + item)
                filesCount++
            }
            if (!keep) {
                if (item.endsWith(capitalFileName + '.svelte')) {
                    deleteFile(dirPath + '/' + item)
                    filesCount++
                }
            }
        })
        if (filesCount === 0) {
            console.log('No files to delete')
        }
    } catch (error) {
        console.error(`Error when trying to list files: ${error.message}`)
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
}
