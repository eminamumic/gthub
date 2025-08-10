import React from 'react'
import Button from '../Button/Button'
import styles from './Table.module.css'

const Table = ({ data, columns, actions }) => {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index}>{column.header}</th>
            ))}
            {actions && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((item, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column, colIndex) => (
                <td key={colIndex} data-label={column.header}>
                  {column.format
                    ? column.format(item[column.accessor])
                    : item[column.accessor]}
                </td>
              ))}
              {actions && (
                <td className={styles.actionsColumn} data-label="Actions">
                  {actions.map((action, actionIndex) => (
                    <Button
                      key={actionIndex}
                      onClick={() => action.handler(item)}
                      variant={action.variant}
                      text={action.text}
                    />
                  ))}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Table
