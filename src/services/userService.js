import axios from "../axios";
const handleLoginApi = (userEmail, userPassword)=>{
    return axios.post('/api/login', {email : userEmail, password : userPassword});
}
const getAllUser = (inputId)=>{
    return axios.get(`/api/get-all-users?id=${inputId}`)
}
const createNewUserService = (data)=>{
    console.log('check data from service', data)
    return axios.post('/api/create-new-user',data)
}
const deleteUserService = (userId)=>{
    //return axios.delete('/api/delete-user',{id : userId})
    return axios.delete('/api/delete-user',{
        // headers:{

        // },
        data:{
            id : userId
        }
    })
}
const editUserService = (inputData)=>{
    return axios.put('/api/edit-user',inputData)
}

//get value from all code
const getAllCodeService = (inputType)=>{
    return axios.get(`/api/allcode?type=${inputType}`)
}
//Change password
const changePasswordService = (data)=>{
    console.log('check data from service', data)
    return axios.put('/api/change-password',data)
}
//Change user's info
const changeUserInfoService = (data)=>{
    console.log('check data change info from service', data)
    return axios.put('/api/update-user-info',data)
}
//Relogin
const reLogin = (inputId)=>{
    console.log('check data reLogin from service', inputId)
    return axios.get(`/api/get-user-by-id?id=${inputId}`)
}
//Get recruitments to homepage
const getRecruitmentsToHomepage = ()=>{
    //console.log('check data reLogin from service', inputId)
    return axios.get('/api/get-all-recruitments-to-homepage')
}
//Get all companies
const getAllCompanies = ()=>{
    //console.log('check data reLogin from service', inputId)
    return axios.get('/api/get-all-companies')
}
//Create company
const createNewCompanyService = (data)=>{
    console.log('check data from service', data)
    return axios.post('/api/create-new-company',data)
}
//Update company
const updateCompanyInfoService = (data)=>{
    console.log('check data update company info from service', data)
    return axios.put('/api/update-company-info',data)
}
//Delete company
const deleteCompanyService = (id)=>{
    //return axios.delete('/api/delete-user',{id : userId})
    return axios.delete('/api/delete-company',{
        data:{
            id : id
        }
    })
}

export{ handleLoginApi, getAllUser, createNewUserService, deleteUserService, editUserService, getAllCodeService,changePasswordService, changeUserInfoService,reLogin,
    getRecruitmentsToHomepage,getAllCompanies, createNewCompanyService,updateCompanyInfoService, deleteCompanyService
}