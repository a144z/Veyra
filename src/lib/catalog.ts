export type Tier = 'base'|'holo'|'chase';
export interface Pack { id:Tier; name:string; subtitle:string; price:number; edition:string; color:string; dark:string; number:string; odds:string }
export const PACKS:Pack[] = [
{id:'base',name:'First light',subtitle:'Base Set Pack',price:2,edition:'THE EVERYDAY DISCOVERY',color:'#c6e9ce',dark:'#1b3a36',number:'01',odds:'70% rare · 25% holo · 5% ultra'},
{id:'holo',name:'Afterglow',subtitle:'Holo Grails Pack',price:5,edition:'THE HOLOGRAPHIC SERIES',color:'#c4afff',dark:'#342651',number:'02',odds:'60% holo · 35% ultra · 5% secret'},
{id:'chase',name:'Fireline',subtitle:'1st Edition Charizard Chase',price:10,edition:'THE COLLECTOR’S PURSUIT',color:'#f4ba8f',dark:'#482c28',number:'03',odds:'75% holo · 24% ultra · 1% Charizard preview'},
];
