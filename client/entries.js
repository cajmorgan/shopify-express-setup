const { join } = require('path');
const { readdirSync } = require('fs');

/** This loops through the src folder for the file name. 
 * Make sure to tweak it in case you need it to scan for files nested in subfolders
 */
const path = join(__dirname, 'src');
const files = readdirSync(path).map(file => './client/src/' + file);

module.exports = files;