import {clsx, type ClassValue} from 'clsx';
import {twMerge} from 'tailwind-merge';
export const cn = (...v: ClassValue[]) => twMerge(clsx(v));
export const usd = (n: number) => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(n);
