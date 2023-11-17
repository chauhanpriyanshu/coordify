'use client';
import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import { push, ref, set } from 'firebase/database'
import { useEffect } from 'react'
import Script from 'next/script'
import { database } from '../../firebaseConfig';

const inter = Inter({ subsets: ['latin'] })

// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";

// const firebaseConfig = {
//   apiKey: "AIzaSyBJLEE4sJ4hYjHcfX0lZ5ua4NarRt0r6Vw",
//   authDomain: "coordify-80f98.firebaseapp.com",
//   projectId: "coordify-80f98",
//   storageBucket: "coordify-80f98.appspot.com",
//   messagingSenderId: "476123341398",
//   appId: "1:476123341398:web:58f09c098f549707d591f7",
//   measurementId: "G-0K4X74BN92"
// };

export default function Home() {
  // useEffect(() => {
  //   if(!!window){
  //     const app = initializeApp(firebaseConfig);
  //     const analytics = getAnalytics(app);
  //   }
  // }, [])
  const handleInteraction = () => {
    console.log("ASSA",database)
    try{
      const usersRef = ref(database, 'users');
      const newDataRef = push(usersRef)
      set(newDataRef, {
        title: "Test Title",
        subtitle: "Test Subtitle"
      })
      alert("DATA ADDED!")
    }
    catch(err){
      console.error(err)
    }
  }

  useEffect(() => {
    
  }, [])
  
  
  return (
    <>
      <Head>
        <meta name='viewport' content='minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover'/>
        <meta name="coordify" content="coordify" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="coordify" />
        <meta name="description" content="coordify" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#2B5797" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#2E2E2E" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <Script src="https://www.gstatic.com/firebasejs/8.2.3/firebase-auth.js"></Script>
        <Script src="https://www.gstatic.com/firebasejs/8.2.3/firebase-database.js"></Script>
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        Testing Lander page  
        <button onClick={()=>{handleInteraction()}}>CLICK</button>
      </main>
    </>
  )
}
