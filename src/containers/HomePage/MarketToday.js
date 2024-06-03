import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import moment from 'moment';

import './MarketToday.scss';

import { getRecruitmentsToHomepage, getAllCompanies } from '../../services/userService';

class MarketToday extends Component {
    constructor(props){
        super(props);
        this.state={
            recruitmentArr:[],
            newRecruitmentSort:[],

            countJobToday:'',
            countRecruitmentsCurrentPublic:'',

            countCompanyCurrentRecruit:'',
            
            
            
        }
    }
    componentDidMount(){
        this.getCountCompanyRecruitments()

    }
    componentDidUpdate(prevProps, prevState, snapshot){
        

    }
    async getCountCompanyRecruitments(){
        let resRecuitment = await getRecruitmentsToHomepage()
        let resCompany = await getAllCompanies()
        
        //resRecuitment.sort(function (a, b) {return b.recruitments.updatedAt - a.recruitments.updatedAt})
        // console.log('recruitment: ',resRecuitment..length)
        // console.log('company: ',resCompany.allComp.length)

        let countCompanyRecruitments=[];
        let resRecuitmentSort = [];
        let countJobToday=0;
        let countRecruitmentsCurrentPublic=0;
        let countCompanyCurrentRecruit=0;

        

        for (let i = 0; i < resCompany.allComp.length; i++) {
            let count=0

            let atLeastOneRecruitment=false;
            
            for (let j = 0; j < resRecuitment.recruitments.length; j++) {
                if(resRecuitment.recruitments[j].companyId===resCompany.allComp[i].id){
                    count++

                    //count public recruitments of each company
                    if(resRecuitment.recruitments[j].public==='show'){
                        atLeastOneRecruitment=true;
                    }
                }
                //to resRecuitmentSort
                if(i===0){
                    resRecuitmentSort.push({id:resRecuitment.recruitments[j].id, companyImage: resRecuitment.recruitments[j].Company.companyImage, title:resRecuitment.recruitments[j].title,
                    salary:resRecuitment.recruitments[j].salary, companyName: resRecuitment.recruitments[j].Company.companyName, workLocation : resRecuitment.recruitments[j].workLocation,
                    updatedAt: resRecuitment.recruitments[j].updatedAt, public: resRecuitment.recruitments[j].public
                    })
                    //to new job today
                    if(moment(resRecuitment.recruitments[j].updatedAt).format('DD/MM/YYYY')===moment(new Date()).format('DD/MM/YYYY')){
                        countJobToday++
                    }
                    // to recruitments current public
                    if(resRecuitment.recruitments[j].public==='show'){
                        countRecruitmentsCurrentPublic++
                    }
                }
                
            }
            //to number of company is recruiting
            if(atLeastOneRecruitment){countCompanyCurrentRecruit++}

            countCompanyRecruitments.push({id:resCompany.allComp[i].id, companyName:resCompany.allComp[i].companyName, companyImage:resCompany.allComp[i].companyImage, recruitmentCount:count})
        }
        //console.log('public: ',countRecruitmentsCurrentPublic)

        //sort array by recruitmentCount* normal a-b, top b-a
        countCompanyRecruitments.sort(function (a, b) {return b.recruitmentCount - a.recruitmentCount})


        //sort array by date from new -> old* normal a-b, top b-a
        resRecuitmentSort.sort(function (a, b) {return a.updatedAt>b.updatedAt?-1 : a.updatedAt<b.updatedAt ? 1 : 0;})



        this.setState({
            countCompanyRecruitments : countCompanyRecruitments,
            recruitmentArr : resRecuitment.recruitments,
            newRecruitmentSort : resRecuitmentSort,
            countJobToday : countJobToday,
            countRecruitmentsCurrentPublic : countRecruitmentsCurrentPublic,
            countCompanyCurrentRecruit : countCompanyCurrentRecruit
        })
        
    }
    handleViewDetailRecruitment=(item)=>{
        this.props.history.push(`/recruitment-detail/${item.id}`)
    }

    render() {
        //console.log('States: ',this.state)
        let i=0;
        return (
            <div className='market-today-container'>
                <div className='market-today-content'>
                    <div className='market-today-title'>Thị trường việc làm hôm nay  
                        <div className='today'>{moment(new Date()).format('DD/MM/YYYY')}</div>
                    </div>
                    <div className='market-today-content-bottom'>
                    <div className='market-today-content-left'>
                        <div className='new-job-image'>
                        </div>
                        <div className='new-job-title'>Việc làm mới nhất 
                            
                        </div>

                        <div className='new-job-all'>
                        {this.state.newRecruitmentSort&&this.state.newRecruitmentSort.length>0&&
                            this.state.newRecruitmentSort.map((item,index)=>{
                                if(i<4&&item.public==='show'){
                                    i++
                                    return(
                                        <div className='new-job-item' key={index} onClick={()=>this.handleViewDetailRecruitment(item)}>
                                            <div className='preview-img-container'>
                                                <div className='preview-image'
                                                previewImgURL
                                                    style={{backgroundImage: `url(${new Buffer(item.companyImage,'base64').toString('binary')})` }}
                                                >
                                                </div>
                                                <div className='new-job-info'>{item.title} ({item.salary})
                                                    <div className='new-job-company-name'>{item.companyName}
                                                        <div className='new-job-location'>{item.workLocation}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                            })
                        }
                        </div>
                    </div>
                    <div className='market-today-content-right'>
                        <div className='market-today-content-top-right'>
                        
                            <div className='top-content'>
                                <div className='count'>
                                    {this.state.countJobToday}
                                </div>
                                <div className='element'>
                                    Việc làm mới trong hôm nay
                                </div>
                            </div>

                            <div className='top-content'>
                                <div className='count'>
                                    {this.state.countRecruitmentsCurrentPublic}
                                </div>
                                <div className='element'>
                                    Việc làm đang tuyển
                                </div>
                            </div>

                            <div className='top-content'>
                                <div className='count'>
                                    {this.state.countCompanyCurrentRecruit}
                                </div>
                                <div className='element'>
                                    Công ty đang tuyển
                                </div>
                            </div>
                        
                        </div>
                        <div className='market-today-content-bottom-right'>
                            <div className='chart1'></div>
                            <div className='chart2'></div>
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
        isLoggedIn: state.user.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MarketToday));
