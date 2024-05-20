import React from 'react'
import Image from 'next/image'

const CategoryCard = ({title, imageUrl}) => {
  return (
    <div className="h-20 relative overflow-hidden transition-transform transform hover:scale-105">
      <div className="img-cont w-full h-20 relative">
        <Image src={imageUrl} alt="" layout='fill' className='object-cover rounded-lg' />
      </div>
      <div className="text absolute font-bold text-3xl text-white items-center justify-center cursor-pointer flex inset-0 ">
        {title}
      </div>
    </div>
  );
}

export default CategoryCard;

