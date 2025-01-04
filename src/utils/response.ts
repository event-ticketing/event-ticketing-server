const response = (statusCode: number, message: string, data: any = null) => {
  return {
    statusCode,
    message,
    ...(data !== null ? { data } : {}),
  };
};

export default response;
