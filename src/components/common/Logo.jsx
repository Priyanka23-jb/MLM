import React from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../../assets/logo.png';
import logoWhiteImg from '../../assets/logo-white.png';

export const Logo = ({ className = "h-11", variant = "default", linkTo = "/" }) => {
  const imgSource = variant === 'white' ? logoWhiteImg : logoImg;
  const content = (
    <div className="flex items-center gap-2 group cursor-pointer">
      <img 
        src={imgSource} 
        alt="DirectGrow - Ayurvedic Wellness" 
        className={`${className} w-auto object-contain transition-transform group-hover:scale-105 duration-200`}
      />
    </div>
  );

  if (linkTo) {
    return <Link to={linkTo}>{content}</Link>;
  }
  return content;
};
