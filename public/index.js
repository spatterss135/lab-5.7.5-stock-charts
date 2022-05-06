async function main() {

    const timeChartCanvas = document.querySelector('#time-chart');
    const highestPriceChartCanvas = document.querySelector('#highest-price-chart');
    const averagePriceChartCanvas = document.querySelector('#average-price-chart');
    

    let response = await fetch('https://api.twelvedata.com/time_series?symbol=GME,MSFT,DIS,BNTX&interval=1day&apikey=9063edb71e43472bb443a2a6a27d8c9f')
    let dataPoints = await response.json()
    const { GME, MSFT, DIS, BNTX } = dataPoints;
    const stocks = [GME, MSFT, DIS, BNTX];

    function getColor(stock){
        if(stock === "GME"){
            return 'rgba(61, 161, 61, 0.7)'
        }
        if(stock === "MSFT"){
            return 'rgba(209, 4, 25, 0.7)'
        }
        if(stock === "DIS"){
            return 'rgba(18, 4, 209, 0.7)'
        }
        if(stock === "BNTX"){
            return 'rgba(166, 43, 158, 0.7)'
        }
    }

    function getHighestValue(stocks) {
        let highestValues = []
        stocks.forEach(stock => {
            let highCloses = stock.values.map(value => value.high)
            let highestClose = Math.max(...highCloses)
            highestValues.push(highestClose)
        })
        return highestValues
    }

    function getAverageValue(stocks) {
        let averageValues = []
        stocks.forEach(stock => {
            let highCloses = stock.values.map(value => parseFloat(value.high))
            let averageHighClose = highCloses.reduce((a,b) => a+b)/highCloses.length
            averageValues.push(averageHighClose)
        })
        return averageValues
    }




var ctx = highestPriceChartCanvas.getContext('2d');
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: stocks.map(stock => stock.meta.symbol),
        datasets: 
            [{label: 'Highest', 
             data: getHighestValue(stocks), 
             backgroundColor: [getColor('GME'), getColor('DIS'), getColor('MSFT'), getColor('BNTX')],
            borderColor:  [getColor('GME'), getColor('DIS'), getColor('MSFT'), getColor('BNTX')]}]
    }
});



    var ctx = timeChartCanvas.getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: stocks[0].values.reverse().map(value => value.datetime),
            datasets: stocks.map(stock => {
                return {
                    label: stock.meta.symbol,
                    data: stock.values.map(value => value.high),
                    backgroundColor: [
                        getColor(stock.meta.symbol)
                    ],
                    borderColor: [
                        getColor(stock.meta.symbol)
                    ]
                
                }
            })
        }
    });


    var ctx = averagePriceChartCanvas.getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: stocks.map(stock => stock.meta.symbol),
            datasets: 
                [{label: 'Highest', 
                 data: getAverageValue(stocks), 
                 backgroundColor: [getColor('GME'), getColor('DIS'), getColor('MSFT'), getColor('BNTX')],
                borderColor:  [getColor('GME'), getColor('DIS'), getColor('MSFT'), getColor('BNTX')]}]
        }
    });

    }


main()