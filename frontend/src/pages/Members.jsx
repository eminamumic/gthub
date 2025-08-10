import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import Header from '../components/Header/Header'
import Button from '../components/Button/Button'
import Table from '../components/Table/Table'
import MemberModal from '../components/MemberModal/MemberModal'
import styles from '../styles/members.module.css'

import {
  validateForm,
  handleAddEditSubmit,
  handleDelete,
  handleExport,
  formatDate,
} from '../utils/membersUtils'

function Members() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterExpiring, setFilterExpiring] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentMember, setCurrentMember] = useState(null)
  const [formErrors, setFormErrors] = useState({})

  const fetchMembers = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const response = await axios.get('/api/members', {
        params: {
          search: searchTerm,
          expiringSoon: filterExpiring,
        },
      })
      setMembers(response.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching members.')
    } finally {
      setLoading(false)
    }
  }, [searchTerm, filterExpiring])

  useEffect(() => {
    fetchMembers()
  }, [fetchMembers])

  const openAddModal = () => {
    setCurrentMember({
      first_name: '',
      last_name: '',
      date_of_birth: '',
      email: '',
      phone: '',
      faculty: '',
      membership_start_date: '',
      membership_expiry_date: '',
    })
    setFormErrors({})
    setIsModalOpen(true)
  }

  const openEditModal = (member) => {
    setCurrentMember({
      ...member,
      date_of_birth: member.date_of_birth
        ? new Date(member.date_of_birth).toISOString().split('T')[0]
        : '',
      membership_start_date: member.membership_start_date
        ? new Date(member.membership_start_date).toISOString().split('T')[0]
        : '',
      membership_expiry_date: member.membership_expiry_date
        ? new Date(member.membership_expiry_date).toISOString().split('T')[0]
        : '',
    })
    setFormErrors({})
    setIsModalOpen(true)
  }

  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'First Name', accessor: 'first_name' },
    { header: 'Last Name', accessor: 'last_name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Phone', accessor: 'phone' },
    { header: 'Faculty', accessor: 'faculty' },
    { header: 'Date of Birth', accessor: 'date_of_birth', format: formatDate },
    {
      header: 'Membership From',
      accessor: 'membership_start_date',
      format: formatDate,
    },
    {
      header: 'Membership Until',
      accessor: 'membership_expiry_date',
      format: formatDate,
    },
  ]

  const actions = [
    {
      text: 'Edit',
      variant: 'edit',
      handler: openEditModal,
    },
    {
      text: 'Delete',
      variant: 'delete',

      handler: (member) => handleDelete(member.id, fetchMembers, setError),
    },
  ]

  if (loading)
    return <p className={styles.loadingMessage}>Loading members...</p>
  if (error) return <p className={styles.errorMessage}>{error}</p>

  return (
    <div className={styles.membersContainer}>
      <Header title="Member Management" variant="primary"></Header>

      <div className={styles.controls}>
        <input
          type="text"
          placeholder="Search by name, last name, email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={filterExpiring}
            onChange={(e) => setFilterExpiring(e.target.checked)}
          />
          Membership expiring (30 days)
        </label>
        <Button onClick={openAddModal} variant="add" text="Add New Member" />
        <Button
          onClick={() => handleExport(setError)}
          variant="export"
          text="Export to CSV"
        />
      </div>

      {members.length === 0 ? (
        <p className={`${styles.messageContainer} ${styles.error}`}>
          No members found.
        </p>
      ) : (
        <Table data={members} columns={columns} actions={actions} />
      )}

      <MemberModal
        isModalOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentMember={currentMember}
        setCurrentMember={setCurrentMember}
        formErrors={formErrors}
        onSubmit={(e) =>
          handleAddEditSubmit(
            e,
            currentMember,
            validateForm,
            fetchMembers,
            setIsModalOpen,
            setFormErrors,
            setError
          )
        }
      />
    </div>
  )
}

export default Members
