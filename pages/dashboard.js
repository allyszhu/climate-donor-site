import { Layout, Row } from 'antd'
import React, { useState, useEffect } from 'react'
import  OwnerDashboard  from './owner_dashboard'
import  DonorDashboard  from './donor_dashboard'
import {getDoc} from '../lib/firebase'

import {
  useAuthUser,
  withAuthUser,
  AuthAction
} from 'next-firebase-auth'


const Dashboard = () => {
  const AuthUser = useAuthUser()
  const [userType, setUserType] = useState('donor')

  const getUserType = async() => {
    const user =  await getDoc('users', AuthUser.id)
                .then((ans)=> { return ans})
    setUserType(user.userType)
  }

  getUserType()
  
  console.log(userType)
  

  return (  
    <>
    {
        userType == 'donor' ?
        <DonorDashboard/> :
        <OwnerDashboard/>
    }
    </>

  )
}

const MyLoader = () => <div>Loading...</div>
export default withAuthUser({
  whenAuthed: AuthAction.RENDER,
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  LoaderComponent: MyLoader,
})(Dashboard)
