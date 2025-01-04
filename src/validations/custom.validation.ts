const objectId = (value: string, helpers: any) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message('Định dạng ID không hợp lệ.');
  }

  return value;
};

export { objectId };
