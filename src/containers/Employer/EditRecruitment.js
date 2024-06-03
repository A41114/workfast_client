import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import './EditRecruitment.scss';
import {getAllRecruitment,EditRecruitmentService} from '../../services/employerService'
import DatePicker from '../../components/Input/DatePicker';
import { getAllCodeService } from '../../services/userService';
import moment from 'moment';
import {toast} from "react-toastify"
//Markdown editer----------------------------------------------------------------------------------------

import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
// import style manually
import 'react-markdown-editor-lite/lib/index.css';

// Register plugins if required
// MdEditor.use(YOUR_PLUGINS_HERE);

// Initialize a markdown parser
const mdParser = new MarkdownIt(/* Markdown-it options */);

// Finish!
function handleEditorChange({ html, text }) {
  console.log('handleEditorChange', html, text);
}
//Markdown editer-------------------------------------------------------------------------------------------





class EditRecruitment extends Component {

    constructor(props){
        super(props);
        this.state = {
            recruitmentArr:'',
            recruitmentId:'',
            companyId:'',


            fieldArr:'',
            positionArr:'',
            salaryArr:'',
            experienceArr:'',
            workLocationArr:'',

            title:'',
            field:'',
            position:'',
            salary:'',
            experience:'',
            workLocation:'',
            endDate:'',
            recruitmentDescriptionMarkdown:'',
            recruitmentDescriptionHTML:'',

            amount:'',
            gender:'',

        }
    }
    
    async componentDidMount(){
        try {
            let resField = await getAllCodeService('FIELD');
            let resPosition = await getAllCodeService('POSITION');
            let resSalary = await getAllCodeService('SALARY');
            let resExperience = await getAllCodeService('EXPERIENCE');
            let resWorkLocation = await getAllCodeService('LOCATION');
            //console.log('check: ', resField,resPosition,resSalary,resExperience,resWorkLocation)
            this.setState({
                fieldArr: resField.data,
                positionArr:resPosition.data,
                salaryArr:resSalary.data,
                experienceArr:resExperience.data,
                workLocationArr:resWorkLocation.data,
            })
            if(this.props.userInfo){
                this.getAllRecruitmentById(this.props.userInfo.id)
                this.setState({
                    companyId : this.props.userInfo.companyId
                })
            }
        } catch (e) {
            console.log(e)
        }
        
    }
    async componentDidUpdate(prevProps, prevState, snapshot){
        if(prevProps.userInfo !== this.props.userInfo){
            this.getAllRecruitmentById(this.props.userInfo.id)
            this.setState({
                companyId : this.props.userInfo.companyId
            })
        }
        
    }
    getAllRecruitmentById=async(userId)=>{
        try {
            let resRecruitment = await getAllRecruitment(userId)
            console.log('response: ',resRecruitment)
            this.setState({
                recruitmentId:resRecruitment.data[0].id,
                recruitmentArr : resRecruitment.data,
                title : resRecruitment.data[0].title,
                companyId : resRecruitment.data[0].companyId,
                field:resRecruitment.data[0].field,
                position:resRecruitment.data[0].position,
                salary:resRecruitment.data[0].salary,
                experience:resRecruitment.data[0].yearOfExperience,
                workLocation:resRecruitment.data[0].workLocation,
                endDate:resRecruitment.data[0].endDate,
    
                recruitmentDescriptionMarkdown:resRecruitment.data[0].jobDescriptionMarkdown,
                recruitmentDescriptionHTML:resRecruitment.data[0].jobDescriptionHTML,
                amount:resRecruitment.data[0].amount,
                gender:resRecruitment.data[0].gender,
            })
        } catch (e) {
            console.log(e)
        }
    }
    //get id from title
    // handleGetIdFromTitle=(title)=>{
    //     let id = ''
    //     for(let i = 0;i<title.length;i++){
    //         if(title[i]==='-'){
    //             break;
    //         }
    //         else{
    //             id+=title[i]
    //         }
    //     }
    //     return id;
        
    // }



    //select
    handleOnChangeSelect=(event,inputId)=>{
        let copyState = this.state;
        copyState[inputId]=event.target.value;
        this.setState({
            ...copyState
        })
    }
    handleOnChangeTitle=(event)=>{
        
        for(let i = 0;i<this.state.recruitmentArr.length;i++){
            if(this.state.recruitmentArr[i].id===(+event.target.value)){
                
                this.setState({
                    recruitmentId:this.state.recruitmentArr[i].id,
                    field:this.state.recruitmentArr[i].field,
                    position:this.state.recruitmentArr[i].position,
                    salary:this.state.recruitmentArr[i].salary,
                    experience:this.state.recruitmentArr[i].yearOfExperience,
                    workLocation:this.state.recruitmentArr[i].workLocation,
                    endDate:this.state.recruitmentArr[i].endDate,
                    recruitmentDescriptionMarkdown:this.state.recruitmentArr[i].jobDescriptionMarkdown,
                    recruitmentDescriptionHTML:this.state.recruitmentArr[i].jobDescriptionHTML,
                    amount:this.state.recruitmentArr[i].amount,
                    gender:this.state.recruitmentArr[i].gender,
                })
                break     
            }
        }
        console.log('st: ',this.state)
    }



    //Date
    handleOnChangeEndDate=(date)=>{
        this.setState({
            endDate:moment(date[0]).format('DD/MM/YYYY')
        })
    }
    //Markdown
    handleMarkdownChange=({html,text})=>{
        this.setState({
            recruitmentDescriptionMarkdown:text,
            recruitmentDescriptionHTML:html,
        })
    }
    //Handle edit
    handleEditPost=async()=>{
        await EditRecruitmentService({
            recruitmentId:this.state.recruitmentId,
            companyId:this.state.companyId,
            title:this.state.title,
            position:this.state.position,
            field:this.state.field,
            jobDescriptionMarkdown:this.state.recruitmentDescriptionMarkdown,
            jobDescriptionHTML:this.state.recruitmentDescriptionHTML,
            workLocation:this.state.workLocation,
            yearOfExperience:this.state.experience,
            salary:this.state.salary,
            endDate:this.state.endDate,
            amount :this.state.amount,
            gender : this.state.gender,
        })
        toast.success('Sửa đơn tuyển dụng thành công !!!!')
    }
    
    render() {

        let {recruitmentArr}=this.state

        let field = this.state.fieldArr
        let position = this.state.positionArr
        let salary = this.state.salaryArr
        let experience = this.state.experienceArr
        let workLocation = this.state.workLocationArr

        console.log('State: ', this.state)
     
        
        return (
            <div className="user-redux-body">
                        <div className='container'>
                            <div className='row'>
                                <div className='col-12'>
                                    <label>Tên</label>
                                    <select className='form-control' type='email'
                                    onChange={(event)=>this.handleOnChangeTitle(event)}
                                    >
                                    {recruitmentArr&&recruitmentArr.length>0&&
                                        recruitmentArr.map((item, index)=>{
                                        return(
                                            <option key={index} value={item.id}>{item.title}</option>
                                        )
                                        })
                                    }
                                    </select>
                                </div>
                                <div className='col-3'>
                                    <label>Lĩnh vực</label>
                                    <select className='form-control'
                                    onChange={(event)=>this.handleOnChangeSelect(event,'field')}
                                    value={this.state.field}
                                    >
                                    {field && field.length >0 &&
                                        field.map((item, index)=>{
                                            return(
                                                <option key={index}>{item.value}</option>
                                            )
                                        })
                                        }
                                    
                                    </select>
                                </div>
                                <div className='col-3'>
                                    <label>Vị trí</label>
                                    <select className='form-control'
                                    onChange={(event)=>this.handleOnChangeSelect(event,'position')}
                                    value={this.state.position}
                                    >
                                    {position && position.length >0 &&
                                        position.map((item, index)=>{
                                            return(
                                                <option key={index}>{item.value}</option>
                                            )
                                        })
                                        }
                                    
                                    </select>
                                </div>
                                
                                <div className='col-3'>
                                    <label>Mức lương</label>
                                    <select className='form-control'
                                    onChange={(event)=>this.handleOnChangeSelect(event,'salary')}
                                    value={this.state.salary}
                                    >
                                    {salary && salary.length >0 &&
                                        salary.map((item, index)=>{
                                            return(
                                                <option key={index}>{item.value}</option>
                                            )
                                        })
                                        }
                                    
                                    </select>
                                </div>
                                <div className='col-3'>
                                    <label>Kinh nghiệm</label>
                                    <select className='form-control'
                                    onChange={(event)=>this.handleOnChangeSelect(event,'experience')}
                                    value={this.state.experience}
                                    >
                                    {experience && experience.length >0 &&
                                        experience.map((item, index)=>{
                                            return(
                                                <option key={index}>{item.value}</option>
                                            )
                                        })
                                        }
                                    
                                    </select>
                                </div>
                                <div className='col-3'>
                                    <label>Số lượng</label>
                                    <input className='form-control' type='text'
                                    onChange={(event)=>this.handleOnChangeSelect(event,'amount')}
                                    placeholder='Nhập số lượng muốn tuyển dụng'
                                    value={this.state.amount}
                                    />
                                </div>
                                <div className='col-3'>
                                    <label>Giới tính</label>
                                    <select className='form-control'
                                    onChange={(event)=>this.handleOnChangeSelect(event,'gender')}
                                    value={this.state.gender}
                                    >
                                        <option>Không yêu cầu</option>
                                        <option>Nam</option>
                                        <option>Nữ</option>
                                  
                                    </select>
                                </div>
                                <div className='col-3'>
                                    <label>Địa điểm</label>
                                    <select className='form-control'
                                    onChange={(event)=>this.handleOnChangeSelect(event,'workLocation')}
                                    value={this.state.workLocation}
                                    >
                                    {workLocation && workLocation.length >0 &&
                                        workLocation.map((item, index)=>{
                                            return(
                                                <option key={index}>{item.value}</option>
                                            )
                                        })
                                        }
                                    
                                    </select>
                                </div>
                                <div className='col-3'>
                                    <label>Thời hạn</label>
                                    <DatePicker className='form-control'
                                    value={this.state.endDate}
                                    onChange={(event)=>this.handleOnChangeEndDate(event)}
                                    />
                                </div>
                                <div className='col-12 my-5'>
                                    <label>Chi tiết tuyển dụng</label>
                                    <MdEditor style={{ height: '500px' }} renderHTML={text=>mdParser.render(text)} 
                                    onChange={this.handleMarkdownChange}
                                    value={this.state.recruitmentDescriptionMarkdown}
                                    />;
                                </div>

                                <div className='col-12 my-3'>
                                    <button className='edit-post' onClick={()=>this.handleEditPost()}>Lưu thay đổi</button>
                                </div>
                            </div>
                        </div>
                    </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        userInfo : state.user.userInfo,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        
        
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditRecruitment);
