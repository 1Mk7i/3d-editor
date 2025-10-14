'use client'

import React from 'react'
import styles from './Collection.module.css'
import { CollectionElementProps } from './types'

const CollectionElement: React.FC<CollectionElementProps> = ({ id, mesh }) => {
  return (
    <div
      className={styles.collectionElement}
      data-id={id}
    >
      <span>{mesh.name || id}</span>
    </div>
  )
}

export { CollectionElement }