import { customFile } from '@/store/uploadsContext';
import Image from 'next/image';
import React from 'react';

// Fonction pour déterminer le composant en fonction du type de fichier
const getFileTypeComponent = (file:customFile) => {
  const { url, name } = file;

  // Obtenir l'extension du fichier
  const fileExtension = name.split('.').pop()?.toLowerCase();

  // Afficher en fonction de l'extension
  switch (fileExtension) {
    case 'pdf':
      return <iframe width="100%" height="600" src={url} title={name} />;

    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      return <img src={url} alt={name} className='m-auto' style={{ width: '90%', height: '100%' }} />;

    case 'mp4':
    case 'webm':
    case 'ogg':
      return (
        <video controls width="100%" height="600">
          <source src={url} type={`video/${fileExtension}`} />
          Your browser does not support the video tag.
        </video>
      );

    case 'mp3':
    case 'wav':
    case 'aac':
      return (
        <audio controls className='m-auto'>
          <source src={url} type={`audio/${fileExtension}`} />
          Your browser does not support the audio tag.
        </audio>
      );

    case 'txt':
      return (
        <div>
          <pre>
            <a href={url} download>
              Download the text file
            </a>
          </pre>
        </div>
      );

    case 'xlsx':
    case 'xls':
      return (
        <div>
          <p>This is an Excel file. Download it <a href={url}>here</a>.</p>
        </div>
      );

    default:
      return (
        <div>
          <p>Unsupported file type. Download it <a href={url}>here</a>.</p>
        </div>
      );
  }
};

export default getFileTypeComponent;
