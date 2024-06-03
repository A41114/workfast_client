import React, { Component, Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './Usermanage.scss';
import { getAllUser, createNewUserService, deleteUserService, editUserService } from '../../services/userService';
import ModalUser from './ModalUser';
import ModalEditUser from './ModalEditUser';
import { Redirect } from 'react-router-dom/cjs/react-router-dom.min';

import { emitter } from '../../utils/emitter';
import { getAllCompanies,deleteCompanyService } from '../../services/userService';
import ModalCreateCompany from './ModalCreateCompany';
import ModalEditCompany from './ModalEditCompany';
import { toast } from 'react-toastify';


class CompanyManage extends Component {

    constructor(props){
        super(props);
        this.state = {
            arrCompanies:'',
            isOpenModalCreateCompany:false,
            isOpenModalEditCompany :false,
            companyInfo:'',
        }
    }

    async componentDidMount() {
        await this.getAllCompanyFromService();
    }
    

    getAllCompanyFromService= async()=>{
        let resComp = await getAllCompanies();
        if(resComp && resComp.errCode === 0){
            this.setState({
                arrCompanies : resComp.allComp
            })
        }
    }
    
    toggleCreateCompanyModal =()=>{
        this.setState({
            isOpenModalCreateCompany:!this.state.isOpenModalCreateCompany,
        })
        this.componentDidMount()
    }
    toggleEditCompanyModal = (item)=>{
        this.setState({
            companyInfo : item,
            isOpenModalEditCompany:!this.state.isOpenModalEditCompany,
        })
    }
    //Delete company
    handleDeleteCompany = async(item)=>{
        let res = await deleteCompanyService(item.id)
        if(res.errCode===0){
            toast.success('Xóa công ty thành công !!!')
            this.componentDidMount()
        }else{
            toast.error('Xóa công ty thất bại...')
        }
    }
    
    
    render() {
        // console.log('check render', this.state)

        return (
            <div className="user-container">
                <ModalCreateCompany
                    isOpen={this.state.isOpenModalCreateCompany}
                    toggleFromParent={this.toggleCreateCompanyModal}
                />
                <ModalEditCompany
                    isOpen={this.state.isOpenModalEditCompany}
                    toggleFromParent={this.toggleEditCompanyModal}
                    companyInfo = {this.state.companyInfo}
                />
                
                <div className='title text center'>Quản lý công ty</div>
                <div className='mx-1'>
                    <button className=
                    'btn btn-primary px-3'
                    onClick={()=>this.toggleCreateCompanyModal()}
                    ><i class="fas fa-plus"></i>Tạo mới công ty</button>
                </div>
                <div className='users-table mt-3 mx-1'>
                
                    <table id="customers">
                    <tbody>
                        <tr>
                        <th>Tên</th>
                        <th>Địa điểm</th>
                        <th>Lĩnh vực</th>
                        <th>Hành động</th>
                        </tr>
                        { this.state.arrCompanies && this.state.arrCompanies.map((item, index)=>{
                            return(
                                <>
                                    <tr key = {index}>
                                        <td>{item.companyName}</td>
                                        <td>{item.companyLocation}</td>
                                        <td>{item.companyIndustry}</td>
                                        <td>
                                            <button className='btn-edit' onClick={()=>this.toggleEditCompanyModal(item)}><i className="fas fa-pencil-alt"></i></button>
                                            <button className='btn-delete' onClick={()=>this.handleDeleteCompany(item)}><i className="fas fa-trash"></i></button>
                                        </td>
                                    </tr>
                                </>
                            )
                        })
                        }
                        </tbody>
                    </table>

                </div>



            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CompanyManage);
