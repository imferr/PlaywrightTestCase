//Generar email aleatorio
export function randomEmail() {
    return `random-${Math.floor(Math.random() * 9999)}@ucb.edu.bo`;
}
export default randomEmail;