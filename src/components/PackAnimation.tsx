'use client';
import {motion,useReducedMotion} from 'framer-motion';
import {PackArt} from './PackArt';
import type {Pack} from '../lib/catalog';
export function PackAnimation({pack}:{pack:Pack}){const reduce=useReducedMotion();return <div className="rip-stage"><motion.div className="rip-ring" initial={{scale:.4,opacity:0}} animate={{scale:reduce?1:2.6,opacity:[0,.6,0]}} transition={{duration:1.8,delay:.8}}/>{Array.from({length:20},(_,i)=><motion.i className="rip-particle" key={i} initial={{x:0,y:0,opacity:0}} animate={{x:Math.cos(i*2.4)*(120+i*5),y:Math.sin(i*2.4)*(120+i*5),opacity:[0,1,0],rotate:i*35}} transition={{duration:1.5,delay:.8}}/>)}<motion.div initial={{rotateY:-14,y:30,opacity:0}} animate={{rotateY:0,y:[30,0,-12,20],opacity:1,scale:[.9,1,1,1.08]}} transition={{duration:2.5}}><PackArt pack={pack} torn/></motion.div><motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.5}}>A little suspense. A rare discovery.</motion.p></div>}
