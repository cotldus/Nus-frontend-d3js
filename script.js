const balance = document.getElementById('balance');
const money_plus = document.getElementById('deposit');
const money_minus = document.getElementById('loan');
const list = document.getElementById('list');

const form = document.getElementById('form');
const custname = document.getElementById('custname');
const custpwd = document.getElementById('custpwd');

const reco = document.getElementById('reco');
const b1 = document.getElementById('b1');
const b2 = document.getElementById('b2');
const loginList = document.getElementById('loginList');



const TransactionDataAll = [
   { id: 1, customername: 'Flora', bank: 'DBS', deposit: 3000, loan: 2000 },
   { id: 2, customername: 'Flora', bank: 'OCBC', deposit: 4000, loan: 2000 },
   { id: 3, customername: 'Mikhil', bank: 'DBS', deposit: 3000, loan: 2000 },
   { id: 4, customername: 'Sashil', bank: 'UOB', deposit: 6000, loan: 1000 },
   { id: 5, customername: 'Jack', bank: 'UOB', deposit: 6000, loan: 8000 },
   { id: 6, customername: 'Jill', bank: 'UOB', deposit: 7000, loan: 4000 },

  ];

const LoginDataAll = [
  { id: 1, customername: 'Flora', pwd:'1234F' },
  { id: 3, customername: 'Mikhil', pwd:'1234M' },
  { id: 4, customername: 'Sashil', pwd:'1234S' },
  { id: 5, customername: 'Jack', pwd:'1234Ja' },
  { id: 6, customername: 'Jill', pwd:'1234Ji' },
  { id: 7, customername: 'Master', pwd:'masterkey' }
]

 var TransactionData = null;

// Add transactions to DOM list (show deposit-loan)
function addTransactionDOM(transaction) {
  const deposit_item = document.createElement('li');

  deposit_item.classList.add('plus');
  deposit_item.innerHTML = `
  ${transaction.customername}-${transaction.bank}  <span> $ ${Math.abs(
    transaction.deposit  
  ) - Math.abs(
    transaction.loan  
  )}</span> 
  `;
  // Flora - DBS <span>$3000</span>
  

  list.appendChild(deposit_item);

  // const loan_item = document.createElement('li');

  // loan_item.classList.add('minus');
  // loan_item.innerHTML = `
  // ${transaction.customername}-${transaction.bank} <span> -$ ${Math.abs(
  //   transaction.loan  
  // )}</span> 
  // `;

  // list.appendChild(loan_item);
}

// add login history
function addAccessLogs(custname) {

  const dateTime = new Date().toLocaleString(); // get current date and time
  const login_item = document.createElement('li');

  login_item.innerHTML = `${custname}  <span> ${dateTime}</span>`;

  loginList.appendChild(login_item);

  // Ideally, this will connect to backend here, so that we don't lose the logs
  // every time a user refresh the page or clicks the reset button

}


// Update the balance, deposit and loan
function updateValues() {
  const deposits = TransactionData.map(transaction => transaction.deposit);
  const loans = TransactionData.map(transaction => transaction.loan);
  const total_deposit = deposits.reduce((acc, item) => (acc += item), 0).toFixed(2);
  const total_loan = loans.reduce((acc, item) => (acc += item), 0).toFixed(2);
  const bal = total_deposit - total_loan;
  balance.innerText = `$${bal}`;
  money_plus.innerText = `$${total_deposit}`;
  money_minus.innerText = `$${total_loan}`;
  reco.innerText = (bal >= 0)? "You Have Sound Financial Health": "Your Financial Health is Weak";

// Draw pie chart
    // set the dimensions and margins of the graph
    var width = 300
    height = 300  
    margin = 30

    // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
    var radius = Math.min(width, height) / 2 - margin

    // append the svg object to the div called 'my_dataviz'
    var svg = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
    var data = {Deposits: total_deposit, Loans: total_loan}
    
    // set the color scale
    var color = d3.scaleOrdinal()
      .domain(data)
      .range(d3.schemeSet2);
    
    // Compute the position of each group on the pie:
    var pie = d3.pie()
      .value(function(d) {return d.value; })
    var data_ready = pie(d3.entries(data))
    // Now I know that group A goes from 0 degrees to x degrees and so on.
    
    // shape helper to build arcs:
    var arcGenerator = d3.arc()
      .innerRadius(0)
      .outerRadius(radius)
    
    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    svg
      .selectAll('mySlices')
      .data(data_ready)
      .enter()
      .append('path')
        .attr('d', arcGenerator)
        .attr('fill', function(d){ return(color(d.data.key)) })
        .attr("stroke", "black")
        .style("stroke-width", "2px")
        .style("opacity", 0.7)
    
    // Now add the annotation. Use the centroid method to get the best coordinates
    svg
      .selectAll('mySlices')
      .data(data_ready)
      .enter()
      .append('text')
      .text(function(d){ return d.data.key})
      .attr("transform", function(d) { return "translate(" + arcGenerator.centroid(d) + ")";  })
      .style("text-anchor", "middle")
      .style("font-size", 17)
  }

  // refresh
  function init() {
    // Clear piechart
    document.getElementById("my_dataviz").innerHTML = '';
    // Clear data
    list.innerHTML = '';
    reco.innerHTML = '';
    TransactionData = [];
  }

  function filterTransaction(e) {
    // e.preventDefault();  // not required anymore as we moved it to grantPermission
    document.getElementById("my_dataviz").innerHTML = '';
    list.innerHTML = '';
    reco.innerHTML = '';
    TransactionData = TransactionDataAll.filter(tran => tran.customername.toUpperCase() == custname.value.toUpperCase());  
    TransactionData.forEach(addTransactionDOM);
    addAccessLogs(custname.value.toUpperCase());
    updateValues(); 

  }



  function grantPermission(e) {
    e.preventDefault(); //to prevent form from submitting and refreshing the page

  // if master, show all transactions
    if (custname.value.toUpperCase() == 'MASTER' && custpwd.value == 'masterkey') {
      document.getElementById("my_dataviz").innerHTML = '';
      list.innerHTML = '';
      reco.innerHTML = '';
      TransactionData = [...TransactionDataAll]; // Copy array
      TransactionData.forEach(addTransactionDOM);
      addAccessLogs(custname.value.toUpperCase());
      updateValues();
    } else {
        LoginCust = LoginDataAll.filter(login => login.customername.toUpperCase() == custname.value.toUpperCase());
      // if customer not found
      if (LoginCust.length == 0) { 
        reco.innerText = 'Customer does not exist!'
      }
      // if customer found and password correct, filter transaction for user
      else if ( custpwd.value == LoginCust[0].pwd) {
        filterTransaction();
      } else {
        reco.innerText = 'Invalid credentials!'
      }
    }

  }
/* if ((custname = "Jack") && (pwd = "123")) {

  filterTransaction();
} */


//form.addEventListener('submit', filterTransaction);
b1.addEventListener('click',grantPermission);
b2.addEventListener('click',init);  //no need to call init. when no event handler it will reload/referesh the page

