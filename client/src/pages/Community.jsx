import React, { useEffect, useState } from 'react'
import { dummyPublishedCreationData} from '../assets/assets'
import { Heart } from 'lucide-react'
import {useAuth, useUser } from '@clerk/clerk-react'
import axios from 'axios'
import toast from 'react-hot-toast'

axios.defaults.baseURL=import.meta.env.VITE_BASE_URL;

const Community = () => {

  const [creations,setCreations] = useState([])
  const{user} = useUser()
   const [loading,setLoading] = useState(true)
   const {getToken} = useAuth()

 const fetchCreations = async () => {
  try {
    const token = await getToken();

    const { data } = await axios.get(
      "/api/user/get-published-creations",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (data.success) {
      setCreations(Array.isArray(data.message) ? data.message : []);
    } else {
      toast.error("Failed to load community");
    }

  } catch (error) {
    console.error(error);
    toast.error("Something went wrong");
  } finally {
    setLoading(false);
  }
};

const imageLikeToggle = async (id) =>{
   try {
    const token = await getToken();

    const { data } = await axios.post(
      "/api/user/toggle-like-creation",{id},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    if(data.success){
      toast.success(data.message);
      await fetchCreations()
    } else{
      toast.error(data.message);
    }
    
}catch(error){
      toast.error(error.message);
    }

  }
  useEffect(()=>{
    if(user){
      fetchCreations()
    }
  },[user])


  return !loading ? (
    <div className='flex-1 h-full flex flex-col gap-4 p-6'>
     Creations
     <div className='bg-white h-full rounded-xl overflow-y-scroll'>
          
  {Array.isArray(creations) && creations.map((creation, index) => (
  <div
    key={index}
    className="relative group inline-block pl-3 pt-3 w-full sm:w-1/2 lg:w-1/3"
  >
    {creation.content && (
      <img
        src={creation.content}
        alt=""
        className="w-full h-full object-cover rounded-lg"
      />
    )}

    <div className="absolute inset-0 left-3 flex gap-2 items-end justify-end group-hover:justify-between p-3 group-hover:bg-gradient-to-b from-transparent to-black/80 text-white rounded-lg">
      <p className="text-sm hidden group-hover:block">
        {creation.prompt}
      </p>

      <div className="flex gap-1 items-center">
        <p>{creation.likes?.length ?? 0}</p>
          <Heart
          onClick={() => imageLikeToggle(creation.id)}
          className={`min-w-5 h-5 cursor-pointer transition-all ${
            creation.likes?.includes(user.id)
              ? "fill-red-500 stroke-red-500"
              : "fill-transparent stroke-white"
          }`}
        />


      </div>
    </div>
  </div>
))}

     </div>
    </div>
  ) : (
    <div className='flex justify-center items-center h-full'>
      <span className='w-10 h-10 my-1 rounded-full border-3 border-primary border-t-transparent animate-spin'>
         
      </span>
    </div>
  )
}

export default Community
