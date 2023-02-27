import type { PhotoModel } from './photos.model'
import photo1 from '@/assets/photos/samples/photo1.png'
import photo2 from '@/assets/photos/samples/photo2.png'
import photo3 from '@/assets/photos/samples/photo3.png'

export const photoFixtures = (): PhotoModel[] => [
  {
    url: photo1,
    line: 1,
  },
  {
    url: photo2,
    line: 2,
  },
  {
    url: photo3,
    line: 3,
  },
]
