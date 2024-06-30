                                        
const fs = require('fs');
const path = require('path');

async function loadFiles(dirName) {
  console.log("Running loadFiles");

  const directoryPath = path.join(process.cwd(), dirName.toLowerCase());
  // console.log(`Directory Path: ${directoryPath}`);

  try {
    const files = await getFiles(directoryPath);
    files.forEach((file) => delete require.cache[require.resolve(file)]);
    // console.log(`Files found: ${files.length}`, files);
    return files;
  } catch (err) {
    // console.error(`Error loading files from ${dirName}:`, err);
    return [];
  }
}

function getFiles(dir, files_ = []) {
  try {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const name = path.join(dir, file);
      if (fs.statSync(name).isDirectory()) {
        getFiles(name, files_);
      } else if (file.endsWith('.js')) {
        files_.push(name);
      }
    }
  } catch (err) {
    console.error(`Error reading directory ${dir}:`, err);
  }
  return files_;
}

module.exports = { loadFiles };

