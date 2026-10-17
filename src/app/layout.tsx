import type {Metadata} from 'next';
import './globals.css';
export const metadata:Metadata={title:'Veyra — A rare feeling.',description:'An agent-native Pokémon collecting demo. Set a limit. Discover a pack. Keep the feeling.',icons:{icon:'/icon.svg'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
