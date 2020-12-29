const Logo = ({ 
  className = '', 
  inverted = false
}) => (
  <div className={`${className} outer-ring justify-self-center rounded-full w-10 h-10 bg-primary flex justify-center items-center transition-colors duration-100 ${ inverted && "bg-primary-2"}`}>
    <div className={`inner-ring rounded-full w-5 h-5 bg-accents-7`}>
    </div>
  </div>
);

export default Logo;
