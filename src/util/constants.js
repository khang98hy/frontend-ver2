export default class Constants {
  static USER_TYPE = 'user'

  static SINGER_TYPE = 'singer'

  static SONG_TYPE = 'song'
}

export const JOB_TYPE = {
  INTERNSHIP: {
    value: 'INTERNSHIP',
    label: 'Thực tập',
  },
  FULL_TIME: {
    value: 'FULL_TIME',
    label: 'Việc làm toàn thời gian',
  },
  PART_TIME: {
    value: 'PART_TIME',
    label: 'Việc làm bán thời gian',
  },
  FREELANCER: {
    value: 'FREELANCER',
    label: 'Việc làm freelance',
  },
}

export const FILTER_JOBS = {
  TYPE: {
    value: 'TYPE',
    label: 'Loại công việc',
  },
  CITY: {
    value: 'CITY',
    label: 'Thành phố',
  },
  FIELD: {
    value: 'FIELD',
    label: 'Ngành nghề',
  },
  TIME: {
    value: 'TIME',
    label: 'Cập nhật lần cuối',
  },
}

export const CITIES = ['TP. Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng', 'Quảng Ninh', 'Hải Phòng']

export const COLORS = {
  WHITE: '#ffffff',
}

export const FILTER_TIME_AGO = {
  DAY: {
    value: 1,
    label: '24 giờ trước',
  },
  WEEK: {
    value: 7,
    label: 'Tuần trước',
  },
  MONTH: {
    value: 30,
    label: 'Tháng trước',
  },
  EVERYTIME: {
    value: 0,
    label: 'Mọi lúc',
  },
}
