import React from 'react';
import './App.css';

import { getNovaPalavra } from './services/deutsch-service';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            palavra: '',
            artigos: [],
            acertos: 0,
            showQuestion: false,
            loading: false,
            showBegin: true,
            showHits: false,
            answered: false,
            der: false,
            die: false,
            das: false,
        }
    }

    async run() {
        this.setState({ showQuestion: false, loading: true });

        const data = await getNovaPalavra();
        const { word, articles } = data;

        this.setState({
            palavra: word,
            artigos: articles,
            showQuestion: true,
            loading: false,
            der: false,
            die: false,
            das: false
        });
    }

    isRespostaCorreta(artigos, resposta) {
        return artigos.includes(resposta)
    }

    async start() {
        this.setState({ showBegin: false, showHits: true });

        await this.run();
    }

    desabilitaBotoesResposta({ resposta }) {
        if (resposta === 'der') {
            this.setState({ die: true, das: true });
        }
        if (resposta === 'die') {
            this.setState({ der: true, das: true });
        }
        if (resposta === 'das') {
            this.setState({ der: true, die: true });
        }
    }

    async handleRespostaCorreta(resposta) {
        const { artigos, acertos, der, die, das, answered } = this.state;

        if (answered) return;
        this.setState({ answered: true });

        if (this.isRespostaCorreta(artigos, resposta)) {
            const novoAcerto = acertos + 1;

            this.setState({ acertos: novoAcerto });
            this.desabilitaBotoesResposta({ resposta, der, die, das });
        } else {
            const [correct] = artigos;

            this.setState({ acertos: 0 });
            this.desabilitaBotoesResposta({ resposta: correct, der, die, das });
        }
        setTimeout(() => {
            this.run();
            this.setState({ answered: false });
        }, 2000);
    }

    render() {
        const { palavra, showQuestion, acertos, loading, showBegin, showHits, der, die, das } = this.state;

        return (
            <div className="wrapper">
                <div className="content">
                    <section className="center">
                        <h1>Substantive lernen</h1>
                    </section>
                </div>

                { showBegin ? (
                    <section className="center">
                        <input type="text" placeholder="Dein name" className="input-name"/>
                        <button className="button-options button-primary"
                                onClick={ () => this.start() }>Start
                        </button>
                    </section>
                ) : null }

                { showHits && !loading ? (<section className="center"><h2>Gesamt: { acertos }</h2></section>) : null }
                { loading ? (<section className="center"><h1>Warten...</h1></section>) : null }

                { showQuestion ? (<>
                    <section className="center">
                        <h2>{ palavra }</h2>
                    </section>

                    <section className="center">
                        <button className="button-options button-primary"
                                disabled={ der }
                                onClick={ () => this.handleRespostaCorreta('der') }>Der
                        </button>
                        <button className="button-options button-primary"
                                disabled={ die }
                                onClick={ () => this.handleRespostaCorreta('die') }>Die
                        </button>
                        <button className="button-options button-primary"
                                disabled={ das }
                                onClick={ () => this.handleRespostaCorreta('das') }>Das
                        </button>
                    </section>
                </>) : null
                }
            </div>
        );
    }

}

export default App;
