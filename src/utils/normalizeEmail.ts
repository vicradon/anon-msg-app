const normalizeEmail = (email: string) => {
  return email.split("@")[0].toLowerCase().trim().replace(/\./g, "-");
};

export default normalizeEmail;
