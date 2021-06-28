import {Col, Row, Button, Form, Space, Input} from 'antd';
import { useState, useEffect } from 'react';
import { signUp } from '../lib/firebase';
import update from 'immutability-helper';

const tailLayout = {
    wrapperCol: {
        offset: 8,
        span: 16,
    },
};

const projectowner_organizationInfo = ({formData, organizationInfo, setOrganizationInfo, errorMessage, setErrorMessage, navigation}) => {
    const { previous } = navigation;
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [data, setData] = useState();
    const onFinish = (fieldValues) => { 
        setData(fieldValues)
        console.log(data)
        setFormSubmitted(true);
    }; 

    const onFinishFailed = (errorInfo) => {
        setErrorMessage("There was an error signing up");
        console.log('Failed:', errorInfo);
        previous();
    };

    useEffect(() => {
        if(formSubmitted) {
            let missingValues = [];    
            Object.entries(formData).forEach(([key, value]) => {      
                if (!value) {        
                    missingValues.push(key);      
                }    
            });  
            Object.entries(organizationInfo).forEach(([key, value]) => {
                if (value) {
                    if (organizationInfo in formData) {
                        formData.organizationInfo.push(key)
                    }
                    else {
                        formData.organizationInfo = [key]
                    }
                }
            });
            if (missingValues.length > 1) {    
                setErrorMessage(`You're missing these fields: ${missingValues.join(', ')}`);
                previous();      
                return;    
            }

            signUp('owner', formData.email, formData.password, '', '')
            .then((error) => {
                if(error != null) { 
                    if(error.code === "auth/email-already-in-use") {
                        setErrorMessage("There already exists an account with the given email address.")
                    } else if (error.code === "auth/invalid-email") {
                        setErrorMessage("Email address not valid.")
                    } else if (error.code === "auth/weak-password") {
                        setErrorMessage("Password must be at least 6 characters.")
                    } else {
                        setErrorMessage("There was an error signing up.")
                    }
                    previous();
                }
                
            })
            .catch((err) => {  
                setErrorMessage("There was an error signing up.");     
                console.log(err);
                previous();
            });
        }
          
    });

    const goBack =() => {
        // TODO: change back button to be arrow?
        previous()
    }
 
    return (
       <>
        <Row type="flex" align="top">
            <Col span={8}>
                <Button type="default" onClick={() => goBack()}> Back </Button>
            </Col>
            <Col span={8}>
                <div className="container">
                    <h1 className= "global_h1">Welcome, {formData.fullName}!</h1>
                    <h4 className="global_h4">Please tell us more about your organization.</h4>
                </div>

                <Form
                    layout="vertical"
                    name="basic"
                    initialValues={{organizationInfo: organizationInfo}}
                    onFinish={onFinish}
                    onFinishFailed = {onFinishFailed}
                >
                    <Form.Item
                        label="Organization name"
                        name="organizationName"
                        extra = "E.g. Sierra Club, Nature Conservancy, Clean Energy Trust, etc."
                        rules={[
                            {
                                required: true,
                                message: 'Please input your organization name!',
                            },
                        ]}
                    >
                        <Input
                            placeholder="Your response"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Organization website"
                        name="organizationWebsite"
                        extra="Please enter the URL for your organization website."
                        rules={[
                            {
                                required: true,
                                message: 'Please input your organization website!',
                            },
                        ]}
                    >
                        <Input 
                            placeholder="Your response"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Local or regional chapter"
                        name="chapterType"
                        extra= "If you are the local or regional chapter of a national or international organization, describe it here."
                        rules={[
                            {
                                required: true,
                                message: 'Please input your organization chapter type!',
                            },
                        ]}
                    >
                        <Input 
                            placeholder = "Your response"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Primary contact name"
                        name={formData.name}
                        extra= "Name of the person to follow up with at your organization."
                        rules={[
                            {
                                required: true,
                                message: 'Please input your fullname',
                            },
                        ]}
                    >
                        <Input
                            value= { formData.fullName }
                        />
                    </Form.Item>

                    <Form.Item
                        label="Primary contact email"
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your email',
                            },
                        ]}
                    >
                        <Input
                            value= { formData.email }
                        />
                    </Form.Item>

                    <Form.Item
                        label="Primary contact phone number"
                        name="phoneNumber"
                        
                        rules={[
                            {
                                required: true,
                                message: 'Please input your phone number',
                            },
                        ]}
                    >
                        <Input 
                            placeholder = "Your response"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Type of organization"
                        name="organizationType"
                        
                        rules={[
                            {
                                required: true,
                                message: 'Please input your oraganization type',
                            },
                        ]}
                    >
                        <Input 
                            placeholder = "Please select"
                        />
                    </Form.Item>

                    <Form.Item
                        label="If 'other' please describe your organization"
                        name="otherInfo"
                    >
                        <Input 
                            placeholder = "Your response"
                        />
                    </Form.Item>
                    
                    <Form.Item {...tailLayout}>
                        <Button className="projectowner_btn" type="primary" htmlType="submit">
                            Finish
                        </Button>
                    </Form.Item>
                </Form>
            </Col>
        </Row>
       </>
    )
}

export default projectowner_organizationInfo
