import React, { useState, useEffect } from 'react';
import './App.css';
import ExpenseList from './components/ExpenseList';
import Alert from './components/Alert';
import ExpenseForm from './components/ExpenseForm';
import uuid  from 'uuid/v4'


// const initialExpenses = [
//   {id:uuid(), charge:"rent", amount:1000},
//   {id:uuid(), charge:"car payment", amount:400},
//   {id:uuid(), charge:"Credit card bill", amount:1200}
// ];

const initialExpenses= localStorage.getItem('expenses')? JSON.parse(localStorage.getItem("expenses")) : [];

function App() {
  const [expenses, setExpenses] = useState(initialExpenses)

  const [charge, setCharge] = useState("")


  const [amount, setAmount] = useState("")

  const [alert, setAlert] = useState({show:false})

  const [edit, setEdit] = useState(false)

  const [id, setId] = useState(0)

  useEffect(() => {
    // console.log("use effect")
    localStorage.setItem('expenses', JSON.stringify(expenses))
  }, [expenses])

  const handleCharge = e => {
    setCharge(e.target.value)
  }

  const handleAmount = e => {
    setAmount(e.target.value)
  }

  const handleAlert = ({type, text}) => {
    setAlert ({show: true, type, text});
    setTimeout(() => {
      setAlert({show:false})
    },3000)
  }

  const handleSubmit = e => {
    e.preventDefault()
    if(charge!== '' && amount > 0){
      if(edit){
          let tempExpenses = expenses.map(item => {
            return item.id === id? {...item, charge, amount}  : item
          })
          setExpenses(tempExpenses)
          setEdit(false)
          handleAlert({type: "success", text:"Item Modified"})
      }else {
        const singleExpenses = {id:uuid(), charge, amount};
        setExpenses([...expenses,singleExpenses])
        handleAlert({type:"success", text:"successfully added"})
      }
     
      setCharge("")
      setAmount("")
      
    }else {
      handleAlert({type:"danger", text:"charge cannot be empty value and amount value has to be bigger than zero"})
    }
  }

  const clearItems = () => {
    setExpenses([])
    handleAlert({type:"danger", text:"All Item deleted"})
  }

  const handleDelete = (id) => {
    let tempExpenses = expenses.filter(item => item.id !== id)
    setExpenses(tempExpenses)
    handleAlert({type:"danger", text:"Item Deleted"})
  }

  const handleEdit = (id) => {
    let expense = expenses.find(item => item.id === id)
    let {charge, amount} = expense
    setCharge(charge)
    setAmount(amount)
    setEdit(true)
    setId(id)
  }
  
  return (
   <div>
     {alert.show && <Alert type={alert.type} text={alert.text} />}
     {/* <Alert /> */}
        <h1>budget calculator</h1>
        <main className="App">
          <ExpenseForm 
            charge={charge} 
            amount={amount} 
            handleAmount={handleAmount} 
            handleCharge={handleCharge} 
            handleSubmit={handleSubmit}
            edit={edit}
            />
          <ExpenseList 
            expenses={expenses} 
            handleDelete={handleDelete} 
            handleEdit={handleEdit} 
            clearItems={clearItems}
          />
     </main>
     <h1>
       Total Spending : <span className="total">
          $ {expenses.reduce((acc, curr) => {
              return (acc += parseInt(curr.amount))
          },0)}
          
       </span>
     </h1>
   </div>
  );
}

export default App;
