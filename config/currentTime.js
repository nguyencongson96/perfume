const currentTime = () => {
  const currentDate = new Date();
  return new Date(currentDate - currentDate.getTimezoneOffset() * 60000);
};

export default currentTime;
