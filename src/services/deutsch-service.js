import axios from 'axios';

export async function getNovaPalavra() {
    try {
        const { data } = await axios.get('http://localhost:3333/deutsch/derdiedas');

        return data;
    } catch (err) {
        console.error(err);

        return {};
    }
}
