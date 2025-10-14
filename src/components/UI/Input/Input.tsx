'use client'

import React from 'react'
import styles from './Input.module.css'
import { InputProps } from './types'
import clsx from 'clsx'

const Input: React.FC<InputProps> = ({
  className,
  type = 'text',
  size = 'medium',
  ...props
}) => {
  return (
    <input
      type={type}
      className={clsx(
        styles.input,
        styles[size],
        className
      )}
      {...props}
    />
  )
}

export default Input
