const express = require('express');
const sql = require('mssql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json()); // Add to parse JSON bodies

// SQL Server configuration
const config = {
  user: 'sa',
  password: 'Hifza',
  server: 'localhost',
  database: 'Task',
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
      const result = await pool.request().query('SELECT * FROM login_info');
      res.json(result.recordset); // Send data back to React
    } catch (err) {
      console.error('Query Error: ', err);
      res.status(500).send(err.message);
    }
  });

  // API to handle login
  app.post('/login', async (req, res) => {
    const { login_name, password, selected_employee } = req.body;
    try {
      const result = await pool.request()
        .input('login_name', sql.VarChar, login_name)
        .input('password', sql.VarChar, password)
        .input('selected_employee', sql.VarChar, selected_employee)
        .query('SELECT * FROM login_info WHERE login_name = @login_name AND password = @password AND emp_name = @selected_employee');

      if (result.recordset.length > 0) {
        // Update current_login to 'yes'
        await pool.request()
          .input('login_name', sql.VarChar, login_name)
          .query('UPDATE login_info SET current_login = 1 WHERE login_name = @login_name');
        res.json({ success: true });
      } else {
        res.json({ success: false, message: 'Invalid username, password' });
      }
    } catch (err) {
      console.error('Login Query Error: ', err);
      res.status(500).send(err.message);
    }
  });
 
  // API to fetch invoice numbers
  app.get('/invoice', async (req, res) => {
    try {
      const result = await pool.request().query('SELECT invoice_number FROM invoice_master');
      res.json(result.recordset);
    } catch (err) {
      console.error('Query Error: ', err);
      res.status(500).send(err.message);
    }
  });

  // API to fetch salesmen (from employee_info)
  app.get('/salesmen', async (req, res) => {
    try {
      const result = await pool.request().query('SELECT emp_name FROM employee_info');
      res.json(result.recordset);
    } catch (err) {
      console.error('Query Error: ', err);
      res.status(500).send(err.message);
    }
  });

  // API to fetch customers
  app.get('/customers', async (req, res) => {
    try {
      const result = await pool.request().query('SELECT cust_name FROM customer_info');
      res.json(result.recordset);
    } catch (err) {
      console.error('Query Error: ', err);
      res.status(500).send(err.message);
    }
  });

  // API to fetch item names (from item_description)
  app.get('/items', async (req, res) => {
    try {
      const result = await pool.request().query('SELECT product_desc FROM item_description');
      res.json(result.recordset);
    } catch (err) {
      console.error('Query Error: ', err);
      res.status(500).send(err.message);
    }
  });
// API to save invoice details
app.post('/invoice/save', async (req, res) => {
    const invoiceDetails = req.body; // Data sent from the React app
    const transaction = new sql.Transaction(); // Start a transaction
  
    try {
      await transaction.begin(); // Begin the transaction
  
      const requests = invoiceDetails.map((detail) => {
        return transaction.request()
          .input('inv_code', sql.Decimal, detail.inv_code)
          .input('status', sql.Int, detail.status)
          .input('wk_no', sql.Int, detail.wk_no)
          .input('branch_id', sql.VarChar, detail.branch_id)
          .input('s_no', sql.Int, detail.s_no)
          .input('product_code', sql.VarChar, detail.product_code) // Add product_code if available
          .input('product_name', sql.VarChar, detail.product_name)
          .input('rate', sql.Decimal, detail.rate)
          .input('discount', sql.Decimal, detail.discount)
          .input('qty', sql.Decimal, detail.qty)
          .input('case_qty', sql.Decimal, detail.case_qty)
          .input('remarks', sql.VarChar, detail.remarks)
          .input('tax_amount', sql.Decimal, detail.tax_amount)
          .input('tax_ACC', sql.Decimal, detail.tax_ACC)
          .input('i_retail', sql.Decimal, detail.i_retail)
          .input('i_cost', sql.Decimal, detail.i_cost)
          .input('imei_no', sql.VarChar, detail.imei_no)
          .input('uom', sql.VarChar, detail.uom)
          .input('Qt_no', sql.Decimal, detail.Qt_no)
          .input('Qt_branch', sql.VarChar, detail.Qt_branch)
          .input('tax_perc', sql.Decimal, detail.tax_perc)
          .input('dmg_status', sql.Int, detail.dmg_status)
          .input('dmg_set', sql.Decimal, detail.dmg_set)
          .input('clear_set', sql.Decimal, detail.clear_set)
          .query(`INSERT INTO invoice_detail (inv_code, status, wk_no, branch_id, s_no, product_code, product_name, rate, discount, qty, case_qty, remarks, tax_amount, tax_ACC, i_retail, i_cost, imei_no, uom, Qt_no, Qt_branch, tax_perc, dmg_status, dmg_set, clear_set) VALUES (@inv_code, @status, @wk_no, @branch_id, @s_no, @product_code, @product_name, @rate, @discount, @qty, @case_qty, @remarks, @tax_amount, @tax_ACC, @i_retail, @i_cost, @imei_no, @uom, @Qt_no, @Qt_branch, @tax_perc, @dmg_status, @dmg_set, @clear_set)`);
      });
  
      await Promise.all(requests); // Wait for all insertions to complete
      await transaction.commit(); // Commit the transaction
      res.status(200).json({ message: 'Invoice details saved successfully' });
    } catch (err) {
      await transaction.rollback(); // Rollback the transaction in case of an error
      console.error('Error saving invoice details:', err);
      res.status(500).json({ error: 'Error saving invoice details' });
    }
  });
  
  // Start the server
  app.listen(3001, () => {
    console.log('Backend server is running on port 3001');
  });
}).catch((err) => {
  console.error('SQL Connection Error: ', err);
});
