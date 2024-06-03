import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import'./KeyIndustries.scss'
import { getRecruitmentsToHomepage, getAllCodeService } from '../../services/userService';
class KeyIndustries extends Component {
    constructor(props){
        super(props);
        this.state={
            recruitmentsArr:'',
            fieldArr:'',
            countRecruitmentsEachField:'',
            
            
            
        }
    }
    componentDidMount(){
        this.getCountRecruitmentsEachField();

    }
    componentDidUpdate(prevProps, prevState, snapshot){
        

    }
    async getCountRecruitmentsEachField(){
        let resRecuitment = await getRecruitmentsToHomepage()
        let resField = await getAllCodeService('FIELD')
        // console.log('recruitment: ',resRecuitment.recruitments)
        // console.log('field: ',resField.data)

        let countRecruitmentsEachField=[];

        for (let i = 0; i < resField.data.length; i++) {
            let count=0
            for (let j = 0; j < resRecuitment.recruitments.length; j++) {
                if(resRecuitment.recruitments[j].field===resField.data[i].value){
                    count++
                }
            }
            countRecruitmentsEachField.push({id:resField.data[i].id, value:resField.data[i].value,recruitmentCount:count})
        }

        this.setState({
            countRecruitmentsEachField : countRecruitmentsEachField
        })
        
    }

    render() {
        console.log('states: ',this.state)
    
        return (
            <div className='key-industry-container'>
                <div className='key-industry-content'>
                    <div className='key-industry-title'>
                        Ngành nghề trọng điểm
                    </div>
                    <div className='all-key-industry'>
                        <div className='key-industry'>
                            <div className='consumables'></div>
                            <div className='industry-title'>Hàng tiêu dùng</div>
                            {this.state.countRecruitmentsEachField&&this.state.countRecruitmentsEachField.length>0&&
                                this.state.countRecruitmentsEachField.map((item,index)=>{
                                    if(item.value==='Bán lẻ - Hàng tiêu dùng'){
                                        return(
                                            <div className='recruitments-count'>{item.recruitmentCount} việc làm</div>
                                        )
                                    }
                                })
                            }
                        </div>
                        <div className='key-industry'>
                            <div className='it'></div>
                            <div className='industry-title'>It phần mềm</div>
                            {this.state.countRecruitmentsEachField&&this.state.countRecruitmentsEachField.length>0&&
                                this.state.countRecruitmentsEachField.map((item,index)=>{
                                    if(item.value==='IT'){
                                        return(
                                            <div className='recruitments-count'>{item.recruitmentCount} việc làm</div>
                                        )
                                    }
                                })
                            }
                        </div>
                        <div className='key-industry'>
                            <div className='entertainment'></div>
                            <div className='industry-title'>Giải trí</div>
                            {this.state.countRecruitmentsEachField&&this.state.countRecruitmentsEachField.length>0&&
                                this.state.countRecruitmentsEachField.map((item,index)=>{
                                    if(item.value==='Giải trí'){
                                        return(
                                            <div className='recruitments-count'>{item.recruitmentCount} việc làm</div>
                                        )
                                    }
                                })
                            }
                        </div>
                        <div className='key-industry'>
                            <div className='travel'></div>
                            <div className='industry-title'>Du lịch</div>
                            {this.state.countRecruitmentsEachField&&this.state.countRecruitmentsEachField.length>0&&
                                this.state.countRecruitmentsEachField.map((item,index)=>{
                                    if(item.value==='Du lịch'){
                                        return(
                                            <div className='recruitments-count'>{item.recruitmentCount} việc làm</div>
                                        )
                                    }
                                })
                            }
                        </div>
                        <div className='key-industry'>
                            <div className='real-estate'></div>
                            <div className='industry-title'>Bất động sản</div>
                            {this.state.countRecruitmentsEachField&&this.state.countRecruitmentsEachField.length>0&&
                                this.state.countRecruitmentsEachField.map((item,index)=>{
                                    if(item.value==='Bất động sản'){
                                        return(
                                            <div className='recruitments-count'>{item.recruitmentCount} việc làm</div>
                                        )
                                    }
                                })
                            }
                        </div>
                        <div className='key-industry'>
                            <div className='securities'></div>
                            <div className='industry-title'>Chứng khoán</div>
                            {this.state.countRecruitmentsEachField&&this.state.countRecruitmentsEachField.length>0&&
                                this.state.countRecruitmentsEachField.map((item,index)=>{
                                    if(item.value==='Chứng khoán'){
                                        return(
                                            <div className='recruitments-count'>{item.recruitmentCount} việc làm</div>
                                        )
                                    }
                                })
                            }
                        </div>
                        <div className='key-industry'>
                            <div className='repair-mainternance'></div>
                            <div className='industry-title'>Bảo trì/Sửa chữa</div>
                            {this.state.countRecruitmentsEachField&&this.state.countRecruitmentsEachField.length>0&&
                                this.state.countRecruitmentsEachField.map((item,index)=>{
                                    if(item.value==='Bảo trì/Sửa chữa'){
                                        return(
                                            <div className='recruitments-count'>{item.recruitmentCount} việc làm</div>
                                        )
                                    }
                                })
                            }
                        </div>
                        <div className='key-industry'>
                            <div className='insurance'></div>
                            <div className='industry-title'>Bảo hiểm</div>
                            {this.state.countRecruitmentsEachField&&this.state.countRecruitmentsEachField.length>0&&
                                this.state.countRecruitmentsEachField.map((item,index)=>{
                                    if(item.value==='Bảo hiểm'){
                                        return(
                                            <div className='recruitments-count'>{item.recruitmentCount} việc làm</div>
                                        )
                                    }
                                })
                            }
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

export default connect(mapStateToProps, mapDispatchToProps)(KeyIndustries);
