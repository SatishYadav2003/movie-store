import React from "react";

const BoundryBorder = () => {
  return (
    <div>
      <div className="select-none mt-5 bg-black p-3 text-xs sm:text-sm md:text-lg lg:text-xl flex justify-between opacity-80 text-center items-center">
        <span className="font-thin text-white sm:mx-2 mx-auto">
          All movie are belong to Movie4u
        </span>
        <span className="font-thin text-white mx-2 sm:flex hidden">
          All movie are belong to Movie4u
        </span>
        <span className="font-thin text-white mx-2 sm:flex hidden">
          All movie are belong to Movie4u
        </span>
      </div>
    </div>
  );
};

export default BoundryBorder;
