export const Checkbox = ({
  label,
  value,
  onChange,
  isDisabled,
  labelstyle,
}) => {
  return (
    <label
      className={`ml-4 flex justify-center items-center py-1 ${
        labelstyle ? labelstyle : "content"
      } `}
    >
      <div className=" cursor-pointer flex justify-center items-center ">
        <input
          type="checkbox"
          checked={value}
          onChange={onChange}
          disabled={isDisabled}
          className="checked:bg-green-light checked:border-transparent h-5 w-5 rounded-lg bg-green-light cursor-pointer"
          // style={{ accentColor: '#74992e' }}
          style={{ accentColor: "#7DBA54" }}
        />
        <span className="pl-2">{label}</span>
      </div>
    </label>
  );
};

export const CheckboxWithIcon = ({
  children,
  value,
  onChange,
  isDisabled,
  title,
}) => {
  return (
    <label className="ml-4 content flex justify-center items-center">
      <input
        type="checkbox"
        checked={value}
        onChange={onChange}
        disabled={isDisabled}
        className="checked:bg-green-light checked:border-transparent h-5 w-5 rounded-lg bg-green-light"
        // style={{ accentColor: '#74992e' }}
        style={{ accentColor: "#7DBA54" }}
      />
      <div className="pl-2" title={title}>
        {children}
      </div>
    </label>
  );
};
