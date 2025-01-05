const objectId = (value: string, helpers: any) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message('Định dạng ID không hợp lệ.');
  }

  return value;
};

const password = (value: string, helpers: any) => {
  if (value.length < 6 || value.length > 32) {
    return helpers.message('Mật khẩu phải từ 6 đến 32 ký tự.');
  }

  return value;
};

export { objectId, password };
