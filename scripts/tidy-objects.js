import { promises as fs } from 'fs'

async function deleteFile(filePath) {
    try {
        await fs.unlink(filePath)
        console.log(`Deleted ${filePath}`)
    } catch (error) {
        console.error(`Got an error trying to delete the file: ${error.message}`)
    }
}

export async function tidyFilesInDir(dirPath, keep) {
    try {
        let files = await fs.readdir(dirPath)
        let filesCount = 0
        files.forEach((item) => {
            console.log(filesCount + ' -> ' + item)
            if(!keep){
                if (!item.endsWith('-transformed.glb')) {
                    deleteFile(dirPath + '/' + item)
                    filesCount++
                }
            } else {
                if (!item.endsWith('-transformed.glb')&&!item.endsWith('.svelte')) {
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

tidyFilesInDir('static/objects')