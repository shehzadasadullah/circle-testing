const InstagramIcon = ({ className = '' }) => {
    return (
      <svg
        className={`h-6 w-6 ${className}`}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 3333 3333"
        shapeRendering="geometricPrecision"
        textRendering="geometricPrecision"
        imageRendering="optimizeQuality"
        fillRule="evenodd"
        clipRule="evenodd"
      >
        <path 
        fill="#D0DAF5"
        d="M1667 0c920 0 1667 746 1667 1667 0 920-746 1667-1667 1667C747 3334 0 2588 0 1667 0 747 746 0 1667 0zm-390 752h780c293 0 532 237 532 525v778c0 289-239 525-532 525h-780c-293 0-532-236-532-525v-778c0-289 240-525 532-525zm385 421c285 0 516 231 516 516s-231 516-516 516-516-231-516-516 231-516 516-516zm0 174c188 0 341 153 341 341s-153 341-341 341c-189 0-341-153-341-341s153-341 341-341zm499-246c46 0 84 37 84 84 0 46-37 84-84 84-46 0-84-37-84-84 0-46 37-84 84-84zm-820-200h652c245 0 445 199 445 443v656c0 244-200 443-445 443h-652c-245 0-445-199-445-443v-656c0-244 200-443 445-443z" />
      </svg>
    );
  };
  
  export default InstagramIcon;
  