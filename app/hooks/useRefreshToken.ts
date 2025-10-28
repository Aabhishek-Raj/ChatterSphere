'use client'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentUser, setCredentials } from '@/store/reducers/auth/authSlice'
import axios from 'axios'

const useRefreshToken = () => {
  const dispatch = useDispatch()
  const user = useSelector(selectCurrentUser)

  const refresh = async () => {
    const response = await axios.get('/api/refresh', {
      withCredentials: true,
    })
    dispatch(setCredentials({ ...response.data, user }))
    return response.data.accessToken
  }
  return refresh
}

export default useRefreshToken
