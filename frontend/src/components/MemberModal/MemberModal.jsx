import React from 'react'
import Header from '../Header/Header'
import Button from '../Button/Button'
import styles from './MemberModal.module.css'

const MemberModal = ({
  isModalOpen,
  onClose,
  currentMember,
  setCurrentMember,
  formErrors,
  onSubmit,
}) => {
  if (!isModalOpen) return null

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <Header
          title={currentMember.id ? 'Edit Member' : 'Add New Member'}
          variant="form"
        ></Header>

        <form onSubmit={onSubmit}>
          <div className={`${styles.formGroup} ${styles.modal}`}>
            <label htmlFor="first_name">First Name:</label>
            <input
              type="text"
              id="first_name"
              value={currentMember.first_name}
              onChange={(e) =>
                setCurrentMember({
                  ...currentMember,
                  first_name: e.target.value,
                })
              }
            />
            {formErrors.first_name && (
              <span className={`${styles.messageContainer} ${styles.error}`}>
                {formErrors.first_name}
              </span>
            )}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="last_name">Last Name:</label>
            <input
              type="text"
              id="last_name"
              value={currentMember.last_name}
              onChange={(e) =>
                setCurrentMember({
                  ...currentMember,
                  last_name: e.target.value,
                })
              }
            />
            {formErrors.last_name && (
              <span className={`${styles.messageContainer} ${styles.error}`}>
                {formErrors.last_name}
              </span>
            )}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={currentMember.email}
              onChange={(e) =>
                setCurrentMember({
                  ...currentMember,
                  email: e.target.value,
                })
              }
            />
            {formErrors.email && (
              <span className={`${styles.messageContainer} ${styles.error}`}>
                {formErrors.email}
              </span>
            )}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="phone">Phone:</label>
            <input
              type="text"
              id="phone"
              value={currentMember.phone}
              onChange={(e) =>
                setCurrentMember({
                  ...currentMember,
                  phone: e.target.value,
                })
              }
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="faculty">Faculty:</label>
            <input
              type="text"
              id="faculty"
              value={currentMember.faculty}
              onChange={(e) =>
                setCurrentMember({
                  ...currentMember,
                  faculty: e.target.value,
                })
              }
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="date_of_birth">Date of Birth:</label>
            <input
              type="date"
              id="date_of_birth"
              value={currentMember.date_of_birth}
              onChange={(e) =>
                setCurrentMember({
                  ...currentMember,
                  date_of_birth: e.target.value,
                })
              }
            />
            {formErrors.date_of_birth && (
              <span className={`${styles.messageContainer} ${styles.error}`}>
                {formErrors.date_of_birth}
              </span>
            )}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="membership_start_date">Membership From:</label>
            <input
              type="date"
              id="membership_start_date"
              value={currentMember.membership_start_date}
              onChange={(e) =>
                setCurrentMember({
                  ...currentMember,
                  membership_start_date: e.target.value,
                })
              }
            />
            {formErrors.membership_start_date && (
              <span className={`${styles.messageContainer} ${styles.error}`}>
                {formErrors.membership_start_date}
              </span>
            )}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="membership_expiry_date">Membership Until:</label>
            <input
              type="date"
              id="membership_expiry_date"
              value={currentMember.membership_expiry_date}
              onChange={(e) =>
                setCurrentMember({
                  ...currentMember,
                  membership_expiry_date: e.target.value,
                })
              }
            />
            {formErrors.membership_expiry_date && (
              <span className={`${styles.messageContainer} ${styles.error}`}>
                {formErrors.membership_expiry_date}
              </span>
            )}
          </div>
          <div className={styles.modalActions}>
            <Button variant="add" text={currentMember.id ? 'Update' : 'Add'} />
            <Button onClick={onClose} variant="cancel" text="Cancel" />
          </div>
        </form>
      </div>
    </div>
  )
}

export default MemberModal
