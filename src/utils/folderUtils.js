export const formatFolderStructure = (structure, level = 0) => {
  if (!structure) return '';
  
  const indent = '  '.repeat(level);
  let output = '';

  if (structure.root) {
    output += `${indent}📁 ${structure.root}\n`;
  }

  if (structure.directories) {
    structure.directories.forEach(dir => {
      output += `${indent}📁 ${dir.name}\n`;
      if (dir.contents) {
        dir.contents.forEach(item => {
          if (typeof item === 'string') {
            output += `${indent}  📄 ${item}\n`;
          } else {
            output += formatFolderStructure(item, level + 1);
          }
        });
      }
    });
  }

  return output;
}; 