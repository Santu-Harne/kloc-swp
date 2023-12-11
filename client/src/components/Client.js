import React, { useEffect, useSate } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { getAllClients, createClient } from './../actions/clientActions'

const data = {
  clientName: "Nagendra",
  email: "nagendratengeti@gmail.com",
  password: "Nagendra@123",
  mobileNumber: "8660822483",
  company: "klocTechnologies",
  address: "Bangalore",
  finalCommit: false
}

const Client = () => {
  const dispatch = useDispatch();
  const { clients } = useSelector(state => state.clientsData)

  const addClient = async () => {
    dispatch(createClient(data))
      .then(res => {
        // console.log(res.payload);
        if (res.payload) {
          toast.success(res.payload.msg)
        }
      })
  }

  useEffect(() => {
    dispatch(getAllClients())
  }, [])
  return (
    <div>
      <h1>Client Data</h1>
      <button onClick={addClient}>Add Client</button>
      <ul>
        {
          clients && clients.map((client, index) => {
            return <li key={index}>{client?.clientName}</li>
          })
        }
      </ul>
    </div>
  )
}

export default Client