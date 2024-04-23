export const getIconForFileType = (filename: string | undefined) => {
    if (typeof filename !== 'string' || !filename.trim()) {
        return '🗂️'; // Icône par défaut
    }
    
    const extension = filename.split('.').pop()?.toLowerCase();

    const fileIcons:{ [key: string]: any } = {
      'pdf': '📄',
      'doc': '📄',
      'docx': '📄',
      'xls': '📊',
      'xlsx': '📊',
      'ppt': '📊',
      'pptx': '📊',
      'jpg': '🖼️',
      'jpeg': '🖼️',
      'png': '🖼️',
      'gif': '🖼️',
      'mp4': '🎥',
      'mp3': '🎵',
    };
  
    return fileIcons[extension!] || '🗂️'; // Icône par défaut
};
  