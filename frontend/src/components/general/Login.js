import {useAuthState} from "../AuthProvider";
import {useLocation, useNavigate} from "react-router-dom";
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from "react-hook-form";

export { Login };

function Login({ history }) {
    const isAuthenticatedState= useAuthState(); // используем контекст для получения значений isAuthenticated и setAuth
    const navigate = useNavigate(); // используем хук useNavigate для навигации по маршрутам
    const location = useLocation(); // используем хук useLocation для получения текущего маршрута
    const from = location.state?.from?.pathname || "/"; // получаем маршрут, на который нужно перенаправить пользователя после авторизации
    // form validation rules
    const validationSchema = Yup.object().shape({
        username: Yup.string().required('Username is required'),
        password: Yup.string().required('Password is required')
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    // get functions to build form with useForm() hook
    const { register, handleSubmit, setError, formState } = useForm(formOptions);
    const { errors, isSubmitting } = formState;

    function onSubmit({ username, password }) {
        if (username === 'test' && password === 'test') {
            isAuthenticatedState.setIsAuth(true); // устанавливаем флаг isAuthenticated в true
            navigate(from, { replace: true }); // перенаправляем пользователя на страницу, которую он запрашивал до авторизации
            return {status:200};
        } else {
            return setError('authError', { message: "Неверный логин или пароль. Повторите попытку" });
        }
    }
    return (
        <>
             <div className="col-md-6 offset-md-3 mt-5">
                 <div className="card">
                     <h4 className="card-header">Login</h4>
                     <div className="card-body">
                         <form onSubmit={handleSubmit(onSubmit)}>
                             <div className="form-group">
                                 <label>Username</label>
                                 <input name="username" type="text" {...register('username')} className={`form-control ${errors.username ? 'is-invalid' : ''}`} />
                                 <div className="invalid-feedback">{errors.username?.message}</div>
                             </div>
                             <br/>
                             <div className="form-group">
                                 <label>Password</label>
                                 <input name="password" type="password" {...register('password')} className={`form-control ${errors.password ? 'is-invalid' : ''}`} />
                                 <div className="invalid-feedback">{errors.password?.message}</div>
                             </div>
                             <br/>
                             <button disabled={isSubmitting} className="btn btn-primary">
                                 {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                                 Login
                             </button>
                             {errors.authError &&
                                 <div className="alert alert-danger mt-3 mb-0">{errors.authError?.message}</div>
                             }
                         </form>
                     </div>
                 </div>
             </div>
        </>
    );
}