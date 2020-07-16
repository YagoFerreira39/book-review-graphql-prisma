const path = require("path");
const getFilename = (filename) => {
  const mainDir = path.dirname(require.main.filename);
  return `${mainDir}/uploads/${filename}`;
};

export { getFilename as default };
