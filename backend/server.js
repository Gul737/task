const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
app.use(cookieParser());
app.use(cors());
app.use(express.json()); // Add to parse JSON bodies
app.use(bodyParser.json());
 let branch_G;
// SQL Server configuration
const config = {
  user: 'sa',
  password: 'Hifza',
  server: 'localhost',
  database: 'hafiz_db',
  options: {
    encrypt: false, // Disable encryption for local databases
  }
};

// Connect to SQL Server
sql.connect(config).then((pool) => {
  if (pool.connected) {
    console.log('Connected to SQL Server');
  }
  // API to fetch employee names
  app.get('/login_info', async (req, res) => {
    try {
      const result = await pool.request().query('SELECT * FROM login_info, employee_info WHERE login_info.emp_code = employee_info.emp_code;');
      res.json(result.recordset); // Send data back to React
    } catch (err) {
      console.error('Query Error: ', err);
      res.status(500).send(err.message);
    }
  });

  // API to handle login
  app.post('/login', async (req, res) => {
    console.log(req.body); 
    // const { login_name, password,branchCode} = req.body;
    const { login_name, password,branch_id} = req.body;
    try {
      console.log('Executing login query...');

      const result = await pool.request()
        .input('login_name', sql.VarChar, login_name)
        .input('password', sql.VarChar, password)
  .input('branch_id',sql.VarChar,branch_id)
        // .query('SELECT * FROM login_info WHERE login_name = @login_name AND password = @password' );
        .query(`
  SELECT * 
  FROM login_info, employee_info 
  WHERE login_info.emp_code = employee_info.emp_code
    AND login_info.login_name = @login_name
    AND login_info.password = @password
    AND employee_info.branch_id = @branch_id
`);
        console.log('Query executed successfully:', result); // Log result
      if (result.recordset.length > 0) {
        // Update current_login to 'yes'
        await pool.request()
          .input('login_name', sql.VarChar, login_name)
          .query('UPDATE login_info SET current_login = 1 WHERE login_name = @login_name');
        res.json({ success: true });
      } else {
        res.json({ success: false, message: 'Invalid username, password , branch name' });
      }
    } catch (err) {
      console.error('Login Query Error: ', err);
      res.status(500).send(err.message);
    }
  });
app.get('/set', (req, res) => {
  const branchCode = req.cookies.branchCode;
   branch_G=branchCode;
  if (!branchCode) {
      return res.status(400).send('Branch Code not found');
  }

  console.log("Branch Code is received on server side:", branchCode);
});


app.post('/invoice', async (req, res) => {
  try { 
    const result = await pool.request()
    .input('branch_id', sql.VarChar, branch_G)
    .query("SELECT MAX(inv_no) AS inv FROM invoice_master WHERE status = 2 and wk_no=1 and branch_id = @branch_id");

    console.log('SQL Query Result:', result.recordset);
    let newInvoiceNumber = (result.recordset[0]?.inv === null) ? 1 : result.recordset[0].inv + 1;

    res.json({ invoice_number: newInvoiceNumber });
    console.log(newInvoiceNumber);
  } catch (err) {
    console.error('Query Error: ', err);
    res.status(500).json({ error: err.message });
  }
});
app.get('/branch_info', async (req, res) => {
  try {
      // Connect to the database
      const pool = await sql.connect(config);
      
      // Query to fetch branch codes
      const result = await pool.request().query('SELECT branch_name, branch_code FROM branch_info');
      
      // Send data back to React
      res.json(result.recordset); 
  } catch (err) {
      console.error('Query Error: ', err);
      res.status(500).send(err.message);
  } finally {
      // await sql.close(); // Close the database connection
  }
});
// // API to fetch salesmen (from employee_info)
    app.get('/salesmen', async (req, res) => {
     try {
      const result = await pool.request()
  .input('branch_id', sql.VarChar, branch_G)
  .query("SELECT emp_name,emp_code FROM employee_info WHERE branch_id = @branch_id");
              console.log("Salesmen Field Done: " + JSON.stringify(result.recordset, null, 2));

   res.json(result.recordset);
     } catch (err) {
       console.error('Query Error: ', err);
       res.status(500).send(err.message);
     }
   });
   app.get('/bank', async (req, res) => {
    try {
     const result = await pool.request()
 .input('branch_id', sql.VarChar, branch_G)
 .query("select *from accounts_master where account_type='901' and  branch_id = @branch_id");
             console.log("Bank Field Done: " + JSON.stringify(result.recordset, null, 2));

  res.json(result.recordset);
    } catch (err) {
      console.error('Query Error: ', err);
      res.status(500).send(err.message);
    }
  });

// API to fetch customers
    app.get('/customers', async (req, res) => {
   try {
    const result = await pool.request()
    .input('branch_id', sql.VarChar, branch_G)
    .query("SELECT cust_name,cust_code,cust_current_bal FROM customer_info where cust_active=1 and branch_id = @branch_id");
      console.log("customer Field Set"+ JSON.stringify(result.recordset, null, 2));
       res.json(result.recordset);
     } catch (err) {
       console.error('Query Error: ', err);
       res.status(500).send(err.message);
     }
   });
app.get('/customers/balance', async (req, res) => { 
  const customerCode = req.query.cust_code; // Get customer code from query parameters
  
  if (!customerCode) {
    return res.status(400).json({ message: 'Customer code is required' });
  }

  try {
    // SQL query to fetch the customer balance and terms based on cust_code
    const result = await sql.query`SELECT cust_current_bal, cust_terms FROM customer_info WHERE cust_code = ${customerCode}`;
    
    if (result.recordset.length > 0) {
      const { cust_current_bal, cust_terms } = result.recordset[0];
      res.json({ balance: cust_current_bal, terms: cust_terms }); // Return both balance and terms
    } else {
      res.status(404).json({ message: 'Customer not found' });
    }
  } catch (error) {
    console.error('Error fetching customer balance:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
// Endpoint to get item descriptions
app.get('/item_descriptions', async (req, res) => {
  try {
      // Connect to the database
      const result = await pool.request()
          .query("SELECT product_code, product_desc, case_qty, cost, item_disc,retail FROM item_description WHERE active=1;");

      // Return the data as JSON
      res.json(result.recordset);
  } catch (err) {
      console.error('SQL error', err);
      res.status(500).send('Error retrieving item descriptions');
  } 
});
app.post('/save-invoice', async (req, res) => {
  const {
    inv_no, status, branch_id, wk_no, inv_type, cust_code, cust_name, prv_balance, inv_date, g_amount, inv_datetime,
    g_discount, cash_amount, cust_remarks, cust_ref, freight_account, freight_amount, 
    exp_amount, exp_account, salesman_code, salesman_name, tax_account, tax_amount, 
    Cash_Credit_ACC, credit_card_amount, Credit_Card_ACC, inv_ref, bank_amount, bank_no, 
    bank_name, bank_cash_amount, ship_address_to, cattons_qty, cargo_name, cargo_code, 
    ship_no, bilty_no, bilty_date, Qt_no, sms, sale_branch
  } = req.body;

  try {
    // Insert query into invoice_master table
    const result = await pool.request()
      .input('inv_no',sql.Decimal(18, 0), inv_no)
      .input('branch_id', sql.VarChar(50), branch_G)
      
      // .input('cust_code', sql.Decimal(18, 0), cust_code)
      .input('cust_name', sql.VarChar(250), cust_name)
      .input('cust_code', sql.Decimal(18, 0), cust_code)
      .input('salesman_name', sql.VarChar(250), salesman_name)
      .input('salesman_code', sql.Decimal(18, 0), salesman_code)
      .input('prv_balance', sql.Decimal(18, 2), prv_balance)
      .input('inv_date', sql.DateTime, inv_date)
      .input('g_amount', sql.Decimal(18, 2), g_amount)
      .input('g_discount', sql.Decimal(18, 2), g_discount)
      .input('bank_amount', sql.Decimal(18, 2), bank_amount)
      .input('cash_amount', sql.Decimal(18, 2), cash_amount)
      .input('inv_datetime',sql.DateTime,inv_datetime)
      .input('inv_type',sql.Int,inv_type)
      .query(`
        INSERT INTO invoice_master (inv_no, status, branch_id, wk_no, salesman_code,salesman_name,cust_code,cust_name, prv_balance, inv_date,inv_datetime,bank_amount,cash_amount,inv_type,g_amount, g_discount)
        VALUES (@inv_no, 2, @branch_id, 1,@salesman_code,@salesman_name,@cust_code, @cust_name, @prv_balance, @inv_date, @inv_datetime,@bank_amount,@cash_amount,@inv_type,@g_amount,@g_discount)
      `);

    res.json({ success: true, message: 'Invoice saved successfully.' });
  } catch (err) {
    console.error('Insert Query Error:', err);
    res.status(500).json({ success: false, message: 'Error saving invoice.' });
  }
});


  // Start the server
  app.listen(3001, () => {
    console.log('Backend server is running on port 3001');
  });
}).catch((err) => {
  console.error('SQL Connection Error: ', err);
});
