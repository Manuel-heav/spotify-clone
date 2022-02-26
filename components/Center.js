import React, { useEffect,useState } from 'react'
import { useSession } from 'next-auth/react'
import { ChevronDownIcon } from '@heroicons/react/outline';
import { shuffle } from 'lodash';
import { useRecoilState } from 'recoil';
import { playListIdState, playlistState } from '../atoms/playListAtom';
import useSpotify from '../hooks/useSpotify';
import Songs from './Songs';
import { signOut } from 'next-auth/react'

const colors = [
  "from-indigo-500",
  "from-blue-500",
  "from-green-500",
  "from-yellow-500",
  "from-pink-500",
  "from-purple-500",
]

const Center = () => {
  const { data: session } = useSession();
  const spotifyApi = useSpotify()
  const [color, setColor] = useState(null)
  const [playlistId, setplayListId] = useRecoilState(playListIdState)
  const [playlist, setPlaylist] = useRecoilState(playlistState)
  useEffect(() => {
    setColor(shuffle(colors).pop());
  }, [playlistId])

  useEffect(() => {
    spotifyApi.getPlaylist(playlistId).then(data => {
      setPlaylist(data.body)
    }).catch(err => console.log("Oops! Something went wrong!",err))
  }, [spotifyApi, playlistId])

  console.log(playlist)
  return (
    <div className ="flex-grow h-screen overflow-y-scroll scrollbar-hide">
       <header className='absolute top-5 right-8'>
         <div className='flex items-center bg-black space-x-3 opacity-90 hover:opacity-75 cursor-pointer rounded-full p-1 pr-2' onClick={signOut}>
          <img className="rounded-full w-10 h-10" src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.freepngimg.com%2Fdownload%2Fyoutube%2F63841-profile-twitch-youtube-avatar-discord-free-download-image.png&f=1&nofb=1" alt="Profile image"/>
          <h2 className='text-white'>{session?.user.name}</h2>
          <ChevronDownIcon className='h-5 w-5 text-white'/>
         </div>
       </header>

    <section className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80 text-white p-8`}>
      <img className="h-44 w-44 shadow-2xl" src={playlist?.images?.[0]?.url} alt=""/>
        <div>
          <p>Playlist</p>
          <h1 className='text- md:text-3xl xl:text-5xl font-bold'>{playlist?.name}</h1>
          </div>
      </section>


      <div>
        <Songs />
      </div>
    </div>
  )
}

export default Center