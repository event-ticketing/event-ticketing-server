const response = (code: number, message: string, data: any = null) => {
  return {
    code,
    message,
    ...(data !== null ? { data } : {}),
  };
};

export default response;
