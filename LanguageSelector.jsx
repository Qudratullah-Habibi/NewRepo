import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSelector = () => {
    const { i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div className="language-selector" style={{ marginBottom: '1rem', textAlign: 'center' }}>
            <button onClick={() => changeLanguage('en')} style={{ margin: '0 0.5rem' }}>
                English
            </button>
            <button onClick={() => changeLanguage('fa')} style={{ margin: '0 0.5rem' }}>
                فارسی
            </button>
            <button onClick={() => changeLanguage('ps')} style={{ margin: '0 0.5rem' }}>
                پښتو
            </button>
        </div>
    );
};

export default LanguageSelector;
