import React from 'react';
import SvgMapIcon, { ISvgMapIconProps } from './SvgMapIcon';

export default function PlantIcon(props: ISvgMapIconProps) {
    return <SvgMapIcon {...props}>
        <path
            d='m 2.8778094,14.473001 c 4.3876321,-0.41745 7.8138246,-0.04046 10.2780456,-3.33905 2.464221,-3.2985916 2.021904,-6.5509687 1.88711,-7.6293175 -0.134793,-1.0783487 -0.471773,-2.399326 -0.471773,-2.399326 0,0 -2.073081,1.5807581 -4.066305,2.1632389 C 8.5116632,3.8510271 5.7294728,3.5753267 3.5315922,6.2005053 1.3337115,8.825684 2.3924999,9.6514621 1.6377082,12.855477 1.3142035,13.098105 -2.567852,16.117482 -2.567852,16.117482 l 1.4018534,1.779275 z'
        />
        <path
            d='M 13.420136,3.7744133 C 13.091334,5.3128021 11.580247,7.7303965 8.8914573,8.0918788 6.3795445,8.4295817 5.4707764,10.181276 3.602849,12.486064'
        />
        <path
            d='m 4.289106,7.834767 c 0.9752563,1.6053973 1.6945576,3.378489 4.0794164,4.060354'
        />
        <path
            d='M 8.7688389,4.927706 C 8.8784013,6.9318923 10.424816,8.2633687 12.848256,8.9880599'
        />
    </SvgMapIcon>;
}
