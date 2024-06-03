import axios from "../axios";
const createNewRecruitment = (data)=>{
    console.log('check data from service', data)
    return axios.post('/api/create-new-recruitment',data)
}
const getAllRecruitment = (userId)=>{
    return axios.get(`/api/get-all-recruitment-by-id?id=${userId}`)
}
const EditRecruitmentService = (data)=>{
    console.log('check data from service', data)
    return axios.put(`/api/edit-recruitment`, data)
}
const DeleteRecruitmentService = (recruitmentId)=>{
    return axios.delete(`/api/delete-recruitment?id=${recruitmentId}`)
}
const UpdateStatusRecruitmentService = (data)=>{
    return axios.put(`/api/edit-status-recruitment`, data)
}
const GetAppliedCv = (id)=>{
    return axios.get(`/api/get-all-cv-by-recruitmentId?id=${id}`)
}
const UpdateAppliedCvStatus = (data)=>{
    console.log('check data update cv from service', data)
    return axios.put('/api/update-applied-cv-status',data)
}
const GetStatisticsService = (id)=>{
    console.log('check data update cv from service', id)
    return axios.get(`/api/get-statistics-by-recruitmentId?id=${id}`)
}
const ChangeEmployerCompany = (data)=>{
    console.log('check data ChangeEmployerCompany', data)
    return axios.put('/api/change-employer-company',data)
}
export{ createNewRecruitment, getAllRecruitment, EditRecruitmentService, DeleteRecruitmentService, UpdateStatusRecruitmentService, GetAppliedCv, UpdateAppliedCvStatus,GetStatisticsService,
    ChangeEmployerCompany,
}