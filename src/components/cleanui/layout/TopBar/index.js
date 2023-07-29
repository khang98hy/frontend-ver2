/* eslint-disable no-unused-vars */
import React from 'react'
import { Button } from 'antd'
import { useNavigate, withRouter } from 'react-router-dom'
import { history } from 'index'
import { connect } from 'react-redux'
import SearchForm from 'components/SearchForm/SearchForm'
import UserMenu from './UserMenu'
import style from './style.module.scss'

const mapStateToProps = ({ user }) => ({
  user,
  authorized: user.authorized,
})

const TopBar = ({ authorized, user }) => {
  return (
    <div className={style.topbar}>
      {!authorized ? (
        <>
          <div className="mr-4 d-none d-sm-block">
            <Button type="primary" shape="round" onClick={() => history.push('/auth/login')}>
              Đăng nhập
            </Button>
          </div>
          <div className="mr-4 d-none d-sm-block">
            <Button type="primary" shape="round" onClick={() => history.push('/auth/register')}>
              Đăng ký
            </Button>
          </div>
        </>
      ) : null}

      {authorized ? (
        <div className="">
          <UserMenu />
        </div>
      ) : null}
    </div>
  )
}

export default withRouter(connect(mapStateToProps)(TopBar))
