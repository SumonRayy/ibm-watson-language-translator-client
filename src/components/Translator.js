import React, { Component } from 'react';

const apiURL = process.env.REACT_SERVER_URL || 'http://localhost:6969';

function LanguageList(props) {
    const { languages, selectedLanguage, onChangeLanguage } = props;
    return (
        <select value={selectedLanguage} onChange={(value) => onChangeLanguage(value)}>
            {languages.map(language => (
                <option key={language} value={language}>{language}</option>
            ))}
        </select>
    );
}

class Translator extends Component {

    constructor(props) {
        super(props);

        this.state = {
            languageNames: [],
            languageCodes: [],
            selectedLanguageNameFrom: 'English',
            selectedLanguageNameTo: 'Bengali',
            selectedLanguageCodeFrom: 'en',
            selectedLanguageCodeTo: 'bn',
            text: '',
            translatedText: '',
        };

        this.onChangeLanguageFrom = this.onChangeLanguageFrom.bind(this);
        this.onChangeLanguageTo = this.onChangeLanguageTo.bind(this);
        this.translateText = this.translateText.bind(this);
    }

    componentDidMount() {
        this.getLanguages();
    }

    getLanguages() {
        fetch(apiURL + '/languages')
            .then(response => response.json())
            .then(data => {
                this.setState({
                    languageNames: data.map(language => language.language_name),
                    languageCodes: data.map(language => language.language)
                });
            });
    }

    onChangeLanguageFrom(event) {

        const indexOfLanguage = this.state.languageNames.indexOf(event.target.value);
        const selectedLanguageCode = this.state.languageCodes[indexOfLanguage];
        this.setState({
            selectedLanguageNameFrom: event.target.value,
            selectedLanguageCodeFrom: selectedLanguageCode
        });

    }

    onChangeLanguageTo(event) {

        const indexOfLanguage = this.state.languageNames.indexOf(event.target.value);
        const selectedLanguageCode = this.state.languageCodes[indexOfLanguage];
        this.setState({
            selectedLanguageNameTo: event.target.value,
            selectedLanguageCodeTo: selectedLanguageCode
        });

    }

    translateText(event) {

        fetch(apiURL + '/translate?text=' + this.state.text + '&modelId=' + this.state.selectedLanguageCodeFrom + '-' + this.state.selectedLanguageCodeTo)
            .then(response => response.json())
            .then(data => {
                this.setState({
                    translatedText: data.translations[0].translation
                });
            })
            .catch(error => console.log(error));

        event.preventDefault();
    }

    render() {
        return (
            <div className='translator-container'>
                {
                    this.state.languageNames.length > 0 ? (
                        <React.Fragment>
                            <h3> Choose a language: </h3>
                            <div className='translator-header'>
                                <div className='langlist'>
                                    <p>Translate From</p>
                                    <LanguageList
                                        languages={this.state.languageNames}
                                        selectedLanguage={this.state.selectedLanguageNameFrom}
                                        onChangeLanguage={this.onChangeLanguageFrom}
                                    />
                                </div>
                                <div className='langlist'>
                                    <p>Translate To</p>
                                    <LanguageList
                                        languages={this.state.languageNames}
                                        selectedLanguage={this.state.selectedLanguageNameTo}
                                        onChangeLanguage={this.onChangeLanguageTo}
                                    />
                                </div>
                            </div>
                            <div className='translator-body'>
                                <div className='translator-input'>
                                    <form onSubmit={this.translateText}>
                                        <textarea
                                            value={this.state.text}
                                            onChange={(event) => this.setState({ text: event.target.value })}
                                        />
                                        <button type='submit'>Translate</button>
                                    </form>
                                </div>
                                <div className='translator-output'>
                                    <p>
                                        {this.state.translatedText}
                                    </p>
                                </div>
                            </div>
                        </React.Fragment>
                    ) : (<p>Loading...</p>)
                }
            </div>
        );
    }
}

export default Translator;
