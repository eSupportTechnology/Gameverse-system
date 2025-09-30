import { createContext, useState } from "react";


export const AdminContext = createContext()

const AdminContextProvider  = (props) => {
  const [aToken,setAToken] = useState(localStorage.getItem('aToken')?localStorage.getItem('aToken'):'')
  const [oToken, setOToken] = useState(localStorage.getItem("oToken") || "");

  const [loginRole, setLoginRole] = useState(localStorage.getItem("loginRole") || "");

  const value = {
    aToken,setAToken,oToken,setOToken,loginRole,setLoginRole
  }

  return(
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  )
}

export default AdminContextProvider