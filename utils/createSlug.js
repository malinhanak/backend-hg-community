exports.createSlug = (name) => {
  return name
    ? name
        .trim()
        .replace(/[äåáà]/gim, 'a')
        .replace(/[ööôóò]/gim, 'o')
        .replace(/[èé]/gim, 'e')
        .replace(/\s/g, '-')
        .toLowerCase()
    : null;
};
