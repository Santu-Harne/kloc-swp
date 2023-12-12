import React, { useState, useEffect } from "react";
import {
   MDBCard,
   MDBCardBody,
   MDBInput,
   MDBCardFooter,
   MDBValidation,
   MDBBtn,
   MDBIcon,
   MDBSpinner,
 } from "mdb-react-ui-kit";
 import { Link, useNavigate } from "react-router-dom";
 import {createClient } from './../actions/clientActions'
import { useDispatch } from "react-redux";
import toast from 'react-hot-toast'

const Register = () => {
   const initialState = {
      userName: "",
      userEmail: "",
      userPassword: "",
      userMobileNo: "",
      userAltMobileNo: "",
      userCompany:"",
      userCountry:"",
      userAddress:"",
      userDesignation:"",
      userDepartment:"",
      userWebsiteUrl:"",
      userSocialMediaUrl:""
    };
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [useremail, setUserEmail] = useState('');
const [isUserEmailValid, setIsUserEmailValid] = useState(true);

    const [formValue, setFormValue] = useState(initialState);
    const [SubmitBtn, setSubmitBtn] = useState(false)

    const {userName, userEmail, userPassword,userMobileNo,userAltMobileNo,userCompany,userCountry,userAddress,userDesignation,userDepartment,userWebsiteUrl,userSocialMediaUrl} = formValue;
    const handleSubmit = async(e) => {
      e.preventDefault();
      setSubmitBtn(true)
    await dispatch(createClient(formValue))
      .then(res => {
        if (res.payload) {
          // console.log(res.payload);
          toast.success(res.payload.msg)
          navigate('/')
       
        }
      })
    setTimeout(() => setSubmitBtn(false), [2000])
    }
    const onInputChange = (e) => {
      let { name, value } = e.target;
      setFormValue({ ...formValue, [name]: value });
      const value1 = e.target.value;    
    };
  return (
   <div
   style={{
     margin: "auto",
     padding: "15px",
     maxWidth: "450px",
     alignContent: "center",
     marginTop: "120px",
   }}
 >
   <MDBCard alignment="center">
     <MDBIcon fas icon="user-circle" className="fa-2x" />
     <h5>Sign Up</h5>
     <MDBCardBody>
       <MDBValidation onSubmit={handleSubmit} noValidate className="row g-3">
         <div className="col-md-6">
           <MDBInput
             label="userName"
             type="text"
             value={userName}
             name="userName"
             onChange={onInputChange}
             required
             invalid
             validation="Please provide first name"
           />
         </div>
         <div className="col-md-6">
           <MDBInput
             label="userEmail"
             type="email"
             value={userEmail}
             name="userEmail"
             onChange={onInputChange}
             required
             invalid
             validation="Please provide email"
           />
           
         </div>
         <div className="col-md-6">
           <MDBInput
             label="userPassword"
             type="password"
             value={userPassword}
             name="userPassword"
             onChange={onInputChange}
             required
             invalid
             validation="Please provide password"
           />
         </div>
         <div className="col-md-6">
           <MDBInput
             label="userMobileNo"
             type='number'
             value={userMobileNo}
             name="userMobileNo"
             onChange={onInputChange}
             required
             invalid
             validation="Please provide confirm password"
           />
         </div>
         <div className="col-md-6">
           <MDBInput
             label="userAltMobileNo"
             type='number'
             value={userAltMobileNo}
             name="userAltMobileNo"
             onChange={onInputChange}
             required
             invalid
             validation="Please provide confirm password"
           />
         </div>
         <div className="col-md-6">
           <MDBInput
             label="userCompany"
             type="text"
             value={userCompany}
             name="userCompany"
             onChange={onInputChange}
             required
             invalid
             validation="Please provide first name"
           />
         </div>
         <div className="col-md-6">
           <MDBInput
             label="userCountry"
             type="userCountry"
             value={userCountry}
             name="userCountry"
             onChange={onInputChange}
             required
             invalid
             validation="Please provide email"
           />
         </div>
         <div className="col-md-6">
           <MDBInput
             label="userAddress"
             type="userAddress"
             value={userAddress}
             name="userAddress"
             onChange={onInputChange}
             required
             invalid
             validation="Please provide password"
           />
         </div>
         <div className="col-md-6">
           <MDBInput
             label="userDesignation"
             type='userDesignation'
             value={userDesignation}
             name="userDesignation"
             onChange={onInputChange}
             required
             invalid
             validation="Please provide confirm password"
           />
         </div>
         <div className="col-md-6">
           <MDBInput
             label="userDepartment"
             type='text'
             value={userDepartment}
             name="userDepartment"
             onChange={onInputChange}
             required
             invalid
             validation="Please provide confirm password"
           />
         </div>
         <div className="col-md-6">
           <MDBInput
             label="userWebsiteUrl"
             type='text'
             value={userWebsiteUrl}
             name="userWebsiteUrl"
             onChange={onInputChange}
             required
             invalid
             validation="Please provide confirm password"
           />
         </div>
         <div className="col-md-6">
           <MDBInput
             label="userSocialMediaUrl"
             type='text'
             value={userSocialMediaUrl}
             name="userSocialMediaUrl"
             onChange={onInputChange}
             required
             invalid
            //  validation="Please provide confirm password"
           />
         </div>
     
         <div className="col-12">
           <MDBBtn style={{ width: "100%" }} className="mt-2">
            
             Register
           </MDBBtn>
         </div>
       </MDBValidation>
     </MDBCardBody>
     <MDBCardFooter>
       <Link to="/login">
         <p>Already have an account ? Sign In</p>
       </Link>
     </MDBCardFooter>
   </MDBCard>
 </div>
  )
}

export default Register