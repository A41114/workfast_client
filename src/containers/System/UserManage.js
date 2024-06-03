import React, { Component, Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './Usermanage.scss';
import { getAllUser, createNewUserService, deleteUserService, editUserService } from '../../services/userService';
import ModalUser from './ModalUser';
import ModalEditUser from './ModalEditUser';
import { Redirect } from 'react-router-dom/cjs/react-router-dom.min';

import { emitter } from '../../utils/emitter';


class UserManage extends Component {

    constructor(props){
        super(props);
        this.state = {
            arrUsers: [],
            isOpenModalUser : false,
            isOpenModalEditUser : false,
            userEdit:{}
        }
    }

    async componentDidMount() {
        await this.getAllUserFromReact();
    }
    /**Life cycle// luong chay chuong trinh
     * 1.Run constructor -> init state
     * 2.Did mount (set state)
     * 3.Render
     * 
     * 
     * 
     * 
     */
    getAllUserFromReact= async()=>{
        let response = await getAllUser('ALL');
        if(response && response.errCode === 0){
            this.setState({
                arrUsers : response.users
            })
        }
    }
    handleAddNewUser = ()=>{
        this.setState({
            isOpenModalUser:true,
        })
    }
    toggleUserModal =()=>{
        this.setState({
            isOpenModalUser:!this.state.isOpenModalUser,
        })
        this.componentDidMount()
    }
    toggleUserEditModal = ()=>{
        this.setState({
            isOpenModalEditUser:!this.state.isOpenModalEditUser,
            
        })
        this.componentDidMount()
    }
    createNewUser = async (data)=>{
        try {
            let response = await createNewUserService(data);
            if(response && response.errCode !== 0){
                alert(response.errMessage)
            }
            else{
                await this.getAllUserFromReact();
                this.setState({
                    isOpenModalUser:false
                })
                //fire event
                emitter.emit('EVENT_CLEAR_MODAL_DATA')
            }
            
        } catch (e) {
            console.log(e)
        }
    }
    handleDeleteUser = async(user)=>{
        try {
            let res = await deleteUserService(user.id)
            if(res && res.errCode===0){
                await this.getAllUserFromReact();
            }
            else{
                alert(res.errCode)
            }
            //console.log(res);
            
        } catch (e) {
            console.log(e)
        }
    }
    handleEditUser = async(user)=>{
    console.log('check edit user', user)
    this.setState({
        isOpenModalEditUser:true,
        userEdit : user
    })

    }
    doEditUser = async(user)=>{
        try {
            let res = await editUserService(user);
            if(res && res.errCode===0){
                this.setState({
                    isOpenModalEditUser : false
                })
                await this.getAllUserFromReact();
            }
            else{
                alert(res.errCode);
            }
        } catch (e) {
            console.log(e);
        }
        
    }
    render() {
        //console.log('check render', this.state)
        let arrUsers = this.state.arrUsers;
        return (
            <div className="user-container">
                <ModalUser
                    isOpen={this.state.isOpenModalUser}
                    toggleFromParent={this.toggleUserModal}
                    createNewUser = {this.createNewUser}
                />
                {this.state.isOpenModalEditUser &&
                    <ModalEditUser
                        isOpen={this.state.isOpenModalEditUser}
                        toggleFromParent={this.toggleUserEditModal}
                        currentUser={this.state.userEdit}
                        editUser = {this.doEditUser}
                    />
                }
                <div className='title text center'>Quản lý người dùng</div>
                <div className='mx-1'>
                    <button className=
                    'btn btn-primary px-3'
                    onClick={()=>this.handleAddNewUser()}
                    ><i class="fas fa-plus"></i>Tạo người dùng mới</button>
                </div>
                <div className='users-table mt-3 mx-1'>
                    <table id="customers">
                    <tbody>
                        <tr>
                        <th>Email</th>
                        <th>Tên</th>
                        <th>Họ</th>
                        <th>Địa chỉ</th>
                        <th>Hành động</th>
                        </tr>
                        
                        { arrUsers && arrUsers.map((item, index)=>{
                            return(
                                <>
                                    <tr key = {index}>
                                        <td>{item.email}</td>
                                        <td>{item.firstName}</td>
                                        <td>{item.lastName}</td>
                                        <td>{item.address}</td>
                                        <td>
                                            <button className='btn-edit' onClick={()=>this.handleEditUser(item)}><i className="fas fa-pencil-alt"></i></button>
                                            <button className='btn-delete' onClick={()=>this.handleDeleteUser(item)}><i className="fas fa-trash"></i></button>
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

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);
