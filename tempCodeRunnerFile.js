function readFilesRecursively(directoryPath, excludeSubfolders = [], excludeExtensions = []) {
    return new Promise((resolve, reject) => {
      fs.readdir(directoryPath, (err, files) => {
        if (err) {
          reject(err);
          return;
        }
  
        const filePromises = files.map((file) => {
          const filePath = path.join(directoryPath, file);
          return new Promise((resolve, reject) => {
            fs.stat(filePath, (err, stats) => {
              if (err) {
                reject(err);
                return;
              }
  
              if (stats.isDirectory()   
   && !excludeSubfolders.includes(path.basename(filePath))) {
                readFilesRecursively(filePath, excludeSubfolders, excludeExtensions)
                  .then((subFiles) => resolve({ folderName: path.basename(filePath), subFiles, fullPath: filePath }))
                  .catch(reject);
              } else if (excludeExtensions.includes(path.extname(filePath))) {
                // Exclude files with specified extensions
                resolve();
              } else {
                resolve(filePath);
              }
            });
          });
        });
  
        Promise.all(filePromises)
          .then((files) => resolve(files))
          .catch(reject);
      });
    });
  }