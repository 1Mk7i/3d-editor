'use client'

import React from 'react'
import { CSSProperties, ReactNode } from 'react'
import styles from './Button.module.css'

type ButtonProps = {
  style?: CSSProperties
  label?: string
  onClick?: () => void
  children?: ReactNode
}

const Button: React.FC<ButtonProps> = ({ style, label, onClick, children }) => {
  return (
    <button className={styles.button} style={style} onClick={onClick}>
      {label}
      {children}
    </button>
  )
}

export default Button