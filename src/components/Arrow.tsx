import './Arrow.scss'
import React, { FC } from 'react'
import classNames from 'classnames'

interface Props {
  from: TalentData
  to: TalentData
  active?: boolean
}

const getDirection = (from: TalentData, to: TalentData): string => {
  if (to.row > from.row && to.col === from.col) {
    return 'down'
  } else if (to.row === from.row && to.col > from.col) {
    return 'right'
  } else if (to.row === from.row && to.col < from.col) {
    return 'left'
  } else if (to.row > from.row && to.col === from.col + 1) {
    return 'right-down'
  } else if (to.row > from.row && to.col === from.col - 1) {
    return 'left-down'
  }
  throw new Error(`Could not determine direction from (row ${from.row}, col ${from.col}) to (row ${to.row}, col ${to.col})`)
}

export const Arrow: FC<Props> = ({ from, to, active = false }) => {
  const props = {
    'data-col': from.col,
    'data-row': from.row,
  }

  const height = to.row - from.row
  const width = Math.abs(to.col - from.col)
  
  const dir = getDirection(from, to)
  if (dir === 'right-down' || dir === 'left-down') {
    props['data-height'] = height
    props['data-width'] = width
  } else {
    props['data-length'] = to.row === from.row ? width : height
  }

  const className = classNames('arrow', `arrow--${dir}`, {
    'arrow--active': active,
  })

  return <div className={className} {...props} />
}