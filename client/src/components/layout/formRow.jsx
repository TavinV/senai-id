const FormRow = ({ children }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 w-full flex-wrap">
      {children}
    </div>
  );
};

export default FormRow;