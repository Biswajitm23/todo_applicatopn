import React, { useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (name === 'email') {
      setEmailErrorMessage('');
    } else if (name === 'password') {
      setPasswordErrorMessage('');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email.trim() && !formData.password.trim()) {
      setEmailErrorMessage('Please provide an email');
      setPasswordErrorMessage('Please provide a password');
      return;
    }

    setLoading(true);

    try {
      // Simulating API call with setTimeout
      setTimeout(async () => {
        const response = await fetch('https://todo-applicatopn.onrender.com/posts');
        const data = await response.json();
        console.log('Data from API:', data);
        if (Array.isArray(data) && data.length > 0) {
          const user = data.find((user) => user.email === formData.email);
          console.log('User object:', user);

          if (user) {
            if (user.password === formData.password) {
              localStorage.setItem('userId', user.id);
              setLoading(false);
              navigate('/todolist');
            } else {
              setPasswordErrorMessage('The user credential is incorrect');
              setLoading(false);
            }
          } else {
            setEmailErrorMessage("Username doesn't exist");
            setLoading(false);
          }
        } else {
          console.error('Unexpected data structure:', data);
          setEmailErrorMessage('Error fetching data');
          setLoading(false);
        }
      }, 1500);
    } catch (error) {
      console.error('Error fetching data:', error);
      setEmailErrorMessage('Error fetching data');
      setLoading(false);
    }
  };

  return (
    <section style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/image/template-1899344_1920.jpg)`, height: '100vh', paddingTop: '30px' }}>
      <div style={{ backgroundImage: "url('https://img.freepik.com/free-photo/top-view-desk-concept-with-coffee_23-2148604923.jpg?w=1380&t=st=1706013930~exp=1706014530~hmac=505aaec3963bc3d0617cdaa5b3f38366b5aa2adbf0f7017112e75d197a98003a');" }}>
        <div className="wrapper" style={{ maxWidth: '500px' }}>
          <h1>Log In</h1>
          <form onSubmit={handleSubmit}>
            <div className="row ">
              <div data-mdb-input-init className="form-outline login-outline" style={{ display: 'flex', alignItems: 'center' }}>
                <input type="email" className="form-control" id="exampleInputEmail1" name="email" aria-describedby="emailHelp" value={formData.email} placeholder="Email ID" onChange={handleChange} style={{ border: '1px solid #dee2e6', borderRadius: '20px', background: 'transparent' }} />
              </div>
              <p className="error-para" style={{ color: 'red', marginBottom: '4px', textAlign: 'left' }}>{emailErrorMessage}</p>
              <div className="form-outline" style={{ display: 'flex', alignItems: 'center' }}>
                <input type={showPassword ? 'text' : 'password'} className="form-control" id="exampleInputPassword1" name="password" value={formData.password} placeholder="Password" onChange={handleChange} style={{ border: '1px solid #dee2e6', borderRadius: '20px', background: 'transparent' }} />
                <i className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'} toggle-password`} onClick={togglePasswordVisibility}></i>
              </div>
              <p className="error-para" style={{ color: 'red', marginBottom: '4px', textAlign: 'left' }}>{passwordErrorMessage}</p>
              <button type="submit" className="btn btn-primary btn-block" disabled={loading}>{loading ? <LoadingSpinner /> : 'Sign in'}</button>
              <div className="text-center">
                <p className="account-para">Don't have an account? <Link to="/registration">Sign Up</Link></p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;
