'use client';
import * as D from '@radix-ui/react-dialog';
import {X} from 'lucide-react';
import type {ReactNode} from 'react';
export function Dialog({open,onOpenChange,title,description,children,wide=false,locked=false}:{open:boolean;onOpenChange:(v:boolean)=>void;title:string;description:string;children:ReactNode;wide?:boolean;locked?:boolean}){return <D.Root open={open} onOpenChange={v=>{if(!locked)onOpenChange(v)}}><D.Portal><D.Overlay className="modal-overlay"/><D.Content className={`modal ${wide?'modal-wide':''}`} onEscapeKeyDown={e=>{if(locked)e.preventDefault()}} onPointerDownOutside={e=>{if(locked)e.preventDefault()}}><D.Title className="modal-title">{title}</D.Title><D.Description className="modal-description">{description}</D.Description>{!locked&&<D.Close className="modal-close" aria-label="Close dialog"><X size={20}/></D.Close>}{children}</D.Content></D.Portal></D.Root>}
