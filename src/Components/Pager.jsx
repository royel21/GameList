const Pager = ({ data, setData }) => {
  const { page, totalPages } = data;

  const nextPage = () => {
    let next = page + 1;
    if (next < totalPages) {
      setData({ ...data, page: next });
    }
  };

  const prevPage = () => {
    let prev = page - 1;
    if (prev > -1) {
      setData({ ...data, page: prev });
    }
  };

  const pageFocus = ({ target }) => {
    target.value = page + 1;
  };

  const jumpToPage = (e) => {
    e.preventDefault();
    const el = e.target.querySelector("input");
    if (!isNaN(el.value)) {
      const val = +el.value - 1;
      if (val > -1 && val < totalPages) {
        setData({ ...data, page: val });
      }
    }
    el.value = "";
  };

  const onKeyDown = (e) => {
    e.stopPropagation;
    if (isNaN(e.target.value)) {
      e.target.value = "";
    }
  };

  return (
    <div id="pager">
      <span onClick={prevPage}>
        <i className="fas fa-angle-left" />
      </span>
      <form onSubmit={jumpToPage}>
        <input
          type="text"
          defaultValue=""
          placeholder={totalPages ? `${page + 1}/${totalPages}` : "0/0"}
          onKeyDown={onKeyDown}
          onClick={pageFocus}
          onBlur={({ target }) => (target.value = "")}
          disabled={totalPages < 2}
        />
      </form>
      <span onClick={nextPage}>
        <i className="fas fa-angle-right" />
      </span>
    </div>
  );
};

export default Pager;
