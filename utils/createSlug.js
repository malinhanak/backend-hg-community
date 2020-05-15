exports.createSlug = (name) => {
  return name ? name.trim().replace(/\s/g, '-').toLowerCase() : null;
};
