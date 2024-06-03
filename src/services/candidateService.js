import axios from "../axios";
const createNewCv = (data)=>{
    // console.log('check data from service', data)
    return axios.post('/api/create-new-cv',data)
}
const getAllCv = (userId)=>{
    return axios.get(`/api/get-all-Cv-by-id?id=${userId}`)
}
const EditCvService = (data)=>{
    // console.log('check data from service', data)
    return axios.put('/api/edit-cv', data)
}
const DeleteCv = (cvId)=>{
    // console.log('check data from service', cvId)
    return axios.delete(`/api/delete-cv?id=${cvId}`)
}
const getRecruitmentDetaiById = (id)=>{
    return axios.get(`/api/get-recruitment-detail-by-id?id=${id}`)
}
const applyCv = (data)=>{
    // console.log('check apply cv from service', data)
    return axios.post('/api/apply-cv',data)
}
const GetApplyHistory = (id)=>{
    // console.log('check get apply history from service', id)
    return axios.get(`/api/get-applied-Cv-by-id?id=${id}`)
}
const GetCompanyDetail = (id)=>{
    // console.log('check get company detail from service', id)
    return axios.get(`/api/get-company-detail-by-id?id=${id}`)
}
const ChangeFollowStatus = (data)=>{
    // console.log('check ChangeFollowStatus from service', data)
    return axios.post(`/api/change-follow-status`,data)
}
const GetFollowlById = (id)=>{
    // console.log('check GetFollowlById from service', id)
    return axios.get(`/api/get-follow-by-id?id=${id}`)
}

export{createNewCv,getAllCv,EditCvService,DeleteCv, getRecruitmentDetaiById, applyCv, GetApplyHistory,GetCompanyDetail,ChangeFollowStatus,GetFollowlById }