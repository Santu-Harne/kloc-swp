import toast from 'react-hot-toast'

export const errorHandler = async (error) => {
  console.log(error);
  if (error?.response && error?.response?.status === 404) toast.error(`${error.message} \n Please recheck URL! `)
  else if (error?.response) toast.error(error.response.data.msg)
  else toast.error(error.message)
}

