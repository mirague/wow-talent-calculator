interface TalentTree {
  id: number
  name: string // e.g. Affliction
  icon: string
  talents: Talent[]
}

interface Talent {
  name: string
  row: number
  column: number
  type: 'ability' | 'talent'
  ranks: string[]
  prerequisite?: [number, number] | number // [row, column] OR index 
}

type TalentClickHandler = (talentId, clickType: 'add' | 'remove') => void