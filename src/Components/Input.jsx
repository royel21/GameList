import { useEffect, useRef, useState } from "react";

const Input = (props) => {
  const { name, value, onChange, className, style, placeholder, required } = props;
  const [cursor, setCursor] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    const input = ref.current;
    if (input) {
      input.setSelectionRange(cursor, cursor);
    }
  }, [ref, cursor, value]);

  const handleChange = (e) => {
    setCursor(e.target.selectionStart);
    onChange && onChange(e);
  };

  return (
    <input
      name={name}
      className={className}
      style={style}
      ref={ref}
      value={value}
      placeholder={placeholder}
      onChange={handleChange}
      required={required}
    />
  );
};

export default Input;
