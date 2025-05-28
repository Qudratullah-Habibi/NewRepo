import { useState } from 'react';
import PropTypes from 'prop-types'; // ✅ Import prop-types
import { login } from './auth';

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const handleLogin = async () => {
        try {
            await login(email, password);
            onLogin(); // Notify parent
        } catch (error) {
            setErrorMsg(error.message);
        }
    };

    return (
        <div>
            <h2>Owner Login</h2>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            /><br />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            /><br />
            <button onClick={handleLogin}>Login</button>
            {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
        </div>
    );
};

// ✅ Add this for prop validation
Login.propTypes = {
    onLogin: PropTypes.func.isRequired,
};

export default Login;
