const _throw = (status, msg) => {
  !msg && (msg = "");
  throw { status, msg };
};

export default _throw;
