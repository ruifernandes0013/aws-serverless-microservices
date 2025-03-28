export const successResponse = (body) => {
  console.log("SUCCESS");
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
};

export const errorResponse = (error) => {
  console.log("ERROR", error);
  return {
    statusCode: error.statusCode || 500,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: error.message,
    }),
  };
};
