import { useState, useEffect } from 'react';
import './App.css';
import supabase from './supabaseClient';
import UploadComponent from './UploadComponent';
import ProductsPage from './ProductsPage';
import ReviewsSection from './ReviewsSection';
import PlaceOrder from './PlaceOrder';
import AdminOrders from './AdminOrders';
import { useTranslation } from 'react-i18next';
import HomePage from './components/HomePage';
import dryfruitBanner from './assets/images/dryfruit-banner.jpg';


function App() {
    const [user, setUser] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { t } = useTranslation();

    useEffect(() => {
        const getSession = async () => {
            try {
                const {
                    data: { session },
                    error,
                } = await supabase.auth.getSession();
                if (error) throw error;
                setUser(session?.user || null);
            } catch (err) {
                console.error('Error fetching session:', err.message);
                setTimeout(getSession, 1000);
            }
        };

        getSession();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user || null);
        });

        const faders = document.querySelectorAll('.fade-in, .fade-in-up, .fade-in-slow');

        const appearOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px',
        };

        const appearOnScroll = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, appearOptions);

        faders.forEach(fader => {
            appearOnScroll.observe(fader);
        });

        return () => {
            subscription.unsubscribe();
            faders.forEach(fader => {
                appearOnScroll.unobserve(fader);
            });
        };
    }, []);

    const handleLogin = async () => {
        setLoading(true);
        setError(null);
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            setError(error.message);
        } else {
            setUser(data.user);
        }
        setLoading(false);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };

    const isAdmin = user?.email === 'greenpointafghanistan@gmail.com';

    return (

        <div className="app bg-gradient">
            <div className="container main-container">
                {/* Language Switcher */}
                {/*<div className="language-selector top-right">
                    <LanguageSelector />
                </div>*/}

                {/* Title */}
                <h1 className="title fade-in">
                    {t('business_title') || 'GreenpointAfghanistan'}
                </h1>

                {/* Banner Hero Section with imported image */}
                <section
                    className="hero-section fade-in"
                    style={{
                        backgroundImage: `url(${dryfruitBanner})`,
                    }}
                >
                    <div className="hero-content">
                        <h2>{t('banner_heading') && 'Welcome to Greenpoint Afghanistan'}</h2>
                        <p>{t('banner_subtitle') && 'Quality Dry Fruits Straight from Afghanistan'}</p>
                    </div>
                </section>

                {/* If user is logged in */}
                {user ? (
                    <>
                        <p className="welcome-text fade-in-slow">
                            {t('welcome')}, <span className="user-email">{user.email}</span>
                        </p>

                        {isAdmin ? (
                            <>
                                <section className="section card-glass">
                                    <AdminOrders />
                                </section>
                                <section className="section card-glass">
                                    <UploadComponent user={user} />
                                </section>
                            </>
                        ) : (
                            <>
                                <section className="section card-glass">
                                    <UploadComponent user={user} />
                                </section>
                                <section className="section card-glass">
                                    <PlaceOrder isAdmin={false} />
                                </section>
                            </>
                        )}

                        <button onClick={handleLogout} className="logout-button glow">
                            {t('logout')}
                        </button>
                    </>
                ) : (
                    <>
                        {/* Guest Welcome Page Section */}
                        <HomePage />

                        {/* Guest View */}
                        <section className="section highlight fade-in-up">
                            <ProductsPage />
                        </section>

                        <section className="section card-glass fade-in-up">
                            <PlaceOrder isAdmin={false} />
                        </section>

                        <section className="section highlight-light fade-in-up">
                            <ReviewsSection />
                        </section>

                        <hr className="divider" />

                        {/* Admin Login */}
                        <h2 className="subtitle fade-in">{t('admin_login')}</h2>

                        {error && <p className="error-text shake">{error}</p>}

                        <div className="login-form card-glass">
                            <input
                                type="email"
                                placeholder={t('email')}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-field"
                            />
                            <input
                                type="password"
                                placeholder={t('password')}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-field"
                            />
                            <button
                                onClick={handleLogin}
                                disabled={loading}
                                className="login-button glow"
                            >
                                {loading ? t('logging_in') : t('login')}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default App;
