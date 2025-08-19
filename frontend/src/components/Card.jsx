import React from 'react'
import { useContext } from 'react'
import { userDataContext } from '../context/UserContext'

const Card = ({ image }) => {

    const { backendUrl,
        userData, setUserData,
        frontendImage, setFrontendImage,
        backendImage, setBackendImage,
        selectedImage, setSelectedImage } = useContext(userDataContext)

    return (
        <div onClick={() => {
            setSelectedImage(image)
            setBackendImage(null)
            setFrontendImage(null)
        }}
            className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px] bg-[#020220] border-2 border-[#0000ff66] 
        rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-900 cursor-pointer hover:border-4 hover:border-white
         ${selectedImage === image ? 'border-4 border-white shadow-blue-950' : null}`}>
            <img src={image} className='w-full h-full object-cover' />
        </div>
    )
}

export default Card