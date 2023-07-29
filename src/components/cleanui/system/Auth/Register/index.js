/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Button, Image, Divider } from 'antd'
import { Link } from 'react-router-dom'
import { useForm } from 'antd/lib/form/Form'
import style from '../style.module.scss'
import JobSeekerRegisterForm from './JobSeekerRegisterForm'
import CompanyRegisterForm from './EmployerRegisterForm'

const Register = () => {
  const dispatch = useDispatch()
  const [isRegisterJobSeeker, setIsRegisterJobSeeker] = useState(true)
  const [form] = useForm()

  return (
    <div>
      <div className="text-center mb-2">
        <Link to="/">
          <Image src="../resources/images/logo-jobpica.png" preview={false} />
        </Link>
      </div>
      <div className={`card ${style.container}`}>
        {isRegisterJobSeeker ? (
          <div className="text-dark font-size-24 mb-4">
            <strong>Chào mừng bạn đến với JobPiCa - Đăng ký là ứng viên</strong>
          </div>
        ) : (
          <div className="text-dark font-size-24 mb-4">
            <strong>Chào mừng bạn đến với JobPiCa - Đăng ký là nhà tuyển dụng</strong>
          </div>
        )}

        {isRegisterJobSeeker ? (
          <div className="mb-4">
            <p>Cùng xây dựng một hồ sơ nổi bật và nhận được các cơ hội sự nghiệp lý tưởng</p>
          </div>
        ) : (
          <div className="mb-4">
            <p>Cùng tìm kiếm những ứng viên chất lượng phù hợp với doanh nghiệp của bạn</p>
          </div>
        )}
        {isRegisterJobSeeker ? <JobSeekerRegisterForm /> : <CompanyRegisterForm />}

        <Divider>Hoặc</Divider>
        <Button
          type="primary"
          ghost
          size="large"
          className={`text-center w-100 ${style.button_ghost_primary}`}
          hidden={!isRegisterJobSeeker}
          onClick={() => {
            setIsRegisterJobSeeker(false)
            form.resetFields()
          }}
        >
          <strong>Đăng ký là nhà tuyển dụng</strong>
        </Button>
        <Button
          type="primary"
          ghost
          size="large"
          hidden={isRegisterJobSeeker}
          className={`text-center w-100 ${style.button_ghost_primary}`}
          onClick={() => {
            setIsRegisterJobSeeker(true)
            form.resetFields()
          }}
        >
          <strong>Đăng ký là người tìm việc</strong>
        </Button>
      </div>
      <div className="text-center pt-2 mb-auto">
        <span className="mr-2">Bạn đã có tài khoản?</span>
        <Link to="/auth/login" className="kit__utils__link font-size-16">
          Đăng nhập
        </Link>
      </div>
    </div>
  )
}

export default Register
