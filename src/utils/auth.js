export const isAuthenticated = () => {
  return localStorage.getItem("auth") === "true";
};

export const loginUser = () => {
  localStorage.setItem("auth", "true");
};

export const logoutUser = () => {
  localStorage.removeItem("auth");
};
