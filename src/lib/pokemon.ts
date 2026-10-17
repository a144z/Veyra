import type {Tier} from './catalog';
export interface Collectible {id:string;name:string;hp:string;rarity:string;set:string;image:string;price:number|null;currency:'USD'|'EUR';source:'live'|'reference';priceDate:string|null;pulledAt?:string;receiptId?:string;mode?:'demo'|'live'}
export const REFERENCE:Collectible[] = [
{id:'base1-4',name:'Charizard',hp:'120',rarity:'Rare Holo',set:'Base Set · 004/102',image:'/cards/charizard.png',price:null,currency:'USD',source:'reference',priceDate:null},
{id:'base1-2',name:'Blastoise',hp:'100',rarity:'Rare Holo',set:'Base Set · 002/102',image:'/cards/blastoise.png',price:null,currency:'USD',source:'reference',priceDate:null},
{id:'base1-15',name:'Venusaur',hp:'100',rarity:'Rare Holo',set:'Base Set · 015/102',image:'/cards/venusaur.png',price:null,currency:'USD',source:'reference',priceDate:null}
];
export function normalizeCard(c:Record<string,any>):Collectible {
 const p=c.tcgplayer?.prices; const v=p?.holofoil?.market ?? p?.normal?.market ?? p?.reverseHolofoil?.market;
 const eur=c.cardmarket?.prices?.averageSellPrice;
 return {id:c.id,name:c.name,hp:c.hp||'—',rarity:c.rarity||'Rare',set:`${c.set?.name||'Pokémon TCG'} · ${c.number||''}`,image:c.images?.large||c.images?.small,price:typeof v==='number'?v:typeof eur==='number'?eur:null,currency:typeof v==='number'?'USD':'EUR',source:'live',priceDate:c.tcgplayer?.updatedAt||c.cardmarket?.updatedAt||null};
}
export async function fetchRandomRareCard(tier:Tier,random=Math.random):Promise<Collectible> {
 // Catalog data describes public cards; it does not establish inventory, grade, or ownership.
 const query=tier==='chase'?'name:charizard rarity:"Rare Holo"':tier==='holo'?'rarity:"Rare Holo"':'supertype:pokemon rarity:Rare';
 try {
 const res=await fetch(`https://api.pokemontcg.io/v2/cards?q=${encodeURIComponent(query)}&pageSize=20`,{signal:AbortSignal.timeout(3500)});
 if(!res.ok)throw new Error('Catalog unavailable'); const data=await res.json();
 if(!Array.isArray(data.data)||!data.data.length)throw new Error('Empty catalog');
 const card=normalizeCard(data.data[Math.floor(random()*data.data.length)]);
 if(!card.image||!card.id)throw new Error('Invalid catalog metadata');return card;
 }catch {return {...REFERENCE[tier==='chase'?0:Math.min(2,Math.floor(random()*3))]};}
}
