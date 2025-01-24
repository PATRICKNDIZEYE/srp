// import {useEffect , useState} from 'react';

import {useParams} from "react-router-dom";
import {BiCheck} from "react-icons/bi";

export default function NGOApproved (){

    const params = useParams()
    const id = params.id;




    if(id !== undefined) {
        return (




            <div className="text-md flex justify-center items-center w-full h-screen">
                <div
                className="dark:text-white text-black-2"
                >

                </div>



            </div>
        )
    }

    return (

        <div className="text-md flex justify-center items-center w-full h-screen">
            <div
                className="dark:text-white text-black-2"
            >
            NGO {id} APPROVED <div className="text-green-600"><BiCheck/></div>
            </div>


        </div>


    )


}