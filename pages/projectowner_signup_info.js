import {Col, Row, Button, Form, Input} from 'antd';
import { useRouter } from 'next/router';


const tailLayout = {
    wrapperCol: {
        offset: 8,
        span: 16,
    },
};

const ProjectownerSignUpInfoPage = ({formData, setForm, errorMessage, setErrorMessage, navigation }) =>  {
    const { fullName, email, password } = formData;

    const { next } = navigation;
      
    const onFinish = (values) => {    
        let missingValues = [];    
        Object.entries(values).forEach(([key, value]) => {      
            if (!value) {        
                missingValues.push(key);      
            }    
        });     
        if (missingValues.length > 1) {      
            setErrorMessage(`You're missing these fields: ${missingValues.join(', ')}`);      
            return;    
        } 
        setForm(values);
        next();
    };  

    const onFinishFailed = (errorInfo) => {
        setErrorMessage("You're missing these fields.");
        console.log('Failed:', errorInfo);
    };
   
    return (
        <Row type="flex" align="middle" justify="space-around">
            <Col span = {8}>
                <div className="container">
                    <h1 className= "global_h1">Create an account with us.</h1>
                    <p>Whether you want to make a donation or post a project, creating an account allows you to keep track fo your contributions and progress.</p>

                    <div>
                        <p>
                            I (my organization) would like to: 
                            {/* TODO: DONATE BUTTON AND POST PTOJECT BUTTON OPTION */}
                        </p>
                    </div>
                </div>

                <div className="container">
                    <p style={{color: "red"}}>{errorMessage}</p>
                </div>
                <Form
                    layout="vertical"
                    name="basic"
                    initialValues={{fullName: fullName, email: email, password: password}}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                >
                    <Form.Item
                        label="Name"
                        name="fullName"
                        colon="true"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your first and last name!',
                            },
                        ]}
                    >
                        <Input
                            placeholder="Your First and Last Name"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        colon="true"
                        rules={[
                            {
                                required: true,
                                type: 'email',
                                message: 'Please input your email!',
                            },
                        ]}
                    >
                        <Input 
                            placeholder="Your Email"
                        />
                    </Form.Item>
                    <Form.Item
                        label="Password"
                        name="password"
                        colon="true"
                        
                        rules={[
                            {
                                required: true,
                                message: 'Please input your password!',
                            },
                        ]}
                        type="password"
                           
                    >
                        <Input.Password
                            placeholder="Your Password"
                        />
                    </Form.Item>

                     <Form.Item {...tailLayout}>
                        <Button className="projectowner_btn" type="primary" htmlType="submit">
                            Continue
                        </Button>
                    </Form.Item>
                </Form>
                <div className="container">
                    <Col>
                        <h5>Already have an account? <span> <Button href = "/signin" type="link">Sign In</Button> </span> </h5>
                    </Col>
                </div>
            </Col>

        </Row>
    )

}

export default ProjectownerSignUpInfoPage;