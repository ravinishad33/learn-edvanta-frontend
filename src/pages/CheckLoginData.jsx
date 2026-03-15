import React from 'react'
import { useSelector } from 'react-redux'

const CheckLoginData = () => {
     const user = useSelector(state => state.auth.user)
     console.log(user)
  return (
    <>
    <h1>
        hey i am 
    </h1>
    </>
  )
}

export default CheckLoginData