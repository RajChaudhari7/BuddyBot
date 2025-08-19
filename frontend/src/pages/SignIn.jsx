import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IoEye, IoEyeOff } from "react-icons/io5";
import { userDataContext } from '../context/UserContext';
import authBg from '../assets/authBg.png';
import toast from 'react-hot-toast';

const SignIn = () => {
    const { backendUrl, userData, setUserData } = useContext(userDataContext);
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignIn = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const result = await axios.post(
                `${backendUrl}/api/auth/login`,
                { email, password },
                { withCredentials: true }
            );
            if (result.data.success) {
                toast.success(result.data.message);
                setUserData(result.data);
                navigate('/customize');
            } else {
                toast.error(result.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "An error occurred during login");
            setUserData(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className='w-full h-[100vh] flex justify-center items-center bg-cover bg-center bg-no-repeat'
            style={{ backgroundImage: `url(${authBg})` }}
        >
            <form
                onSubmit={handleSignIn}
                className='px-[20px] w-[90%] h-[600px] max-w-[500px] bg-[#00000062] backdrop-blur shadow-lg shadow-black flex flex-col justify-center items-center rounded-lg p-5 gap-[20px]'
            >
                <h1 className='text-white text-[30px] font-semi-bold mb-[30px]'>
                    Login to <span className='text-blue-300'>Buddy Bot</span>
                </h1>
                <input
                    className='px-[20px] py-[10px] rounded-full text-[18px] w-full h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300'
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    type="email"
                    placeholder='Email'
                />
                <div className='w-full h-[60px] border-2 border-white rounded-full bg-transparent text-white text-[18px] relative'>
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder='Password'
                        required
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        className='w-full h-full rounded-full outline-none bg-transparent placeholder-gray-300 px-[20px] py-[10px]'
                    />
                    {showPassword ? (
                        <IoEyeOff onClick={() => setShowPassword(false)} className='absolute top-[18px] right-[20px] text-white w-[25px] h-[25px] cursor-pointer' />
                    ) : (
                        <IoEye onClick={() => setShowPassword(true)} className='absolute top-[18px] right-[20px] text-white w-[25px] h-[25px] cursor-pointer' />
                    )}
                </div>
                <button
                    disabled={loading}
                    type="submit"
                    className='min-w-[150px] h-[60px] cursor-pointer bg-white rounded-full mt-[30px] text-black font-semibold text-[19px]'
                >
                    {loading ? 'Loading...' : 'Login'}
                </button>
                <p onClick={() => navigate('/signup')} className='text-white text-lg cursor-pointer'>
                    Create a new account <span className='text-blue-200'>Sign Up</span>
                </p>
            </form>
        </div>
    );
};

export default SignIn;
