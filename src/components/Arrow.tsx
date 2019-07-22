import './Arrow.scss'
import React, { FC } from 'react'
import classNames from 'classnames'

interface Props {
  from: TalentData
  to: TalentData
}

export const Arrow: FC<Props> = ({ from, to }) => {
  const length = to.row === from.row 
    ? Math.abs(to.col - from.col)
    : to.row - from.row

  const props = {
    'data-col': from.col,
    'data-row': from.row,
    'data-length': length,
  }

  const className = classNames('arrow', {
    'arrow--down': to.row > from.row,
    'arrow--right': to.row === from.row && to.col > from.col,
    'arrow--left': to.row === from.row && to.col < from.col,
    'arrow--right-down': to.row === from.row + 1 && to.col === from.col + 1
  })

  return <div className={className} {...props} />
}