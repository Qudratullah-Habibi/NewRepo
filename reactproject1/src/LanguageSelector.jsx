import { useTranslation } from 'react-i18next';

function LanguageSelector() {
    const { i18n } = useTranslation();

    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
    };

    return (
        <div className="mb-4 flex justify-end pr-4">
            <select
                onChange={(e) => changeLanguage(e.target.value)}
                value={i18n.language}
                className="border border-gray-300 rounded px-2 py-1"
            >
                <option value="en">English</option>
                <option value="fa">Farsi</option>
                <option value="ps">Pashto</option>
            </select>
        </div>
    );
}

export default LanguageSelector;
// JavaScript source code
