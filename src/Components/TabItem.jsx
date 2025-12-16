const TabItem = (p) => {
  return (
    <>
      <input id={p.id} type="radio" checked={p.checked} onChange={p.onChange} />
      <label className="nav-link" htmlFor={p.id}>
        {p.children}
      </label>
    </>
  );
};

export default TabItem;
