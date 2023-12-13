import React, { useEffect, useSate } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { getAllUsers } from '../actions/userActions'

const AllUsers = () => {
  const dispatch = useDispatch();
  const { users } = useSelector(state => state.data)
console.log(users)
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