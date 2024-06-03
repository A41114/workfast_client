import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { getAllCodeService } from '../../services/userService';
import './Job.scss'

import ReactPaginate from 'react-paginate';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faHeart} from '@fortawesome/free-regular-svg-icons'
import { faUser,faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { withRouter } from 'react-router';

import { getRecruitmentsToHomepage } from '../../services/userService';
import { ChangeFollowStatus,GetFollowlById } from '../../services/candidateService';


class Job extends Component {

    constructor(props){
        super(props);
        this.state={
            keyWords:'',
            locationArr:'',
            positionArr:'',
            fieldArr:'',
            experienceArr:'',
            salaryArr:'',

            location:'',
            position:'',
            field:'',
            experience:'',
            salary:'',

            recruitmentsArr:'',
            filterRecrutmentsArr:'',
            totalPages:'',
            filterRecrutmentsArrEachPage:'',


            //each job
            companyImg:'',
            recruitmentsLengthAfterFilter:'',

            followArr:'',
            
            onlySaved:false,
            
            
        }
    }
    async componentDidMount(){
        try {
            let resLoc = await getAllCodeService('LOCATION');
            let resPos = await getAllCodeService('POSITION');
            let resField = await getAllCodeService('FIELD');
            let resExp = await getAllCodeService('EXPERIENCE');
            let resSal = await getAllCodeService('SALARY');

            let resRecuitment = await getRecruitmentsToHomepage();

            resLoc.data.push({id:'ALL',key:'LOC0',type: 'LOCATION',createdAt:null, updatedAt:null, value:'Tất cả địa điểm'})
            resPos.data.push({id:'ALL',key:'POS0',type: 'POSITION',createdAt:null, updatedAt:null, value:'Tất cả vị trí'})
            resField.data.push({id:'ALL',key:'FIE0',type: 'FIELD',createdAt:null, updatedAt:null, value:'Tất cả lĩnh vực'})
            resExp.data.push({id:'ALL',key:'EXP0',type: 'EXPERIENCE',createdAt:null, updatedAt:null, value:'Tất cả kinh nghiệm'})
            resSal.data.push({id:'ALL',key:'SAL0',type: 'SALARY',createdAt:null, updatedAt:null, value:'Tất cả mức lương'})
            
            this.setState({
                locationArr:resLoc.data,
                positionArr:resPos.data,
                fieldArr:resField.data,
                experienceArr:resExp.data,
                salaryArr:resSal.data,

                recruitmentsArr:resRecuitment.recruitments,

                location:resLoc.data[resLoc.data.length-1].value,
                position:resPos.data[resPos.data.length-1].value,
                field:resField.data[resField.data.length-1].value,
                experience:resExp.data[resExp.data.length-1].value,
                salary:resSal.data[resSal.data.length-1].value,

                
            })
            this.getFilterRecrutmentsArr()
            
            if(this.props.userInfo){
                if(this.props.userInfo.id){
                    let follow = await GetFollowlById(this.props.userInfo.id)
                    this.setState({
                        followArr : follow.follow,
                        
                    })
                }
            }

        } catch (e) {
            console.log(e)
        }
    }
    async componentDidUpdate(prevProps, prevState, snapshot){
        if(prevProps.userInfo !== this.props.userInfo){
            if(this.props.userInfo.id){
                let follow = await GetFollowlById(this.props.userInfo.id)
                console.log()
                this.setState({
                    followArr : follow.follow,
                    
                })
            }
        }
        
    }
    //get check follow or not
    isFollowing=(recruitmentId)=>{
        // console.log('recruitmentId: ',recruitmentId)
        
        for(let i = 0;i<this.state.followArr.length;i++){
            // console.log('recruitmentId: ',recruitmentId)
            // console.log('follow: ',(+this.state.followArr[i].followedId))
            if(recruitmentId===(+this.state.followArr[i].followedId)&&this.state.followArr[i].type==='Recruitment'){
                // console.log('true')
                return (true)
            }
        }
        return (false)
    }
    //show saved only
    handleShowSavedOnly=async()=>{
        await this.setState({
            onlySaved:!this.state.onlySaved
        })
        this.getFilterRecrutmentsArr()
    }
    //on Change select and input
    handleOnChangeSelect=(event,inputId)=>{
        let copyState = this.state;
        copyState[inputId]=event.target.value;
        this.setState({
            ...copyState,
        })
        
        this.getFilterRecrutmentsArr()
    }
    //Filter Arr
    checkFilterAll=(element)=>{
        if(element==='Tất cả địa điểm'||element==='Tất cả vị trí'||element==='Tất cả lĩnh vực'||
        element==='Tất cả kinh nghiệm'||element==='Tất cả mức lương'){
            return(true)
        }else{return(false)}
    }
    getFilterRecrutmentsArr=()=>{
        let {location,position,field,experience,salary}=this.state
        let filterRecrutmentsArr=[]
        let filterRecrutmentsArrEachPage=[]
        let length=0;
        
        this.state.recruitmentsArr.map((item, index)=>{
            if(this.checkFilterAll(this.state.location)){
                location = item.workLocation
            }
            if(this.checkFilterAll(this.state.position)){
                position = item.position
            }
            if(this.checkFilterAll(this.state.field)){
                field = item.field
            }
            if(this.checkFilterAll(this.state.experience)){
                experience = item.yearOfExperience
            }
            if(this.checkFilterAll(this.state.salary)){
                salary = item.salary
            }
            if(location === item.workLocation&&position === item.position&&field === item.field&&
                experience === item.yearOfExperience&&salary === item.salary&&item.public==='show'&&
                item.title.toLowerCase().includes(this.state.keyWords.toLowerCase())){
                    //only saved off
                    if(!this.state.onlySaved){
                        filterRecrutmentsArr.push(item)
                        if(length<=11){
                            filterRecrutmentsArrEachPage.push(item)
                            length++
                        }
                    }
                    //only saved on
                    else{
                        if(this.isFollowing(item.id)){
                            filterRecrutmentsArr.push(item)
                            if(length<=11){
                                filterRecrutmentsArrEachPage.push(item)
                                length++
                            }
                        }
                    }
            }
        })
        
        this.setState({
            filterRecrutmentsArr:filterRecrutmentsArr,
            totalPages : Math.ceil(filterRecrutmentsArr.length/12),
            filterRecrutmentsArrEachPage: filterRecrutmentsArrEachPage,
            
        })
        


    }


    //page
    getTotalPage=(length)=>{
        // console.log('lengh: ',length)
        let totalPage = Math.ceil(length/12)
        return (totalPage)
    }
    //view recruitment detail
    handleViewRecruitmentDetail=(recruitment)=>{
        // console.log('recruitment: ',recruitment.id)
        this.props.history.push(`/recruitment-detail/${recruitment.id}`)
    }
    //follow recruitment
    // handleFollowRecruitment=(recruitment)=>{
    //     console.log('recruit: ',recruitment)
    // }

    

    render() {
        //page click
        const handlePageClick=(event)=>{
            let filterRecrutmentsArrEachPage=[]
            // console.log('event lib: ',event)
            for (let i = 12*event.selected; i <= 12*event.selected+11; i++) {
                if(!this.state.filterRecrutmentsArr[i]){
                    break;
                }
                filterRecrutmentsArrEachPage.push(this.state.filterRecrutmentsArr[i])
            }
            this.setState({
                filterRecrutmentsArrEachPage : filterRecrutmentsArrEachPage
            })
        }

        // console.log('job: ',this.state)
        //console.log('total pages: ',this.state.totalPages)
        //console.log('origin arr: ',this.state.recruitmentsArr)
        //console.log('filter arr: ',this.state.filterRecrutmentsArrEachPage)

       
        return (
            <div className='find-job-container'>
                <div className='find-job-title'>
                    Tìm việc làm
                </div>
                <div className='find-job-content'>
                    <div className='col-2 job-filter'>
                        <select className='form-control'
                        onChange={(event)=>this.handleOnChangeSelect(event,'field')}
                        >
                        {this.state.fieldArr&&this.state.fieldArr.length>0&&
                            this.state.fieldArr.map((item, index)=>{
                            return(
                                <option selected={item.value===this.state.field&&'selected'} key={index}>{item.value}</option>
                            )
                            })
                        }
                        </select>
                    </div>
                    <div className='col-2 job-filter'>
                        <select className='form-control'
                        onChange={(event)=>this.handleOnChangeSelect(event,'position')}
                        >
                        {this.state.positionArr&&this.state.positionArr.length>0&&
                            this.state.positionArr.map((item, index)=>{
                            return(
                                <option selected={item.value===this.state.position&&'selected'} key={index}>{item.value}</option>
                            )
                            })
                        }
                        </select>
                    </div>
                    
                    <div className='col-2 job-filter'>
                        <select className='form-control'
                        onChange={(event)=>this.handleOnChangeSelect(event,'salary')}
                        >
                        {this.state.salaryArr&&this.state.salaryArr.length>0&&
                            this.state.salaryArr.map((item, index)=>{
                            return(
                                <option selected={item.value===this.state.salary&&'selected'} key={index}>{item.value}</option>
                            )
                            })
                        }
                        </select>
                    </div>
                    <div className='col-2 job-filter'>
                        <select className='form-control'
                        onChange={(event)=>this.handleOnChangeSelect(event,'experience')}
                        >
                        {this.state.experienceArr&&this.state.experienceArr.length>0&&
                            this.state.experienceArr.map((item, index)=>{
                            return(
                                <option selected={item.value===this.state.experience&&'selected'} key={index}>{item.value}</option>
                            )
                            })
                        }
                        </select>
                    </div>
                    <div className='col-2 job-filter'>
                        <select className='form-control'
                        onChange={(event)=>this.handleOnChangeSelect(event,'location')}
                        >
                        {this.state.locationArr&&this.state.locationArr.length>0&&
                            this.state.locationArr.map((item, index)=>{
                            return(
                                <option selected={item.value===this.state.location&&'selected'} key={index}>{item.value}</option>
                            )
                            })
                        }
                        </select>
                    </div>
                    <div className='search-container'>
                        <div className='search-content'>
                            <FontAwesomeIcon icon={faMagnifyingGlass} className='search-icon'/>
                            <input type='form-control search' placeholder='Nhập tên công việc' onChange={(event)=>this.handleOnChangeSelect(event,'keyWords')}></input>
                        </div>
                    </div>
                    <div className='show-saved-only'><button className={!this.state.onlySaved?'show-save-only-btn':'show-save-only-btn active'} 
                                                        onClick={()=>this.handleShowSavedOnly()}>Đã lưu</button></div>
                                                        
                    <div className='all-job'>
                    {this.state.filterRecrutmentsArrEachPage&&this.state.filterRecrutmentsArrEachPage.length>0&&
                        this.state.filterRecrutmentsArrEachPage.map((item, index)=>{
                            return(
                                <div key={index} className='each-job' onClick={()=>this.handleViewRecruitmentDetail(item)}>
                                    <div className='each-job-top'>
                                        <div className='preview-img-container'>
                                        <div className='preview-image'
                                        previewImgURL
                                            style={{backgroundImage: `url(${new Buffer(item.Company.companyImage,'base64').toString('binary')})` }}
                                        ></div>
                                        </div>
                                        
                                        <div>
                                            <div className='each-job-title'>
                                            {item.title}
                                            </div>

                                            <div className='each-job-company-name'>
                                            {item.Company.companyName}
                                            </div>
                                        </div>
                                    </div>

                                    <div className='each-job-bottom'>
                                        <div className='each-job-bottom-left'>
                                            <div className='each-job-salary'>
                                                {item.salary}
                                            </div>
                                            <div className='each-job-location'>
                                                {item.workLocation}
                                            </div>
                                        </div>
                                        
                                        <span className={!this.isFollowing(item.id)?'each-job-bottom-right':'each-job-bottom-right active'}><FontAwesomeIcon icon={faHeart}/> </span>
                                        
                                    </div>
                                </div>
                            )
                           
                        })
                    }
                    </div>
                    
                    <div className='job-page'>
                        <ReactPaginate
                        breakLabel="..."
                        nextLabel=">"
                        onPageChange={handlePageClick}
                        pageRangeDisplayed={5}
                        pageCount={this.state.totalPages}
                        previousLabel="<"
                        

                        pageClassName='page-item'
                        pageLinkClassName='page-link'
                        previousClassName='page-item'
                        previousLinkClassName='page-link'
                        nextClassName='page-item'
                        nextLinkClassName='page-link'
                        breakClassName='page-item'
                        breakLinkClassName='page-link'
                        containerClassName='pagination'
                        activeClassName='active'
                        />
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Job));