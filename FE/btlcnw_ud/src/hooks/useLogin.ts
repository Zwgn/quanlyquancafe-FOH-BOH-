import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { login } from "../services/authService";
import { useAppContext } from "../context/AppContext";

const useLogin = () => {
  const navigate = useNavigate();
  const { setUsername: setAppUsername } = useAppContext();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { user, token } = await login({ username, password });

      localStorage.setItem("user", JSON.stringify(user));
      setAppUsername(
        user.displayName ?? user.name ?? user.fullName ?? user.username
      );

      if (token) {
        localStorage.setItem("authToken", token);
      } else {
        localStorage.removeItem("authToken");
      }

      navigate("/dashboard");
    } catch (requestError) {
      const fallbackMessage = "Tên người dùng hoặc mật khẩu không đúng.";
      if (requestError instanceof AxiosError) {
        const apiMessage =
          (requestError.response?.data as { message?: string } | undefined)?.message;
        setError(apiMessage || fallbackMessage);
      } else {
        setError(fallbackMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    username, setUsername,
    password, setPassword,
    rememberMe, setRememberMe,
    showPassword, setShowPassword,
    loading, error,
    handleSubmit
  };
};

export default useLogin;
