import React, { useState } from 'react'
import TextField from '@mui/material/TextField';
import { login } from './../actions/clientActions'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'

const user = {
  email: 'santosh.283143@gmail.com',
  password: 'Santosh1437$'
}
const Login = () => {
  const [SubmitBtn, setSubmitBtn] = useState(false)
  const dispatch = useDispatch();

  const submitHandler = async (e) => {
    // e.preventDefault()
    setSubmitBtn(true)
    await dispatch(login(user))
      .then(res => {
        if (res.payload) {
          // console.log(res.payload);
          toast.success(res.payload.msg)
          localStorage.setItem('authToken', res.payload.authToken)
        }
      })
    setTimeout(() => setSubmitBtn(false), [2000])
  }

  return (
    <div>
      <h1>Login</h1>
      {/* <form onSubmit={submitHandler}>
        <TextField id="outlined-basic" label="Outlined" variant="outlined" />
      </form> */}
      <button disabled={SubmitBtn} onClick={submitHandler}>Submit</button>
    </div>
  )
}

export default Login