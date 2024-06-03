import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';


import Select from 'react-select'

import {createNewUserService} from '../../services/userService'
const options = [
    {value:'Chocolate',label:'Chocolate'},
    {value:'Strawbery',label:'Strawbery'},
    {value:'Vanila',label:'Vanila'}
]

class ModalCreateEmployer extends Component {

    constructor(props){
        super(props);
        this.state = {
            isOpen:'',
            email:'',
            password:'',
            firstName:'',
            lastName:'',
            address:'',
            
            dayOfBirth:'',
            gender:'',
            phonenumber:'',
            image:'',


            
            roleId:'R2',
            selectedOption:'',
        }
    }

    componentDidMount() {
        this.setState({
            isOpen: this.props.isOpen
        })
    }
    componentDidUpdate(prevProps, prevState, snapshot){
        if(prevProps.isOpen !== this.props.isOpen){
            this.setState({
                isOpen:this.props.isOpen
            })
        }
    }

    toggle=()=>{
        this.props.toggleFromParent();
    }
    handleOnChangeInput=(event,id)=>{
        let copyState = {...this.state};
        copyState[id] = event.target.value
        this.setState({
            ...copyState
        })
        
    }
    checkValidateInput = ()=>{
        let isValid = true;
        let arrInput=['email', 'password', 'firstName', 'lastName', 'address'];
        for(let i = 0; i < arrInput.length; i++){
            if(!this.state[arrInput[i]]){
                isValid = false;
                alert('Missing parameter: '+arrInput[i]);
                break;
            }
        }
        return isValid;
    }
    handleAddNewUser = async()=>{
        let isValid=this.checkValidateInput();
        if(isValid === true){
            //call api create new user
            try {
                let response = await createNewUserService(this.state);
                if(response && response.errCode !== 0){
                    alert(response.errMessage)
                }
                else{
                    this.setState({
                        isOpen:false
                    })
                }
                
            } catch (e) {
                console.log(e)
            }
        }
        
    }
    handleChange = selectedOption=>{
        this.setState({selectedOption});
        console.log(`option selected: `,selectedOption)
    }
    render() {
        //console.log('check child props', this.props);
        //console.log('check child open modals', this.props.isOpen);
        return (
             
            <Modal
                isOpen={this.state.isOpen} 
                toggle={()=>this.toggle()} 
                className={'modal-user-container'}
                size="lg"
            >
            <ModalHeader toggle={()=>this.toggle()}>Đăng ký nhà tuyển dụng</ModalHeader>
            <ModalBody>
                <div className='modal-user-body'>
                    <div className='input-container'>
                        <label>Email</label>
                        <input type='text' onChange={(event)=>this.handleOnChangeInput(event, "email")} value={this.state.email}/>
                    </div>
                    <div className='input-container'>
                        <label>Mật khẩu</label>
                        <input type='password' onChange={(event)=>this.handleOnChangeInput(event, "password")} value={this.state.password}/>
                    </div>
                    <div className='input-container'>
                        <label>Tên</label>
                        <input type='text' onChange={(event)=>this.handleOnChangeInput(event, "firstName")} value={this.state.firstName}/>
                    </div>
                    <div className='input-container'>
                        <label>Họ</label>
                        <input type='texf' onChange={(event)=>this.handleOnChangeInput(event, "lastName")} value={this.state.lastName}/>
                    </div>
                    <div className='input-container max-width-input'>
                        <label>Địa chỉ</label>
                        <input type='text' onChange={(event)=>this.handleOnChangeInput(event, "address")} value={this.state.address}/>
                    </div>
                    <div className='input-container max-width-input'>
                        <label>Số điện thoại</label>
                        <input type='text' onChange={(event)=>this.handleOnChangeInput(event, "phonenumber")} value={this.state.phonenumber}/>
                    </div>
                    <div className='input-container'>
                        <label>Ngày sinh</label>
                        <input type='text' onChange={(event)=>this.handleOnChangeInput(event, "phonenumber")} value={this.state.phonenumber}/>
                    </div>
                    <div className='input-container'>
                        <label>Giới tính</label>
                        <input type='text' onChange={(event)=>this.handleOnChangeInput(event, "phonenumber")} value={this.state.phonenumber}/>
                    </div>
                    <div className='input-container'>
                        <label>Ảnh đại diện</label>
                        <input type='text' onChange={(event)=>this.handleOnChangeInput(event, "phonenumber")} value={this.state.phonenumber}/>
                    </div>
                    <div className='input-container'>
                        <label>Test</label>
                        <Select
                            value={this.state.selectedOption}
                            onChange={this.handleChange}
                            options={options}
                            className='form-control'
                        />
                    </div>

                </div>
            </ModalBody>
            <ModalFooter>
                <Button color="primary" className='px-3' onClick={()=>this.handleAddNewUser()}>Sign up</Button>{' '}
                <Button color="secondary" className='px-3' onClick={()=>this.toggle()}>Close</Button>{' '}
            </ModalFooter>
            </Modal>
        )
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalCreateEmployer);





