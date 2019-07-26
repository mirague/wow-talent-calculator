interface TalentTree {
  id: number
  name: string // e.g. Affliction
  icon: string
  talents: Talent[]
}

interface SpellData {
  id?: number
  name: string
  rank: number
  icon: string
  description: string
}

interface ClassData {
  id: number
  name: string
  icon: string
  specs: number[]
}

interface TalentData {
  /** ID for the Talent */
  id: number
  /** Row for talent. Starts at 0 */
  row: number
  /** Column for talent. Starts at 0 */
  col: number
  /** Icon */
  icon: string
  /** Array of spell IDs */
  ranks: number[]
  /** Talent dependencies for this talent */
  requires: Array<{
    /** Talent ID */
    id: number
    /** Amount of points required in this talent */
    qty: number
  }>
}

interface Talent {
  name: string
  row: number
  column: number
  type: 'ability' | 'talent'
  ranks: string[]
  prerequisite?: [number, number] | number // [row, column] OR index 
}

type TalentClickHandler = (specId: number, talentId: number, modifier: 1 | -1) => void

type TooltipPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'left' | 'right'