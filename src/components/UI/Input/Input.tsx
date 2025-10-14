'use client'

import React from 'react'
import styles from './Input.module.css'
import { InputProps } from './types'
import clsx from 'clsx'

const Input: React.FC<InputProps> = ({
  className,
  type = 'text',
  size = 'medium',
  error = false,
  icon,
  disabled,
  ...props
}) => {
  return (
    <input
      type={type}
      disabled={disabled}
      className={clsx(
        styles.input,
        styles[size],
        {
          [styles['input-error']]: error,
          [styles['input-disabled']]: disabled,
          [styles['input-icon']]: icon === 'left',
          [styles['input-icon-right']]: icon === 'right',
        },
        className
      )}
      {...props}
    />
  )
}

export default Input
