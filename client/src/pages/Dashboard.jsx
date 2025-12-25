import React, { useEffect,useRef, useState } from 'react'
import { dummyCreationData } from '../assets/assets'
import { Gem, Sparkles } from 'lucide-react'
import { Protect, useAuth } from '@clerk/clerk-react'
import CreationItem from '../components/CreationItem'
import axios from 'axios'
import toast from 'react-hot-toast'


axios.defaults.baseURL=import.meta.env.VITE_BASE_URL;

const Dashboard = () => {
  const [creations, setCreations] = useState([])
 
  const [loading,setLoading] = useState(true)

   const {getToken} = useAuth()
 
   const {  isLoaded, isSignedIn } = useAuth();
      const hasFetched = useRef(false); // 👈 prevents double call

  // Function to get dashboard data
  const getDashboardData = async () => {
   
    try{
      setLoading(true);

     const token = await getToken();

    console.log("Sending token:", token); 
     

          const {data} = await axios.get('/api/user/get-user-creations',
          {
            headers : {Authorization: `Bearer ${await getToken()}`}})
              console.log("✅ API response:", data);

      if (data.success) {
        // 🔥 IMPORTANT FIX HERE
        setCreations(
          Array.isArray(data.creations)
            ? data.creations
            : Array.isArray(data.message)
            ? data.message
            : Array.isArray(data.data)
            ? data.data
            : []
        );
      } else {
        toast.error(data.message || "Failed to load dashboard");
        setCreations([]);
      }
    }catch(error){
      toast.error(error.message);
    }
    setLoading(false)
  }

 useEffect(() => {
  if (!isLoaded || !isSignedIn) return;

  if (hasFetched.current) return; // ⛔ prevent double call
  hasFetched.current = true;

  getDashboardData();
}, [isLoaded, isSignedIn]);

  return (
    <div className='h-full overflow-y-scroll p-6'>
      <div className='flex justify-start gap-4 flex-wrap'>
        {/* Total creations card */}
        <div className='flex justify-between items-center w-72 p-4 px-6 bg-white rounded-xl border border-gray-200'> 
          <div className='text-slate-600 '>
            <p className='text-sm'>Total Creations</p>
            <h2 className='text-xl font-semibold'>{creations?.length || 0}</h2>
          </div>
          <div className='w-10 h-10 rounded-lg bg-gradient-to-br from-[#3588F2] to-[#0BB0D7] text-white flex justify-center items-center'>
            <Sparkles className='w-5 text-white' />
          </div>
        </div>

        {/* Active Plan card */}
        <div className='flex justify-between items-center w-72 p-4 px-6 bg-white rounded-xl border border-gray-200'> 
          <div className='text-slate-600 '>
            <p className='text-sm'>Active Plan</p>
            <h2 className='text-xl font-semibold'>
              <Protect plan='premium' fallback="Free">Premium</Protect>
            </h2>
          </div>
          <div className='w-10 h-10 rounded-lg bg-gradient-to-br from-[#FF61C5] to-[#9E53EE] text-white flex justify-center items-center'>
            <Gem className='w-5 text-white' />
          </div>
        </div>
      </div>
        {
          loading ?
          (
            <div className='flex justify-center items-center h-3/4'>
              <div className='animate-spin rounded-full h-11 w-11 border-3 border-purple-500 border-t-transparent'></div>
            </div>
          )
          : <div className='space-y-3'>
              <p className='mt-6 mb-4'>Recent Creations</p>
             {creations?.map((item) => (
              <CreationItem key={item.id} item={item} />
            ))}

            </div>

        }
      
    </div>
  )
}

export default Dashboard
