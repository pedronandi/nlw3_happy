import path from 'path';
import fs from 'fs';

import Image from '../models/Image';

const deleteFromDisk = async (images: Image[]) => {
  const uploads = path.join(__dirname, '..', '..', 'uploads');

  for (const image of images) {
    fs.unlink(`${uploads}/${image.path}`, (err) => {
      if (err) throw err;
    });
  }
}

export default deleteFromDisk;