import React from 'react';
import SvgMapIcon, { ISvgMapIconConsumerProps } from './SvgMapIcon';

export default function WorkshopIcon(props: ISvgMapIconConsumerProps) {
    return <SvgMapIcon {...props}>
        <path
            d='m 3.5,12.5 11,-11'
        />
        <path
            d='M 2,0.5 7.5,5 8.6620582,3.8669903 11.363012,6.1280143 11.942646,9.7148635 15.5,12 l -2,3.5 -1.529424,-3.049381 c 0,0 -2.0529145,-0.140917 -2.6288698,-0.896177 C 8.7657509,10.799182 9.5403567,9.2302879 9.164279,8.6383907 8.7882013,8.0464935 7.781148,7.7682038 7.4054975,7.4588446 L 0.5,2 Z'
        />
        <path
            d='m 15.227996,0.78718428 -4,1.00000002 3,3 z'
        />
        <path
            d='m 1.2071068,11.917893 h 2 l 0.875,0.875 v 2 l 2.515625,-2.515625 v -2 l -0.875,-0.8749998 h -2 z'
        />
    </SvgMapIcon>;
}
