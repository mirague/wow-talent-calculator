interface ClassData {
  id: number
  name: string
  icon: string
  specs: number[]
}

export const classes: ClassData[] = [
  { 
    id: 1,
    name: 'Warrior',
    icon: 'class_warrior',
    specs: [161, 164, 163]
  },
  { 
    id: 2,
    name: 'Paladin',
    icon: 'class_paladin',
    specs: [382, 383, 381]
  },
  { 
    id: 3,
    name: 'Hunter',
    icon: 'class_hunter',
    specs: [361, 363, 362]
  },
  { 
    id: 4,
    name: 'Rogue',
    icon: 'class_rogue',
    specs: [182, 181, 183]
  },
  { 
    id: 5,
    name: 'Priest',
    icon: 'class_priest',
    specs: [201, 202, 203]
  },
  { 
    id: 7,
    name: 'Shaman',
    icon: 'class_shaman',
    specs: [261, 263, 262]
  },
  { 
    id: 8,
    name: 'Mage',
    icon: 'class_mage',
    specs: [81, 41, 61]
  },
  { 
    id: 9,
    name: 'Warlock',
    icon: 'class_warlock',
    specs: [302, 303, 301]
  },
  { 
    id: 11,
    name: 'Druid',
    icon: 'class_druid',
    specs: [283, 281, 282]
  },
]

export const classById: {[key: number]: ClassData} = 
  classes.reduce((previousValue: object, currentValue: ClassData) => {
    return {
      ...previousValue,
      [currentValue.id]: currentValue
    }
  }, {})  

export const classByName: {[key: string]: ClassData} = 
  classes.reduce((previousValue: object, currentValue: ClassData) => {
    return {
      ...previousValue,
      [currentValue.name.toLowerCase()]: currentValue
    }
  }, {})
