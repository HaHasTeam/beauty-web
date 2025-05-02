import _ from 'lodash'

import { TUser } from '@/types/user'

export const convertProfileIntoForm = (profile: TUser) => {
  let form = _.cloneDeepWith<Partial<TUser>>(profile)
  form = _.omitBy(form, _.isNil)
  form = _.omit(form, 'role')
  return form
}

/**
 * Converts form data into a profile object suitable for API submission
 * Note: The returned type is compatible with the updateProfile API
 */
export const convertFormIntoProfile = (form: Partial<TUser>) => {
  let profile = _.cloneDeepWith(form)
  profile = _.omitBy(profile, (value) => _.isNil(value) || _.isEmpty(value) || Array.isArray(value))

  // if (!profile.role) {
  //   profile.role = UserRoleEnum.CUSTOMER
  // }

  return profile
}
