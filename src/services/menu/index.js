export default async function getMenuData() {
  return [
    {
      title: 'Tìm việc làm',
      key: 'searchJob',
      url: '/public/jobs',
    },
    {
      title: 'Danh sách công ty',
      key: 'companies',
      url: '/public/companies',
    },
    {
      title: 'Quản trị',
      key: 'management',
      roles: ['ROLE_ADMIN'],
      children: [
        {
          title: 'Danh sách ngành nghề',
          key: 'job-category-management',
          url: '/job-category-management',
        },
        {
          title: 'Danh sách lĩnh vực',
          key: 'job-field-management',
          url: '/job-field-management',
        },
        {
          title: 'Danh sách công ty',
          key: 'company-management',
          url: '/company-management',
        },
        {
          title: 'Danh sách tài khoản',
          key: 'user-management',
          url: '/user-management',
        },
      ],
    },
    {
      title: 'Tuyển dụng',
      key: 'recruitment',
      url: '/recruitment',
      roles: ['ROLE_EMPLOYER'],
    },
    {
      title: 'Hồ sơ và CV',
      key: 'cv',
      url: '/cv',
      roles: ['ROLE_JOB_SEEKER'],
    },
    {
      title: 'Việc làm đã ứng tuyển',
      key: 'applied-job',
      url: '/applied-job',
      roles: ['ROLE_JOB_SEEKER'],
    },
  ]
}
