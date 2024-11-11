const Card = ({ children, bg = "bg-green-100" }) => {
  return <div className={` ${bg} p-6 rounded-2xl shadow-md`}>{children}</div>;
};

export default Card;
