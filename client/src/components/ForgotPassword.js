import axios from 'axios'
import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { useParams, useNavigate } from 'react-router-dom'

const initialState = {
  newPassword: '', confirmPassword: '',
}
const ForgotPassword = () => {
  const { token } = useParams()
  const navigate = useNavigate()
  // console.log(token);
  const [password, setPassword] = useState(initialState)

  const changeHandler = (e) => {
    const { name, value } = e.target
    setPassword({ ...password, [name]: value })
  }
  const submitHandler = async (e) => {
    e.preventDefault()
    axios.put('/api/user/forgot_password', { token, newPassword: password.newPassword })
      .then(res => {
        toast.success(res.data.msg)
        navigate('/login')
      }).catch(err => console.log(err))
  }
  return (
    <div>
      <h4>Reset Password</h4>
      <form onSubmit={submitHandler}>
        <input type="text" name="newPassword" id="newPassword" value={password.newPassword} onChange={changeHandler} placeholder='New Password' />
        <input type="text" name="confirmPassword" id="confirmPassword" value={password.confirmPassword} onChange={changeHandler} placeholder='Confirm Password' />

        <button type='submit'>Submit</button>
      </form>
    </div>
  )
}

export default ForgotPassword