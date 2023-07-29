/* eslint-disable import/prefer-default-export */
export function getImages(url) { 
  return `${process.env.REACT_APP_BACKEND_URL}/images/${url}`
}
export function getCV(url) {
  return `${process.env.REACT_APP_BACKEND_URL}/cv/${url}`
}

export function getSalary(minSalary, maxSalary) {
  if (minSalary && maxSalary) {
    return `${minSalary
      .toString()
      .replace(/\./, ',')
      .replace(/\B(?=(\d{3})+(?!\d))/g, '.')} - ${maxSalary
      .toString()
      .replace(/\./, ',')
      .replace(/\B(?=(\d{3})+(?!\d))/g, '.')} VND`
  }
  if (!minSalary && !maxSalary) {
    return 'Thỏa thuận'
  }
  if (!minSalary && maxSalary) {
    return `Tới ${maxSalary
      .toString()
      .replace(/\./, ',')
      .replace(/\B(?=(\d{3})+(?!\d))/g, '.')} VND`
  }
  if (minSalary && !maxSalary) {
    return `Trên ${minSalary
      .toString()
      .replace(/\./, ',')
      .replace(/\B(?=(\d{3})+(?!\d))/g, '.')} VND`
  }
  return ''
}

export function getYearsOfExperience(minYearsOfExperience, maxYearsOfExperience) {
  if (minYearsOfExperience && maxYearsOfExperience) {
    return `Từ ${minYearsOfExperience} - ${maxYearsOfExperience} năm kinh nghiệm`
  }
  if (!minYearsOfExperience && !maxYearsOfExperience) {
    return 'Không yêu cầu kinh nghiệm'
  }
  if (!minYearsOfExperience && maxYearsOfExperience) {
    return `Dưới ${maxYearsOfExperience} năm kinh nghiệm`
  }
  if (minYearsOfExperience && !maxYearsOfExperience) {
    return `Ít nhất ${minYearsOfExperience} năm kinh nghiệm`
  }
  return ''
}

export function getAddress(address) {
  if (address) {
    return address
  }
  return 'Liên hệ'
}

export function getRoles(roles) {
  const result = []
  roles.forEach((role) => {
    if (role === 'ROLE_ADMIN') {
      result.push('Quản trị viên')
    } else if (role === 'ROLE_EMPLOYER') {
      result.push('Nhà tuyển dụng')
    } else if (role === 'ROLE_JOB_SEEKER') {
      result.push('Người tìm việc')
    }
  })
  return result.join(',')
}

export function getLabelStatusOfApplicationJob(status) {
  if (status === 'PENDING') {
    return {
      label: 'Chờ duyệt',
    }
  }
  if (status === 'ACCEPTED') {
    return {
      label: 'Chấp nhận',
      color: 'green',
    }
  }
  return {
    label: 'Từ chối',
    color: 'red',
  }
}
