import React, { useContext, useState } from 'react';
import { userDataContext } from '../context/UserContext';
import axios from 'axios';
import { MdKeyboardBackspace } from "react-icons/md";
import { useNavigate } from 'react-router-dom';

const Customize2 = () => {
    const { userData, backendUrl, backendImage, selectedImage, setUserData } = useContext(userDataContext);
    const [loading, setLoading] = useState(false);
    const [assistantName, setAssistantName] = useState(userData?.assistantName || "");
    const navigate = useNavigate(); // Use the useNavigate hook

    const handleUpdateAssistant = async () => {
  try {
    setLoading(true);
    let formData = new FormData();
    formData.append("assistantName", assistantName);

    // Use the correct field name for the image
    if (backendImage) {
      formData.append("assistantImage", backendImage); // For file uploads
    } else {
      formData.append("imageUrl", selectedImage); // For existing URLs
    }

    const result = await axios.post(backendUrl + "/api/user/update", formData, {
      withCredentials: true,
    });

    console.log(result.data);
    setUserData(result.data.user); // Make sure the response contains the updated user data
    navigate("/"); // Navigate to the home page after successful update
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};


    return (
        <div className='relative w-full h-[100vh] bg-gradient-to-t from-[#a3a757] to-[#000213fa] flex justify-center items-center flex-col'>
            <MdKeyboardBackspace
                className='absolute top-[30px] left-[30px] text-white w-[25px] h-[25px] cursor-pointer'
                onClick={() => navigate('/customize')}
            />

            <h1 className='text-white text-[30px] mb-[40px] text-center '>
                Enter Your <span className='text-blue-400'>Assistant Name</span>
            </h1>

            <input
                onChange={(e) => setAssistantName(e.target.value)}
                value={assistantName}
                className='px-[20px] py-[10px] rounded-full text-[18px] w-full h-[60px] max-w-[600px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300'
                required
                type="text"
                placeholder='Eg: Jarvis...'
            />

            {assistantName && (
                <button
                    disabled={loading}
                    onClick={handleUpdateAssistant}
                    className='min-w-[300px] h-[60px] cursor-pointer bg-white rounded-full mt-[30px] text-black font-semibold text-[19px]'
                >
                    {!loading ? 'Finally Create Your Assistant' : 'Loading...'}
                </button>
            )}
        </div>
    );
};

export default Customize2;
