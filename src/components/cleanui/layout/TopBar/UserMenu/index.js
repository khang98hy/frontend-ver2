/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, useSelector } from 'react-redux'
import { UserOutlined } from '@ant-design/icons'
import { Menu, Dropdown, Avatar, Badge } from 'antd'
import { Link } from 'react-router-dom'
import styles from './style.module.scss'

const mapStateToProps = ({ user }) => ({ user })

const ProfileMenu = ({ dispatch, user }) => {
  const { role } = useSelector((state) => state.user)
  console.log('🚀 ~ file: index.js:14 ~ ProfileMenu ~ role:', role)
  const logout = (e) => {
    e.preventDefault()
    dispatch({
      type: 'user/LOGOUT',
    })
  }
  const items = [
    {
      key: Math.random(),
      label: (
        <>
          <strong>
            <FormattedMessage id="topBar.profileMenu.hello" />, {user.name || 'Anonymous'}
          </strong>
          <Menu.Divider />
        </>
      ),
    },
    {
      key: Math.random(),
      label: (
        <>
          <strong>
            <FormattedMessage id="topBar.profileMenu.role" />:{' '}
            {user.role.map((item) => item.split('_')[1]).join(', ') || '—'}
          </strong>
          <Menu.Divider />
        </>
      ),
    },
    {
      key: Math.random(),
      label: (
        <>
          <div>
            <strong>
              <FormattedMessage id="topBar.profileMenu.email" />:{' '}
            </strong>
            {user.email || '—'}
          </div>
          <Menu.Divider />
        </>
      ),
    },
    role.includes('ROLE_EMPLOYER') && {
      key: Math.random(),
      label: (
        <Link to="/company-information">
          <i className="fa fa-building-o mr-2" />
          <FormattedMessage id="topBar.profileMenu.editProfileCompany" />
        </Link>
      ),
    },
    {
      key: Math.random(),
      label: (
        <Link to="/personal-information">
          <i className="fe fe-user mr-2" />
          <FormattedMessage id="topBar.profileMenu.editProfile" />
        </Link>
      ),
    },

    {
      key: Math.random(),
      label: (
        <Link to="/change-password">
          <i className="fe fe-lock mr-2" />
          <FormattedMessage id="topBar.profileMenu.changePassword" />
        </Link>
      ),
    },
    {
      key: Math.random(),
      label: (
        <Link to="/" onClick={logout}>
          <i className="fe fe-log-out mr-2" />
          <FormattedMessage id="topBar.profileMenu.logout" />
        </Link>
      ),
    },
  ]
  return (
    <Dropdown menu={{ items }} trigger={['click']}>
      <div className={styles.dropdown}>
        <Avatar className={styles.avatar} shape="circle" size="large" icon={<UserOutlined />} />
      </div>
    </Dropdown>
  )
}

export default connect(mapStateToProps)(ProfileMenu)
