import moment from "moment";

function minuteDiff(data1 = new Date(), data2) {
    // Converta as datas para objetos Moment
    const momento1 = moment(data1);
    const momento2 = moment(data2);

    // Calcule a diferença em minutos
    const diffMinutes = momento1.diff(momento2, 'minutes');

    // Retorna a diferença
    return diffMinutes;
}

minuteDiff(new Date(), new Date()) // Exemplo de uso, retorna 0 se as datas forem iguais
