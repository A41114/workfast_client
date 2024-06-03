import React, { Component } from 'react';
import { connect } from 'react-redux';
import HomeHeader from '../HomePage/HomeHeader';
import { getAllCodeService } from '../../services/userService';
import {createNewRecruitment,} from '../../services/employerService'
import './Recruitment.scss'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faRegular} from '@fortawesome/free-regular-svg-icons'
import {faSolid, faFile, faSignal, faUsers, faChartLine,faCircleInfo} from '@fortawesome/free-solid-svg-icons'
import {toast} from "react-toastify"

import DatePicker from '../../components/Input/DatePicker';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import moment from 'moment';

import PersonalInfo from './PersonalInfo';

import TableManageStatus from './Status'
import EditRecruitment from './EditRecruitment'
import AppliedCv from './AppliedCv';
import StatisticalReport from './StatisticalReport';


const mdParser = new MarkdownIt;

class Recruitment extends Component {
    constructor(props){
        super(props);
        this.state = {
            recruitment : false,
            status : false,
            cv : true,
            report: false,
            personalInfo:false,
            recruitmentAction:'edit',
            
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
            location:'',
            endDate:moment(new Date()).format('DD/MM/YYYY'),
            public:'show',

            amount:'',
            gender:'Không yêu cầu',


            recruitmentDescriptionMarkdown:'### ***Mô tả công việc***\n* Nhập mô tả\n### ***Yêu cầu ứng viên***\n* Nhập yêu cầu\n### ***Quyền lợi***\n* Nhập quyền lợi\n### ***Địa điểm làm việc***\n* Nhập địa điểm\n### ***Thời gian làm việc***\n* Nhập thời gian làm việc',
            recruitmentDescriptionHTML:`"<h3><em><strong>Mô tả công việc</strong></em></h3>
            <ul>
            <li>Nhập mô tả</li>
            </ul>
            <h3><em><strong>Yêu cầu ứng viên</strong></em></h3>
            <ul>
            <li>Nhập yêu cầu</li>
            </ul>
            <h3><em><strong>Quyền lợi</strong></em></h3>
            <ul>
            <li>Nhập quyền lợi</li>
            </ul>
            <h3><em><strong>Địa điểm làm việc</strong></em></h3>
            <ul>
            <li>Nhập địa điểm</li>
            </ul>
            <h3><em><strong>Thời gian làm việc</strong></em></h3>
            <ul>
            <li>Nhập thời gian làm việc</li>
            </ul>
            "`,
        }
    }
    async componentDidMount(){
        if(this.props.history.location.state){
            await this.fromHeaderToNewRecruitment()
        }
        let resField = await getAllCodeService('FIELD');
        let resPosition = await getAllCodeService('POSITION');
        let resSalary = await getAllCodeService('SALARY');
        let resExperience = await getAllCodeService('EXPERIENCE');
        let resWorkLocation = await getAllCodeService('LOCATION');
        //console.log('check: ', resField,resPosition,resSalary,resExperience,resWorkLocation)
        await this.setState({
            fieldArr:resField.data,
            positionArr:resPosition.data,
            salaryArr:resSalary.data,
            experienceArr:resExperience.data,
            workLocationArr:resWorkLocation.data,

            field:resField.data[0].value,
            position:resPosition.data[0].value,
            salary:resSalary.data[0].value,
            experience:resExperience.data[0].value,
            location:resWorkLocation.data[0].value,
        })
        
        
        
    }
    async componentDidUpdate(prevProps, prevState, snapshot){
        if(this.props.history.location.state){
            if(prevProps.history.location.state.fromNewRecruiment !== this.props.history.location.state.fromNewRecruiment){
                await this.fromHeaderToNewRecruitment()
            }
        }
        
    }
    //From header to new recruitment
    fromHeaderToNewRecruitment=()=>{
        this.setState({
            recruitment : true,
            status : false,
            cv : false,
            report: false,
            personalInfo:false,
            recruitmentAction:'create',
        })
    }

    //select
    handleOnChangeSelect=(event,inputId)=>{
        let copyState = this.state;
        copyState[inputId]=event.target.value;
        this.setState({
            ...copyState
        })
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
    //validate
    checkValidateInput = ()=>{
        let isValid=true;
        if(!this.state.title){
            isValid=false;
            alert('Thiếu tên chức vụ !!!')
        }
        else if(!this.state.recruitmentDescriptionMarkdown){
            isValid=false;
            alert('Thiếu mô tả công việc !!!')
        }
        else if(!this.state.amount){
            isValid=false;
            alert('Thiếu số lượng muốn tuyển dụng !!!')
        }
        return isValid
    }
    //Create
    handleCreatePost=async()=>{
        if(this.checkValidateInput()){
            toast.success('Tạo đơn tuyển dụng thành công !!!')
            try {
                await createNewRecruitment({
                    employerId : this.props.userInfo.id,
                    companyId : this.props.userInfo.companyId,
                    title : this.state.title,
                    position : this.state.position,
                    field : this.state.field,
                    jobDescriptionMarkdown : this.state.recruitmentDescriptionMarkdown,
                    jobDescriptionHTML : this.state.recruitmentDescriptionHTML,
                    workLocation : this.state.location,
                    yearOfExperience : this.state.experience,
                    salary : this.state.salary,
                    endDate : this.state.endDate,
                    public : this.state.public,

                    amount :this.state.amount,
                    gender :this.state.gender
                })
            } catch (e) {
                console.log(e)
            }
        }
    }
    //Change menu
    handleChangeMenu=(selected)=>{
        let copyState = this.state;
        copyState.recruitment=false;
        copyState.status=false;
        copyState.cv=false;
        copyState.report=false;
        copyState.personalInfo=false;
        


        copyState[selected]=true;
        this.setState({
            ...copyState
        })
    }
    //Change create <=> edit
    handleCreateEdit=(action)=>{
        this.setState({
            recruitmentAction : action
        })
    }
    render() {
        let {userInfo} = this.props;

        let field = this.state.fieldArr;
        let position = this.state.positionArr;
        let salary = this.state.salaryArr;
        let experience = this.state.experienceArr;
        let location = this.state.workLocationArr;

        console.log('state: ', this.state);
        console.log('props: ',this.props.history.location.state)
        
        return (
            <>
            <HomeHeader
            isShowBanner={false}
            />
            <div className='my-work'>
                <div className='menu'>
                    <div className='title-menu'>Việc của tôi</div>

                    <div className={this.state.recruitment?'menu-item-selected':'menu-item'}
                    onClick={()=>this.handleChangeMenu('recruitment')}
                    >
                        <FontAwesomeIcon icon={faFile}/>
                        <div>Tin tuyển dụng</div>
                    </div>
                    <div className={this.state.status?'menu-item-status-selected':'menu-item-status'}
                    onClick={()=>this.handleChangeMenu('status')}
                    >
                        <FontAwesomeIcon icon={faSignal}/>
                        <div>Trạng thái đơn tuyển dụng</div>
                    </div>
                    <div className={this.state.cv?'menu-item-selected':'menu-item'}
                    onClick={()=>this.handleChangeMenu('cv')}
                    >
                        <FontAwesomeIcon icon={faUsers}/>
                        <div>Hồ sơ & CV</div>
                    </div>
                    <div className={this.state.report?'menu-item-selected':'menu-item'}
                    onClick={()=>this.handleChangeMenu('report')}
                    >
                        <FontAwesomeIcon icon={faChartLine}/>
                        <div>Báo cáo tuyển dụng</div>
                    </div>
                    <div className={this.state.personalInfo?'menu-item-selected':'menu-item'}
                    onClick={()=>this.handleChangeMenu('personalInfo')}
                    >
                        <FontAwesomeIcon icon={faCircleInfo}/>
                        <div>Thông tin cá nhân</div>
                    </div>
                </div>

            {this.state.recruitment&&
                <div className='user-redux-container'>
                    <div className='title-create-edit'>
                        <div className={this.state.recruitmentAction==='create'?'title-create-form active':'title-create-form'}
                        onClick={()=>this.handleCreateEdit('create')}>
                            Tin mới 
                        </div>
                        <div className='slash-create-edit'> / </div>
                        <div className={this.state.recruitmentAction==='edit'?'title-edit-form active':'title-edit-form'}
                        onClick={()=>this.handleCreateEdit('edit')}
                        >
                            Sửa tin
                        </div>
                    </div>
                    {this.state.recruitmentAction==='create'&&
                    <div className="user-redux-body">
                        <div className='container'>
                            <div className='row'>
                                <div className='col-12'>
                                    <label>Tên</label>
                                    <input className='form-control' type='email'
                                    onChange={(event)=>this.handleOnChangeSelect(event,'title')}
                                    placeholder='Nhập tên chức vụ'
                                    />
                                </div>
                                <div className='col-3'>
                                    <label>Lĩnh vực</label>
                                    <select className='form-control'
                                    onChange={(event)=>this.handleOnChangeSelect(event,'field')}
                                    >
                                    {field&&field.length>0&&
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
                                    >
                                    {position&&position.length>0&&
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
                                    >
                                    {salary&&salary.length>0&&
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
                                    >
                                    {experience&&experience.length>0&&
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
                                    />
                                </div>
                                <div className='col-3'>
                                    <label>Địa điểm</label>
                                    <select className='form-control'
                                    onChange={(event)=>this.handleOnChangeSelect(event,'location')}
                                    >
                                    {location&&location.length>0&&
                                        location.map((item, index)=>{
                                        return(
                                            <option key={index}>{item.value}</option>
                                        )
                                        })
                                    }
                                    </select>
                                </div>

                                <div className='col-3'>
                                    <label>Giới tính</label>
                                    <select className='form-control'
                                    onChange={(event)=>this.handleOnChangeSelect(event,'gender')}
                                    >
                                        <option>Không yêu cầu</option>
                                        <option>Nam</option>
                                        <option>Nữ</option>
                                  
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
                                    <button className='create-new-post' onClick={()=>this.handleCreatePost()}>Tạo tin</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    }
                    {this.state.recruitmentAction==='edit'&&
                    <div>
                    <EditRecruitment/>
                    </div>
                    }





                </div>
            }
            {this.state.status&&
                <div className='manage-status'>
                <div className='title-manage-status'>Quản lý trạng thái đơn tuyển dụng</div>
                <TableManageStatus
                userInfoFromParent = {this.props.userInfo}
                handleChangeMenu = {this.handleChangeMenu}
                />
                </div>
            }
            {this.state.personalInfo&&
                <PersonalInfo/>

            }
            {this.state.cv&&
                <div className='manage-status'>
                <div className='title-manage-status'>Quản lý CV ứng viên</div>
                <AppliedCv/>
                </div>
            }
            {this.state.report&&
                <div className='manage-status'>
                <div className='title-manage-status'>Báo cáo tuyển dụng</div>
                <StatisticalReport/>
                </div>
            }
            </div>
            </>
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

export default connect(mapStateToProps, mapDispatchToProps)(Recruitment);
