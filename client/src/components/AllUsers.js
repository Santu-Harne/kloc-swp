import React, { useEffect, useSate } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { DataGrid } from '@mui/x-data-grid';
import { Grid, Paper } from '@mui/material';
import { getAllUsers, createUser, updateUser, deleteUser } from '../actions/userActions'



const AllUsers = () => {
  const dispatch = useDispatch();
  const users = useSelector(state => state?.data.users)?.map((user, index) => ({ ...user, id: index + 1 })) || []
  const columns = [
    { field: 'id', headerName: 'S.No', width: 100 },
    { field: 'userName', headerName: 'Name', width: 200 },
    { field: 'userEmail', headerName: 'Email', width: 200 },
    { field: 'userMobileNo', headerName: 'Mobile Number', width: 180 },
    { field: 'userAltMobileNo', headerName: 'Alt Mobile Number', width: 200 },
    { field: 'userCountry', headerName: 'Country', width: 150 },
    { field: 'userCompany', headerName: 'Company', width: 200 },
    { field: 'userDepartment', headerName: 'Department', width: 200 },
    { field: 'userDesignation', headerName: 'Designation', width: 200 },
    { field: 'userWebsiteUrl', headerName: 'Website', width: 200 },
    { field: 'userSocialMediaUrl', headerName: 'Social Media', width: 200 },
  ]

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
  const delUser = (userId) => {
    dispatch(deleteUser(userId))
      .then(res => {
        if (res.payload) {
          toast.success(res.payload.msg)
        }
      })
  }
  useEffect(() => {
    dispatch(getAllUsers())
  }, [])
  return (
    <div>
      <h1>Users Data</h1>
      <button onClick={() => delUser('user_0004')}>dlt user</button>
      <DataGrid
        rows={users}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}

      />
    </div>
  )
}

export default AllUsers