import CamelImage from '@images/camel.svg';
import React, { ComponentType } from 'react';

const CamelIcon: ComponentType = () => {
    return (
        <img src={CamelImage} alt="Camel" width='50px' height='50px' />
    );
};

export default CamelIcon;