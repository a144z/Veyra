import type {HTMLAttributes} from 'react';
import {cn} from '@/lib/utils';
export function Card({className,...p}:HTMLAttributes<HTMLDivElement>){return <div className={cn('panel',className)} {...p}/>}
export function Badge({className,...p}:HTMLAttributes<HTMLSpanElement>){return <span className={cn('badge',className)} {...p}/>}
