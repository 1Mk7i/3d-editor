'use client'

import React from 'react'
import styles from './Button.module.css'
import { ButtonProps } from './types'
import clsx from 'clsx'

const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary',
  size = 'medium',
  style,
  label,
  onClick,
  children,
  disabled = false,
  fullWidth = false,
  icon,
  type = 'button',
  className
}) => {
  const buttonClasses = clsx(
    styles.button,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    className
  )

  return (
    <button
      type={type}
      className={buttonClasses}
      style={style}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      {label}
      {children}
    </button>
  )
}

export { Button }