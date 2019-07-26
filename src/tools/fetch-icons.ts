import fs from 'fs'
import spells from '../data/spells.json'
import { classes } from '../data/classes'
import { talentsById } from '../data/talents'
import request from 'request'

const ICONS_FOLDER = './src/images/icons'
const SIZES = ['medium', 'large']

const onlyUnique = (value, index, self) => self.indexOf(value) === index
const getIcon = (item): string => item.icon
const isSizeMissing = (icon) => (size): boolean => !fs.existsSync(getPath(icon, size))

const getIconNames = (): string[] => {
  return [
    // 'inv_misc_questionmark',
    ...Object.values(spells).map(getIcon),
    ...Object.values(classes).map(getIcon),
    ...Object.values(talentsById).map(getIcon)
  ].filter(onlyUnique)
}

const getMissingIconNames = (): string[] => {
  return getIconNames().filter((icon) => SIZES.some(isSizeMissing(icon)))
}

const getPath = (icon: string, size: string): string => {
  return `${ICONS_FOLDER}/${size}/${icon}.jpg`
}

const getUrl = (icon: string, size: string): string => {
  // Relieve some burden from Wowhead's servers <3
  return `https://wow.zamimg.com/images/wow/icons/${size}/${icon}.jpg`
}

const download = async (uri: string, path: string) => 
  request(uri).pipe(fs.createWriteStream(path))

export const fetchIcons = async () => {
  const icons = getMissingIconNames()
  console.log(`Found ${icons.length} missing icons`)

  icons.forEach((icon) => {
    // Only fetch for missing sizes
    const missingSizes = SIZES.filter(isSizeMissing(icon))

    if (missingSizes.length) {
      console.log(`missing sizes for ${icon}: `, missingSizes)
      
      missingSizes.forEach(size => {
        download(getUrl(icon, size), getPath(icon, size))
      })
    }
  })
}

fetchIcons()