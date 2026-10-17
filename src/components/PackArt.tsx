import type {Pack} from '../lib/catalog';
import {Mark} from './Brand';
export function PackArt({pack,className='',torn=false}:{pack:Pack;className?:string;torn?:boolean}){
 return <div className={`foil-pack ${className} ${torn?'torn':''}`} style={{'--foil':pack.color,'--foil-dark':pack.dark} as React.CSSProperties}>
 <div className="pack-crimp pack-top"/><div className="pack-brand"><Mark size={19}/> veyra <span>TCG / {pack.number}</span></div>
 <div className="pack-orbit"><div className="orbit-disc"/><div className="orbit-line o1"/><div className="orbit-line o2"/><div className="orbit-line o3"/><div className="orbit-line o4"/><div className="orbit-core"/><span className="orbit-spark">✦</span></div>
 <div className="pack-edition">{pack.edition}</div><div className="pack-title">{pack.name}<span>POKÉMON COLLECTION</span></div><div className="pack-bottom"><span>ONE RARE DISCOVERY</span><span>↗</span></div><div className="pack-crimp pack-foot"/><div className="foil-reflection"/>
 </div>;
}
