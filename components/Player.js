import { HeartIcon, VolumeUpIcon as VolumeDownIcon } from '@heroicons/react/outline';
import {
    FastForwardIcon,
    PauseIcon,
    PlayIcon,
    ReplyIcon,
    RewindIcon,
    VolumeUpIcon,
    SwitchHorizontalIcon
} from '@heroicons/react/solid'
import { useSession } from 'next-auth/react';
import React, {useEffect, useState} from 'react'
import { useRecoilState } from 'recoil';
import { currentTrackIdState, isPlayingState } from '../atoms/songAtom';
import useSongInfo from '../hooks/useSongInfo';
import useSpotify from '../hooks/useSpotify'


const Player = () => {
    const spotifyApi = useSpotify()
    const {data: session, status} = useSession();
    const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState)
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState)
    const [volume, setVolume]= useState(50)
    const songInfo = useSongInfo();

    const fetchCurrentSong = () => {
        if(!songInfo) {
            spotifyApi.getMyCurrentPlayingTrack().then(data => {
                console.log("Now Playing", data?.body?.item)
                setCurrentTrackId(data.body?.item?.id);

                spotifyApi.getMyCurrentPlaybackState().then((data) => {
                    setIsPlaying(data.body?.is_playing)
                })
                
            })
        }
    }

    const handlePlayPause = () => {
        spotifyApi.getMyCurrentPlaybackState().then(data => {
            if(data.body.is_playing){
                spotifyApi.pause();
                setIsPlaying(false)
            }else{
                spotifyApi.play();
                setIsPlaying(true)
            }
        })
    }
        useEffect(()=>{
                if(spotifyApi.getAccessToken () && currentTrackId){
                    fetchCurrentSong();
                    setVolume(50)
                }
        }, [currentTrackId, spotifyApi, session])
    return (
    <div className='h-24 bg-gradient-to-b from-black to-gray-900 text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8'>
        <div className="flex items-center space-x-4">
            <img className="hidden md:inline h-10 w-10"src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.freepngimg.com%2Fdownload%2Fyoutube%2F63841-profile-twitch-youtube-avatar-discord-free-download-image.png&f=1&nofb=1"/>
            {/*  src={songInfo?.album.images?.[0].url} */}
        <div>
            <h3>{songInfo?.name} Ophelia</h3>
            <p>{songInfo?.artists?.[0]?.name} The Lumineers</p>
        </div>
        </div>

        {/* Center */}
        <div className="flex items-center justify-evenly">
            <SwitchHorizontalIcon className="button"/>
            <RewindIcon className="button"/>

            {isPlaying ? (
                <PauseIcon onClick={handlePlayPause} className='button w-10 h-10'/>
            ) : (
                    <PlayIcon  onClick={handlePlayPause}className='button w-10 h-10'/>
            )}

            <FastForwardIcon className="button" />
            <ReplyIcon className="button"/>
        </div>


        {/* Right */}
        <div className='flex items-center space-x-3 md:space-x-4 justify-end pr-5'>
                <VolumeDownIcon className="button"/>
                <input className="w-14 md:w-28" type="range" min={0} max={100}/>
                <VolumeUpIcon className="button"/>
        </div>
    </div>
  )
}

export default Player