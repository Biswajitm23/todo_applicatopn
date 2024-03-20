import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LoadingSpinner from './LoadingSpinner'; 

const Registration = ({ closeRegistrationModal }) => {
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
    address: "",
    image: null,
    role: "user",
    status: "1",
    todos : []
  });

  const [errors, setErrors] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
    role: "",
    status: "",
    todos : [],
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'image' ? files[0] : value,
    });
  };

  const validateInputs = () => {
    const { fname, lname, email, password, role } = formData;
    const errors = {};

    if (!fname.trim()) {
      errors.fname = 'First name is required';
    } else if (!/^[a-zA-Z]*$/.test(fname)) {
      errors.fname = 'Only alphabets allowed';
    }

    if (!lname.trim()) {
      errors.lname = 'Last name is required';
    } else if (!/^[a-zA-Z]*$/.test(lname)) {
      errors.lname = 'Only alphabets allowed';
    }

    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!password.trim()) {
      errors.password = 'Password is required';
    } else if (password.length < 8) {
      errors.password = 'Password length should be at least 8 characters';
    }

    if (!role.trim()) {
      errors.role = 'Role is required';
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (validateInputs()) {
    try {
      const response = await axios.get('https://todo-applicatopn.onrender.com/posts');
      const isEmailRegistered = response?.data.some((user) => user.email === formData.email);
      
      if (isEmailRegistered) {
        alert("Email already registered");
      } else {
        const imageToBase64 = async (image) => {
          return new Promise((resolve, reject) => {
            if (!image) {
              resolve(null);
            }
            
            const reader = new FileReader();
            reader.readAsDataURL(image);
            
            reader.onload = () => {
              resolve(reader.result);
            };
            
            reader.onerror = (error) => {
              reject(error);
            };
          });
        };
        
        const base64Image = await imageToBase64(formData.image);
        
        const userData = {
          f_name: formData.fname,
          l_name: formData.lname,
          email: formData.email,
          address: formData.address,
          image: base64Image,
          password: formData.password,
          role: formData.role,
          status: formData.status,
          todos : formData.todos
        };
        
        // Store user data in localStorage
        localStorage.setItem('User', JSON.stringify(userData));
        
        // Perform the POST request to your server endpoint
        await axios.post("https://todo-applicatopn.onrender.com/posts", userData);
        
        // Display success message
        toast.success("Registration Done");
        
        // Set loading to true to indicate loading state
        setLoading(true);
        
        // Navigate to the home page after 1.5 seconds
        setTimeout(() => {
          setLoading(false); // Set loading back to false after 1 second delay
          navigate('/');
        }, 1500);
      }
    } catch (error) {
      console.error('Error:', error);
      setLoading(false); // Set loading back to false if there is an error
    }
  }
};


  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];

    const reader = new FileReader();
    reader.readAsDataURL(selectedImage);
    reader.onload = () => {
      setFormData({
        ...formData,
        image: selectedImage,
        imagePreview: reader.result
      });
    };
  };

  const convertImageToBase64 = (image) => {
    return new Promise((resolve, reject) => {
      if (!image) {
        resolve(null);
      }

      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = (error) => {
        reject(error);
      };
    });
  };

  return (
    <section style={{ "backgroundImage": `url(${process.env.PUBLIC_URL}/image/galaxy-1772976_1920.jpg)`, "height": "100vh", "paddingTop": "10px" }}>
      <div>
        <div className="wrapper" style={{ "maxWidth": "500px" }}>
          <h1 className="forregistration">SIGN UP</h1>
          <form onSubmit={(e) => handleSubmit(e)}>
            <div className="row">
              <div className="form-outline login-outline" style={{ "display": "flex", "alignItems": "center" }}>
                <input type="text" name="fname" className="form-control" required placeholder="First name" style={{ "border": "1px solid #dee2e6", "borderRadius": "20px", "background": "transparent" }} value={formData.fname} onChange={handleChange} />
              </div>
              <p className='error-para' style={{ color: 'red', fontSize: '12px', marginBottom: '4px', textAlign: 'left' }}>{errors.fname}</p>
              <div className="form-outline" style={{ "display": "flex", "alignItems": "center" }}>
                <input type="text" name="lname" placeholder="Last Name" required className="form-control" style={{ "border": "1px solid #dee2e6", "borderRadius": "20px", "background": "transparent" }} value={formData.lname} onChange={handleChange} />
              </div>
              <p className='error-para' style={{ color: 'red', fontSize: '12px', marginBottom: '4px', textAlign: 'left' }}>{errors.lname}</p>
              <div className="form-outline" style={{ "display": "flex", "alignItems": "center" }}>
                <input type="email" name="email" placeholder="Email ID" required className="form-control" style={{ "border": "1px solid #dee2e6", "borderRadius": "20px", "background": "transparent" }} value={formData.email} onChange={handleChange} />
              </div>
              <p className='error-para' style={{ color: 'red', marginBottom: '4px' }}>{errors.email}</p>
              <div className="form-outline" style={{ "display": "flex", "alignItems": "center" }}>
                <input type="text" name="address" placeholder="Address" required className="form-control" style={{ "border": "1px solid #dee2e6", "borderRadius": "20px", "background": "transparent" }} value={formData.address} onChange={handleChange} />
              </div>
              <p className='error-para' id="password-error" style={{ color: 'red' }}></p>
              <div className="form-outline" style={{ "display": "flex", "alignItems": "center" }}>
                <input
                  type="password" name="password" placeholder="Password" className="form-control" style={{
                    border: "1px solid #dee2e6", borderRadius: "20px", background: "transparent"
                  }} value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <p className='error-para' id="password-error" style={{ color: 'red' }}>{errors.password}</p>
              <div className="image-area" style={{ "textAlign": "left", marginBottom: '10px' }}>
                <label className="form-label" htmlFor="imageUpload" style={{ "color": "#fff","fontSize":"14px" }}>Profile Image</label>
                <input type="file" id="imageUpload" name="image" onChange={handleImageChange} accept="image/*" />
                {formData.imagePreview && <img src={formData.imagePreview} alt="Preview" className="profile-image" style={{ width: '40px', height: '40px', borderRadius: '100%', marginTop: '10px' }} />}
              </div>
              <button type="submit" className="btn btn-primary btn-block ">Sign up</button> 
              {loading && <LoadingSpinner />} 
              <div className="text-center">
                <p className="account-para"> Already Have an Account <Link to="/">Sign In </Link></p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Registration;
