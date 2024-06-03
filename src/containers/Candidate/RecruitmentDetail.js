import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faRegular, faPaperPlane, faHeart} from '@fortawesome/free-regular-svg-icons'
import { faSackDollar, faLocationDot, faHourglass, faClock, faUserGroup, faArrowUpRightFromSquare, faRankingStar, faUser, faArrowRight} from '@fortawesome/free-solid-svg-icons'

import HomeHeader from '../HomePage/HomeHeader';
import './RecruitmentDetail.scss'
import moment from 'moment';
import { getRecruitmentDetaiById,ChangeFollowStatus,GetFollowlById } from '../../services/candidateService';
import ModalApplyJob from './ModalApplyJob';



class RecruitmentDetail extends Component {
    constructor(props){
        super(props);
        this.state={
            recruitmentId:-1,
            RecruitmentDetail:'',
            today: moment(new Date()).format('DD/MM/YYYY'),
            isOpenModalApplyJob:false,

            isFollowing:'',

        }
    }
    async componentDidMount(){
        this.getAllData()
    }
    //call by componentDidMount to set base data each render
    getAllData = async()=>{
        if(this.props.match&&this.props.match.params.id){
            let id = this.props.match.params.id;//id on url
            //console.log('id on url: ',id)

            this.setState({
                recruitmentId:id
            })
            let resDetail = await getRecruitmentDetaiById(id);
            //console.log('check res from doctor: ', resDetail.data)
            if(resDetail&&resDetail.errCode===0){
                this.setState({
                    RecruitmentDetail:resDetail.data
                })
            }
        }
        if(this.props.userInfo.id){
            await this.GetFollow(this.props.userInfo.id)
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot){
        if(prevProps.userInfo !== this.props.userInfo){
            if(this.props.userInfo.id){
                await this.GetFollow(this.props.userInfo.id)
            }
        }
        
    }
    //set state isFollowing of each job
    GetFollow=async(userId)=>{
        let follow = await GetFollowlById(userId)
        this.setState({
            isFollowing:false
        })
        
        for(let i = 0;i<follow.follow.length;i++){
            // console.log('recruitmentId: ',this.state.recruitmentId)
            // console.log('follow: ',follow.follow[i].followedId)
            if(this.state.recruitmentId===follow.follow[i].followedId&&follow.follow[i].type==='Recruitment'){
                this.setState({
                    isFollowing:true
                })
                break;
            }
        }
    }
    //handle follow recruitment
    handleFollowRecruitment=async()=>{
        let res = await ChangeFollowStatus({
            userId: this.props.userInfo.id,
            followedId: this.state.recruitmentId,
            type:'Recruitment',
        })
        if(res.errCode===0){
            await this.getAllData();
        }
        
    }
    //toggle modal
    toggleModalApplyJob=()=>{
        if(!this.isLater(this.state.today,this.state.RecruitmentDetail.endDate)){
            this.setState({
                isOpenModalApplyJob : !this.state.isOpenModalApplyJob
            })
        }
    }
    //compare date
    isLater=(date1,date2)=>{
        // console.log('day 1: ',date1)
        // console.log('day 2: ',date2)
        let d1 = date1.split("/");
        let d2 = date2.split("/");

        // console.log('d1: ',d1)
        // console.log('d2: ',d2)
        let latest = false;
        
        if (parseInt(d1[2]) > parseInt(d2[2])) {
            latest = true;
        } else if (parseInt(d1[2]) === parseInt(d2[2])) {
            if (parseInt(d1[1]) > parseInt(d2[1])) {
                latest = true;
            } else if (parseInt(d1[1]) === parseInt(d2[1])) {
                if (parseInt(d1[0]) > parseInt(d2[0])) {
                    latest = true;
                } 
            }
        }
        
        return latest;
    }
    //view company
    handleViewCompanyDetail=(company)=>{
        // console.log('companyId: ',company.id)
        this.props.history.push(`/company-detail/${company.id}`)
    }

    render() {
        let {RecruitmentDetail}=this.state
        //console.log('open: ',this.state.isOpenModalApplyJob)
        //console.log('today-: ',this.state.today-this.state.RecruitmentDetail.endDate)
        console.log('isFollowing: ',this.state.isFollowing)

        return (
            <div>
                <HomeHeader
                isShowBanner={false}
                />
                <div className='recruitment-detail-container'>

                    <div className='link'>
                        <div className='home-page-title'>Trang chủ</div>
                        <span><FontAwesomeIcon icon={faArrowRight}/></span>
                        <div className='find-work-title'>Tìm việc</div>
                        <span><FontAwesomeIcon icon={faArrowRight}/></span>
                        <div className='recruitment-title'>{this.state.RecruitmentDetail.title}</div>
                    </div>
                    
                    <div className='recruitment-detail-content'>
                        <ModalApplyJob
                        isOpen={this.state.isOpenModalApplyJob}
                        toggleFromParent={this.toggleModalApplyJob}
                        RecruitmentDetail={this.state.RecruitmentDetail}
                        />
                        

                        <div className='left-content'>
                            <div className='left-top'>
                                <div className='recruitment-title'>{this.state.RecruitmentDetail.title}</div>
                                <div className='attribute'>
                                    <div className='attribute-content'>
                                        <span><FontAwesomeIcon icon={faSackDollar}/> </span>
                                        <div className='attribute-text'>
                                            <div className='attribute-title'>Mức lương</div>
                                            <diV className='attribute-value'>{this.state.RecruitmentDetail.salary}</diV>
                                        </div>
                                    </div>
                                    <div className='attribute-content'>
                                        <span><FontAwesomeIcon icon={faLocationDot}/> </span>
                                        <div className='attribute-text'>
                                            <div className='attribute-title'>Địa điểm</div>
                                            <diV className='attribute-value'>{this.state.RecruitmentDetail.workLocation}</diV>
                                        </div>
                                    </div>
                                    <div className='attribute-content'>
                                        <span><FontAwesomeIcon icon={faHourglass}/> </span>
                                        <div className='attribute-text'>
                                            <div className='attribute-title'>Kinh nghiệm</div>
                                            <diV className='attribute-value'>{this.state.RecruitmentDetail.yearOfExperience}</diV>
                                        </div>
                                    </div>
                                </div>
                                <div className='end-date'>
                                    <span><FontAwesomeIcon icon={faClock}/> </span>
                                    <div className='end-date-title'>Hạn nộp hồ sơ: {this.state.RecruitmentDetail.endDate}</div>
                                </div>
                                <div className='left-top-btn'>
                                    <div className={RecruitmentDetail.endDate&&!this.isLater(this.state.today,RecruitmentDetail.endDate)?'apply-now':'apply-now disable'} onClick={()=>this.toggleModalApplyJob()}>
                                        <span><FontAwesomeIcon icon={faPaperPlane}/> </span>
                                        <div className='apply-now-title'>Ứng tuyển ngay</div>
                                    </div>
                                    <div className='save-recruitment active'onClick={()=>this.handleFollowRecruitment()}>
                                        
                                        {!this.state.isFollowing?
                                        <>
                                        <span><FontAwesomeIcon icon={faHeart}/> </span>
                                        <div className='save-recruitment-title'>Lưu tin</div></>:
                                        <div className='save-recruitment-title'>Hủy</div>
                                        }
                                    </div>
                                </div>
                            </div>

                            <div className='left-bottom'>
                                <div className='recruitment-info-title'>
                                    <div className='start-line'></div>
                                    <div>Chi tiết tin tuyển dụng</div>
                                </div>
                                <div className='recruitment-info'>
                                    <div dangerouslySetInnerHTML={{__html:   this.state.RecruitmentDetail.jobDescriptionHTML   }}>
                                    </div>
                                </div>

                                <div className='left-bottom-btn'>
                                    <div className={RecruitmentDetail.endDate&&!this.isLater(this.state.today,RecruitmentDetail.endDate)?'apply-now':'apply-now disable'} onClick={()=>this.toggleModalApplyJob()}>
                                        
                                        <span><FontAwesomeIcon icon={faPaperPlane}/> </span>
                                        <div className='apply-now-title'>Ứng tuyển ngay</div>
                                        
                                    </div>
                                    <div className='save-recruitment' onClick={()=>this.handleFollowRecruitment()}>
                                        {!this.state.isFollowing?
                                        <>
                                        <span><FontAwesomeIcon icon={faHeart}/> </span>
                                        <div className='save-recruitment-title'>Lưu tin</div></>:
                                        <div className='save-recruitment-title'>Hủy</div>
                                        }
                                    </div>
                                </div>
                                <div className='end-date'>
                                    <span><FontAwesomeIcon icon={faClock}/> </span>
                                    <div className='end-date-title'>Hạn nộp hồ sơ: {this.state.RecruitmentDetail.endDate}</div>
                                </div>
                            </div>
                        </div>



                        <div className='right-content'>
                            <div className='right-top'>
                                <div className='company-title'>
                                    {RecruitmentDetail&&
                                    <div className='preview-img-container'>
                                    <div className='preview-image'
                                    previewImgURL
                                        style={{backgroundImage: `url(${new Buffer(this.state.RecruitmentDetail.Company.companyImage,'base64').toString('binary')})` }}
                                    ></div>
                                    </div>
                                    }
                                    <div className='company-name'>{RecruitmentDetail&&RecruitmentDetail.Company.companyName}</div>
                                </div>
                                <div className='company-size'>
                                    <span><FontAwesomeIcon icon={faUserGroup}/> Quy mô</span>
                                    <div className='size-content'>{RecruitmentDetail&&RecruitmentDetail.Company.size}</div>
                                </div>
                                <div className='company-address'>
                                    <span><FontAwesomeIcon icon={faLocationDot}/> Địa chỉ</span>
                                    <div className='address-content'>{RecruitmentDetail&&RecruitmentDetail.Company.address}</div>
                                </div>
                                <div className='to-company'>
                                    <span onClick={()=>this.handleViewCompanyDetail(RecruitmentDetail.Company)}>Xem trang công ty <FontAwesomeIcon icon={faArrowUpRightFromSquare}/></span>
                                </div>
                            </div>
                            <div className='right-middle'>
                                <div className='right-middle-title'>Thông tin chung</div>
                                <div className='attribute'>
                                    <div className='attribute-content'>
                                        <span><FontAwesomeIcon icon={faRankingStar}/> </span>
                                        <div className='attribute-text'>
                                            <div className='attribute-title'>Cấp bậc</div>
                                            <diV className='attribute-value'>{this.state.RecruitmentDetail.position}</diV>
                                        </div>
                                    </div>

                                    <div className='attribute-content'>
                                        <span><FontAwesomeIcon icon={faHourglass}/> </span>
                                        <div className='attribute-text'>
                                            <div className='attribute-title'>Kinh nghiệm</div>
                                            <diV className='attribute-value'>{this.state.RecruitmentDetail.yearOfExperience}</diV>
                                        </div>
                                    </div>

                                    <div className='attribute-content'>
                                        <span><FontAwesomeIcon icon={faUserGroup}/> </span>
                                        <div className='attribute-text'>
                                            <div className='attribute-title'>Số lượng tuyển</div>
                                            <diV className='attribute-value'>{this.state.RecruitmentDetail.amount}</diV>
                                        </div>
                                    </div>

                                    <div className='attribute-content'>
                                        <span><FontAwesomeIcon icon={faUser}/> </span>
                                        <div className='attribute-text'>
                                            <div className='attribute-title'>Giới tính</div>
                                            <diV className='attribute-value'>{this.state.RecruitmentDetail.gender}</diV>
                                        </div>
                                    </div>
                                </div>
                                
                                
                            </div>
                            <div className='right-bottom'>
                                <div className='recruitment-field'>
                                    <div className='recruitment-field-title'>Lĩnh vực</div>
                                    <div className='recruitment-field-value'>{this.state.RecruitmentDetail.field}</div>
                                </div>
                                <div className='recruitment-location'>
                                    <div className='recruitment-location-title'>Khu vực</div>
                                    <div className='recruitment-location-value'>{this.state.RecruitmentDetail.workLocation}</div>
                                </div>
                            </div>





                        
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

export default connect(mapStateToProps, mapDispatchToProps)(RecruitmentDetail);
