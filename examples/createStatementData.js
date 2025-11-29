export default function createStatementDate(invoice, plays){
    const result = {}
    result.customer = invoice.customer
    result.performances = invoice.performances.map(enrichPerformance)
    result.totalAmount = totalAmount(result)
    result.totalVolumeCredits = totalVolumeCredits(result)
    return result

    function enrichPerformance(aPerformance){
        const result = Object.assign({}, aPerformance)
        result.play = playFor(result)
        result.amount  = amountFor(result)
        result.volumeCredits = volumeCreditsFor(result)
        return result
    }

    function playFor(aPerformance){

    }

    function amountFor(aPerformance){

    }

    function volumeCreditsFor(aPerformance){

    }
    function totalAmount(data){

    }

    function totalVolumeCredits(data){
        
    }

}