import React, { useState } from 'react'
import Button from '../Button/Button'
import styles from './Form.module.css'

const Form = ({
  fields,
  formData,
  onFormChange,
  onSubmit,
  title,
  errors = {},
  submitButtonText = 'Submit',
}) => {
  const [showPassword, setShowPassword] = useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className={styles.formContainer}>
      {title && <h2 className={styles.formTitle}>{title}</h2>}
      <form onSubmit={onSubmit}>
        {fields.map((field) => (
          <div key={field.name} className={styles.formGroup}>
            <label htmlFor={field.name} className={styles.formLabel}>
              {field.label}:
            </label>
            {field.type === 'password' ? (
              <div className={styles.passwordInputWrapper}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id={field.name}
                  name={field.name}
                  placeholder={field.placeholder}
                  value={formData[field.name] || ''}
                  onChange={onFormChange}
                  required={field.required}
                  className={`${styles.formInput} ${
                    errors[field.name] ? styles.inputError : ''
                  }`}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className={styles.passwordToggleBtn}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            ) : (
              <input
                type={field.type}
                id={field.name}
                name={field.name}
                placeholder={field.placeholder}
                value={formData[field.name] || ''}
                onChange={onFormChange}
                required={field.required}
                className={`${styles.formInput} ${
                  errors[field.name] ? styles.inputError : ''
                }`}
              />
            )}
            {errors[field.name] && (
              <span className={`${styles.messageContainer} ${styles.error}`}>
                {errors[field.name]}
              </span>
            )}
          </div>
        ))}
        <div className={styles.formActions}>
          <Button type="submit" text={submitButtonText} variant="primary" />
        </div>
      </form>
    </div>
  )
}

export default Form
