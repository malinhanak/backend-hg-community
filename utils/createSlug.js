exports.createSlug = (name) => {
  return name.trim().replace(/\s/g, '-').toLowerCase();
};
