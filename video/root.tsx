import {Composition} from 'remotion';
import {Film} from './film';
import {VeyraApp} from '../src/components/VeyraApp';
import './product.css';
export function Root(){return <><Composition id="Veyra" component={Film} durationInFrames={990} fps={30} width={1920} height={1080}/><Composition id="ProductDesktop" component={VeyraApp} durationInFrames={1} fps={30} width={1440} height={1100}/><Composition id="ProductMobile" component={VeyraApp} durationInFrames={1} fps={30} width={390} height={2000}/></>}
