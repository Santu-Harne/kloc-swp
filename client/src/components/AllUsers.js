import React, { useEffect, useSate } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { getAllUsers, createUser, updateUser, deleteUser } from '../actions/userActions'


const AllUsers = () => {
  const dispatch = useDispatch();
  const { users } = useSelector(state => state?.data)

  // const addUser = () => {
  //   dispatch(createUser(data))
  //     .then(res => {
  //       if (res.payload) {
  //         toast.success(res.payload.msg)
  //       }
  //     })
  // }
  // const editUser = (userId) => {
  //   dispatch(updateUser({ updateData, userId }))
  //     .then(res => {
  //       if (res.payload) {
  //         toast.success(res.payload.msg)
  //       }
  //     })
  // }
  // const delUser = (userId) => {
  //   dispatch(deleteUser(userId))
  //     .then(res => {
  //       if (res.payload) {
  //         toast.success(res.payload.msg)
  //       }
  //     })
  // }
  useEffect(() => {
    dispatch(getAllUsers())
  }, [])
  return (
    <div>
      <h1>Users Data</h1>
      <ul>
        {
          users && users.map((user, index) => {
            return <li key={index}>{user?.userName}</li>
          })
        }
      </ul>
    </div>
  )
}

export default AllUsers