
import React from 'react';
import { Link } from 'react-router-dom';

const BrandedGameHeader = ({ gameTitle }) => {
  return (
    <div className="brand-header">
      <Link to="/" className="nicd-logo-container mr-2">
        <img src="/nicd-icon.svg" alt="NICD Icon" className="h-[35px] md:h-[50px] w-auto object-contain" />
      </Link>
      <span className="text-muted-foreground font-medium">|</span>
      <span className="text-foreground truncate max-w-[150px] md:max-w-none ml-2 tracking-normal capitalize">{gameTitle}</span>
    </div>
  );
};

export default BrandedGameHeader;
