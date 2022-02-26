import React from 'react'
import { getProviders, signIn } from "next-auth/react"

const login = ({ providers }) => {
  return (
    <div className="flex flex-col items-center bg-black min-h-screen w-full justify-center">
      <img className ="w-52 mb-5" src="https://links.papareact.com/9xl"/> 


      {

        Object.values(providers).map((provider) => (
            <div key={provider.name}>
              <button onClick={() => signIn(provider.id, {callbackUrl: "/"})} className="bg-[#18d862b7] text-white p-5 rounded-full">Login with {provider.name}</button>
            </div>
        ))
}
    </div>
  )
}

export default login;

export async function getServerSideProps(){
  const providers = await getProviders();

  return {
    props: {
      providers
    }
  }
}