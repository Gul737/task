const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
app.use(cookieParser());
app.use(cors());
//app.use(express.json());
app.use(express.json({ limit: '50mb' })); 
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
    //console.log(req.body); 
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
        console.log('login Query executed successfully'); // Log result
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

  //console.log("Branch Code is received on server side:", branchCode);
});


app.post('/invoice', async (req, res) => {
  try { 
    const result = await pool.request()
    .input('branch_id', sql.VarChar, branch_G)
    .query("SELECT MAX(inv_no) AS inv FROM invoice_master WHERE status = 2 and wk_no=1 and branch_id = @branch_id");

    //console.log('SQL Query Result:', result.recordset);
    let newInvoiceNumber = (result.recordset[0]?.inv === null) ? 1 : result.recordset[0].inv + 1;

    res.json({ invoice_number: newInvoiceNumber });
    //console.log(newInvoiceNumber);
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
            //  console.log("Salesmen Field Done: " + JSON.stringify(result.recordset, null, 2));

   res.json(result.recordset);
     } catch (err) {
       console.error('Query Error: ', err);
       res.status(500).send(err.message);
     }
   });
   app.get('/salesmenByBranch', async (req, res) => {
    const { branch_code } = req.query; // Get branch_code from query params
    try {
      const pool = await sql.connect(config);
      const result = await pool.request()
        .input('branch_code', sql.VarChar, branch_code) // Pass branch_code to the query
        .query('SELECT emp_code, emp_name FROM employee_info WHERE branch_id = @branch_code'); // Filter by branch_code
      
      res.json(result.recordset); // Return filtered data
    } catch (err) {
      console.error('Query Error:', err);
      res.status(500).send(err.message);
    }
  });
  
//    app.get('/bank', async (req, res) => {
//     try {
//      const result = await pool.request()
//  .input('branch_id', sql.VarChar, branch_G)
//  .query("select *from accounts_master where account_type='901' and  branch_id = @branch_id");
//              console.log("Bank Field Done: " + JSON.stringify(result.recordset, null, 2));

//   res.json(result.recordset);
//     } catch (err) {
//       console.error('Query Error: ', err);
//       res.status(500).send(err.message);
//     }
//   });

// API to fetch customers
    app.get('/customers', async (req, res) => {
   try {
    const result = await pool.request()
    .input('branch_id', sql.VarChar, branch_G)
    .query("SELECT cust_name,cust_code,cust_current_bal, cust_terms FROM customer_info where cust_active=1 and branch_id = @branch_id");
      //console.log("customer Field Set"+ JSON.stringify(result.recordset, null, 2));
       res.json(result.recordset);
     } catch (err) {
       console.error('Query Error: ', err);
       res.status(500).send(err.message);
     }
   });
// app.get('/customers/balance', async (req, res) => { 
//   const customerCode = req.query.cust_code; // Get customer code from query parameters
  
//   if (!customerCode) {
//     return res.status(400).json({ message: 'Customer code is required' });
//   }

//   try {
//     // SQL query to fetch the customer balance and terms based on cust_code
//     const result = await sql.query`SELECT cust_current_bal, cust_terms FROM customer_info WHERE cust_code = ${customerCode}`;
    
//     if (result.recordset.length > 0) {
//       const { cust_current_bal, cust_terms } = result.recordset[0];
//       res.json({ balance: cust_current_bal, terms: cust_terms }); // Return both balance and terms
//     } else {
//       res.status(404).json({ message: 'Customer not found' });
//     }
//   } catch (error) {
//     console.error('Error fetching customer balance:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });
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
    g_discount, cash_amount, bank_amount, bank_cash_amount, salesman_code, salesman_name, bank_name,cust_ref,
    // Additional fields for invoice_details table
    inv_code, s_no, product_code, product_name, rate, discount, qty, case_qty, remarks, tax_amount, tax_ACC,
    i_retail, i_cost, imei_no, uom, Qt_no, Qt_branch, tax_perc, dmg_status, dmg_set, clear_set,items
  } = req.body;

  try {
    const transaction = new sql.Transaction(pool);
    await transaction.begin();

    // Insert into invoice_master table
    const requestMaster = new sql.Request(transaction);
    await requestMaster
    
    .input('inv_no',sql.Decimal(18, 0), inv_no)
      .input('branch_id', sql.VarChar(50), branch_G)
      .input('cust_ref', sql.VarChar(250),cust_ref)
      // .input('cust_code', sql.Decimal(18, 0), cust_code)
      .input('cust_name', sql.VarChar(250), cust_name)
      .input('cust_code', sql.Decimal(18, 0), cust_code)
      .input('salesman_name', sql.VarChar(250), salesman_name)
      .input('bank_name', sql.VarChar(250), bank_name)
      .input('salesman_code', sql.Decimal(18, 0), salesman_code)
      .input('prv_balance', sql.Decimal(18, 2), prv_balance)
      .input('inv_date', sql.DateTime, inv_date)
      .input('g_amount', sql.Decimal(18, 2), g_amount)
      .input('g_discount', sql.Decimal(18, 2), g_discount)
      .input('bank_amount', sql.Decimal(18, 2), bank_amount)
      .input('cash_amount', sql.Decimal(18, 2), cash_amount)
      .input('bank_cash_amount', sql.Decimal(18, 2),bank_cash_amount)

      .input('inv_datetime',sql.DateTime,inv_datetime)
      .input('inv_type',sql.Int,inv_type) 
      .query(`
        INSERT INTO invoice_master (inv_no, status, branch_id, wk_no, salesman_code,salesman_name,cust_code,cust_name, prv_balance, inv_date,inv_datetime,bank_amount,cash_amount,inv_type,g_amount, g_discount,bank_name,bank_cash_amount,cust_ref)
        VALUES (@inv_no, 2, @branch_id, 1,@salesman_code,@salesman_name,@cust_code, @cust_name, @prv_balance, @inv_date, @inv_datetime,@bank_amount,@cash_amount,@inv_type,@g_amount,@g_discount,@bank_name,@bank_cash_amount,@cust_ref)
      `);
      
    // const requestDetails = new sql.Request(transaction);
    // await requestDetails
    //   .input('inv_code', sql.Decimal(18, 0), inv_code)
    //   .input('branch_id', sql.VarChar(50), branch_G)
    //   .input('s_no', sql.Int, s_no)
      
      //.input('product_code', sql.Decimal(18, 0), product_code)
      //.input('product_name', sql.VarChar(500), product_name)
      //.input('rate', sql.Decimal(18, 2), rate)
      //.input('discount', sql.Decimal(18, 2), discount)
      //.input('qty', sql.Decimal(18, 3), qty)
      //.input('case_qty', sql.Decimal(18, 0), case_qty)
  
      // .input('i_retail', sql.Decimal(18, 2), i_retail)
      // .input('i_cost', sql.Decimal(18, 2), i_cost)
      // .query(`
      //   INSERT INTO invoice_details (inv_code, status, wk_no, branch_id, s_no, product_code, product_name, rate, discount, qty, case_qty, i_retail, i_cost)
      //   VALUES (@inv_code, 2, 1, @branch_id, @s_no, @product_code, @product_name, @rate, @discount, @qty, @case_qty, @i_retail, @i_cost)
      // `);
      // .query(`
      //   INSERT INTO invoice_detail (inv_code, status, wk_no, branch_id, s_no)
      //   VALUES (@inv_code, 2, 1, @branch_id,  @s_no)
      // `);
// Insert each item into `invoice_detail`
for (let i = 0; i < items.length; i++) {
  const item = items[i];

  const requestDetails = new sql.Request(transaction);
  await requestDetails
    .input('inv_code', sql.Decimal(18, 0), inv_code) // Assuming `inv_no` serves as `inv_code`
    .input('branch_id', sql.VarChar(50), branch_G)
    .input('s_no', sql.Int, i + 1) // Auto-incrementing serial number
    .input('product_code', sql.Decimal(18, 2), item.product_code)
    .input('product_name', sql.VarChar(500), item.product_name)
    .input('rate', sql.Decimal(18, 2), item.rate)
    .input('discount', sql.Decimal(18, 2), item.discount)
    .input('qty', sql.Decimal(18, 3), item.qty)
    .input('case_qty', sql.Decimal(18, 0), item.case_qty || 1) // Optional field
    .input('i_retail', sql.Decimal(18, 2), item.i_retail)
    .input('i_cost', sql.Decimal(18, 2), item.i_cost)
    .query(`
      INSERT INTO invoice_detail (inv_code, status, wk_no, branch_id, s_no, product_code, product_name, rate, discount, qty, case_qty, i_retail, i_cost)
      VALUES (@inv_code, 2, 1, @branch_id, @s_no, @product_code, @product_name, @rate, @discount, @qty, @case_qty, @i_retail, @i_cost)
    `);
}
    await transaction.commit();

    res.json({ success: true, message: 'Invoice and details saved successfully.' });
  } catch (err) {
    console.error('Insert Query Error:', err);
    res.status(500).json({ success: false, message: 'Error saving invoice and details.' });
  }
  // const {
  //   inv_no, status, branch_id, wk_no, inv_type, cust_code, cust_name, prv_balance, inv_date, g_amount, inv_datetime,
  //   g_discount, cash_amount, cust_remarks, cust_ref, freight_account, freight_amount, 
  //   exp_amount, exp_account, salesman_code, salesman_name, tax_account, tax_amount, 
  //   Cash_Credit_ACC, credit_card_amount, Credit_Card_ACC, inv_ref, bank_amount, bank_no, 
  //   bank_name, bank_cash_amount, ship_address_to, cattons_qty, cargo_name, cargo_code, 
  //   ship_no, bilty_no, bilty_date, Qt_no, sms, sale_branch
  // } = req.body;

  // try {
  //   // Insert query into invoice_master table
  //   const result = await pool.request()
  //     .input('inv_no',sql.Decimal(18, 0), inv_no)
  //     .input('branch_id', sql.VarChar(50), branch_G)
      
  //     // .input('cust_code', sql.Decimal(18, 0), cust_code)
  //     .input('cust_name', sql.VarChar(250), cust_name)
  //     .input('cust_code', sql.Decimal(18, 0), cust_code)
  //     .input('salesman_name', sql.VarChar(250), salesman_name)
  //     .input('bank_name', sql.VarChar(250), bank_name)
  //     .input('salesman_code', sql.Decimal(18, 0), salesman_code)
  //     .input('prv_balance', sql.Decimal(18, 2), prv_balance)
  //     .input('inv_date', sql.DateTime, inv_date)
  //     .input('g_amount', sql.Decimal(18, 2), g_amount)
  //     .input('g_discount', sql.Decimal(18, 2), g_discount)
  //     .input('bank_amount', sql.Decimal(18, 2), bank_amount)
  //     .input('cash_amount', sql.Decimal(18, 2), cash_amount)
  //     .input('bank_cash_amount', sql.Decimal(18, 2),bank_cash_amount)

  //     .input('inv_datetime',sql.DateTime,inv_datetime)
  //     .input('inv_type',sql.Int,inv_type)
  //     .query(`
  //       INSERT INTO invoice_master (inv_no, status, branch_id, wk_no, salesman_code,salesman_name,cust_code,cust_name, prv_balance, inv_date,inv_datetime,bank_amount,cash_amount,inv_type,g_amount, g_discount,bank_name,bank_cash_amount)
  //       VALUES (@inv_no, 2, @branch_id, 1,@salesman_code,@salesman_name,@cust_code, @cust_name, @prv_balance, @inv_date, @inv_datetime,@bank_amount,@cash_amount,@inv_type,@g_amount,@g_discount,@bank_name,@bank_cash_amount)
  //     `);

  //   res.json({ success: true, message: 'Invoice saved successfully.' });
  // } catch (err) {
  //   console.error('Insert Query Error:', err);
  //   res.status(500).json({ success: false, message: 'Error saving invoice.' });
  // }
});

app.post('/get-previous-invoice', async (req, res) => {
  const { inv_no } = req.body;

  try {
    const result = await pool.request()
      .input('inv_no', sql.Decimal(18, 0), inv_no)
      .query(`
    SELECT 
    invoice_master.*,   
    invoice_detail.*   
FROM 
    invoice_master
JOIN 
    invoice_detail ON invoice_master.inv_no = invoice_detail.inv_code
WHERE 
 invoice_master.inv_no = (
            SELECT MAX(inv_no)
            FROM invoice_master
            WHERE inv_no < @inv_no
          );
    

        
      `);

    if (result.recordset.length > 0) {
      res.json({ success: true, invoice: result.recordset });
    } else {
      res.json({ success: false, message: 'No previous invoice found.' });
    }
  } catch (err) {
    console.error('Error fetching previous invoice:', err);
    res.status(500).json({ success: false, message: 'Error fetching previous invoice.' });
  }
});
app.post('/get-next-invoice', async (req, res) => {
  const { inv_no } = req.body;

  try {
    const result = await pool.request()
      .input('inv_no', sql.Decimal(18, 0), inv_no)
      .query(`
        SELECT 
          invoice_master.*,   
          invoice_detail.*   
        FROM 
          invoice_master
        JOIN 
          invoice_detail ON invoice_master.inv_no = invoice_detail.inv_code
        WHERE 
          invoice_master.inv_no = (
            SELECT MIN(inv_no)
            FROM invoice_master
            WHERE inv_no > @inv_no
          );
      `);

    if (result.recordset.length > 0) {
      res.json({ success: true, invoice: result.recordset });
    } else {
      res.json({ success: false, message: 'No next invoice found.' });
    }
  } catch (err) {
    console.error('Error fetching next invoice:', err);
    res.status(500).json({ success: false, message: 'Error fetching next invoice.' });
  }
});
app.post('/modify-invoice', async (req, res) => {
  const {
    inv_no, status, branch_id, wk_no, inv_type, cust_code, cust_name, prv_balance, inv_date, g_amount, inv_datetime,
    g_discount, cash_amount, bank_amount, bank_cash_amount, salesman_code, salesman_name, bank_name, cust_ref,
    inv_code, s_no, product_code, product_name, rate, discount, qty, case_qty, remarks, tax_amount, tax_ACC,
    i_retail, i_cost, imei_no, uom, Qt_no, Qt_branch, tax_perc, dmg_status, dmg_set, clear_set, items
  } = req.body;

  try {
    const transaction = new sql.Transaction(pool);
    await transaction.begin();

    // Fetch existing `invoice_master` and check for changes
    const requestMaster = new sql.Request(transaction);
    const existingInvoice = await requestMaster
      .input('inv_no', sql.Decimal(18, 0), inv_no)
      .query(`SELECT * FROM invoice_master WHERE inv_no = @inv_no`);

    if (existingInvoice.recordset.length > 0) {
      const existingRecord = existingInvoice.recordset[0];
      const fieldsToUpdate = [
        'salesman_name', 'cust_ref', 'cust_name', 'prv_balance', 'g_amount', 'g_discount',
        'cash_amount', 'bank_amount', 'bank_cash_amount'
      ];

      // Check and update fields only if they have changed
      const updatedFields = fieldsToUpdate.filter(field => existingRecord[field] !== req.body[field]);
      if (updatedFields.length > 0) {
        await requestMaster
          .input('salesman_name', sql.VarChar(250), salesman_name)
          .input('cust_ref', sql.VarChar(250), cust_ref)
          .input('cust_name', sql.VarChar(250), cust_name)
          .input('prv_balance', sql.Decimal(18, 2), prv_balance)
          .input('g_amount', sql.Decimal(18, 2), g_amount)
          .input('g_discount', sql.Decimal(18, 2), g_discount)
          .input('cash_amount', sql.Decimal(18, 2), cash_amount)
          .input('bank_amount', sql.Decimal(18, 2), bank_amount)
          .input('bank_cash_amount', sql.Decimal(18, 2), bank_cash_amount)
          .query(`
            UPDATE invoice_master
            SET salesman_name = @salesman_name, cust_ref = @cust_ref, cust_name = @cust_name,
                prv_balance = @prv_balance, g_amount = @g_amount, g_discount = @g_discount,
                cash_amount = @cash_amount, bank_amount = @bank_amount, bank_cash_amount = @bank_cash_amount
            WHERE inv_no = @inv_no
          `);
      }
    }

    // Fetch existing items for the given `inv_no`
    const requestDetail = new sql.Request(transaction);
    const existingItems = await requestDetail
      .input('inv_no', sql.Decimal(18, 0), inv_no)
      .query(`SELECT * FROM invoice_detail WHERE inv_code = @inv_no`);

    const existingItemsMap = new Map();
    existingItems.recordset.forEach(item => {
      existingItemsMap.set(item.product_code, item);
    });

    const sNoResult = await requestDetail.query(`SELECT ISNULL(MAX(s_no), 0) AS max_s_no FROM invoice_detail WHERE inv_code = @inv_no`);
    let s_no = sNoResult.recordset[0].max_s_no;

    // Compare incoming items with existing items and update accordingly
    for (const item of items) {
      if (existingItemsMap.has(item.product_code)) {
        const existingItem = existingItemsMap.get(item.product_code);
     
        const itemToUpdate = [
          'qty', 'rate', 'discount', 'product_name', 'i_retail', 'i_cost'
        ];

        // Check if there are differences in the fields
        const hasChanges = itemToUpdate.some(field => existingItem[field] !== item[field]);

        if (hasChanges) {
          await requestDetail
            .input('inv_code', sql.Decimal(18, 0), inv_code)
            .input('product_code', sql.Decimal(18, 0), item.product_code)
            .input('product_name', sql.VarChar(500), item.product_name)
            .input('qty', sql.Decimal(18, 3), item.qty)
            .input('rate', sql.Decimal(18, 2), item.rate)
            .input('discount', sql.Decimal(18, 2), item.discount)
            .input('i_retail', sql.Decimal(18, 2), item.i_retail)
            .input('i_cost', sql.Decimal(18, 2), item.i_cost)
            .input('case_qty', sql.Decimal(18, 0), item.case_qty || 1) // Optional field
          
            .query(`
              UPDATE invoice_detail
              SET product_name = @product_name, qty = @qty, rate = @rate, discount = @discount,
                  i_retail = @i_retail, i_cost = @i_cost,case_qty=1
              WHERE inv_code = @inv_code AND product_code = @product_code
            `);
        }
        existingItemsMap.delete(item.product_code); // Mark as processed
      } else {
        // Insert new item
        s_no++;
        await requestDetail
        // .input('inv_code', sql.Decimal(18, 0), inv_code)
        .input('inv_coded', sql.Decimal(18, 0), inv_code)
          .input('branch_id', sql.VarChar(50), branch_G)
          .input('product_coded', sql.Decimal(18, 0), item.product_code)
          .input('product_name', sql.VarChar(500), item.product_name)
          .input('qty', sql.Decimal(18, 3), item.qty)
          .input('rate', sql.Decimal(18, 2), item.rate)
          .input('discount', sql.Decimal(18, 2), item.discount)
          .input('s_no', sql.Int, s_no)
          .input('i_retail', sql.Decimal(18, 2), item.i_retail)
          .input('i_cost', sql.Decimal(18, 2), item.i_cost)
          .input('case_qty', sql.Decimal(18, 0), item.case_qty || 1)
          .query(`
            INSERT INTO invoice_detail (inv_code, branch_id, status, wk_no, product_code, product_name, qty, rate, discount, s_no,i_retail,i_cost,case_qty)
            VALUES (@inv_coded, @branch_id, 2, 1, @product_coded, @product_name, @qty, @rate, @discount, @s_no,@i_retail,@i_cost,1)
          `);
      }
    }
       for (const [product_code, item] of existingItemsMap) {
        await requestDetail.input('delete_inv_code', sql.Decimal(18, 0), inv_code) // Unique parameter for inv_code
        .input('delete_product_code', sql.Decimal(18, 0), product_code) // Unique parameter for product_code
        .query('DELETE FROM invoice_detail WHERE inv_code = @delete_inv_code AND product_code = @delete_product_code');
        // .input('inv_code', sql.Decimal(18, 0), inv_code)
        // .input('product_code', sql.Decimal(18, 0), product_code) // Bind product_code
        // .query('DELETE FROM invoice_detail WHERE inv_code = @inv_code AND product_code = @product_code');
      }
  
    // Commit the transaction
    await transaction.commit();
    res.json({ success: true, message: 'Invoice modified successfully.' });
  } catch (error) {
    console.error('Error modifying invoice:', error);
    res.status(500).json({ success: false, message: 'Error modifying invoice.' });
  }
});
app.get('/max-cust-code', async (req, res) => {
  try {
    const result = await sql.query('SELECT MAX(cust_code) AS max_cust_code FROM customer_info');
    let maxCustCode = result.recordset[0].max_cust_code;

    // Increment maxCustCode by 1 if it exists, otherwise set it to 1
    maxCustCode = maxCustCode ? maxCustCode + 1 : 1;

    res.json({ maxCustCode });
    // res.json({ maxCustCode: result.recordset[0].max_cust_code });
  } catch (error) {
    console.error('Error fetching max cust_code:', error);
    res.status(500).send('Server error');
  }
});
app.get('/api/areas', async (req, res) => {
  const request = new sql.Request();
//request.input('branch_id', sql.VarChar, branch_G); // Pass branch_G as branch_id parameter

// Your SQL query
//const query = `SELECT area_name FROM tbl_area WHERE branch_id = @branch_id`;
const query = `SELECT area_name FROM tbl_area`;

try {
  const result = await request.query(query);
  res.json(result.recordset);
  // const [areas] = await request.query(query);
  // res.json(areas);
} catch (err) {
  console.error('Error executing query:', err);
}
});

// Route to get cities based on branch_id
app.get('/api/cities', async (req, res) => {
  const request = new sql.Request();
//request.input('branch_id', sql.VarChar, branch_G); // Pass branch_G as branch_id parameter

// Your SQL query
// const query = `SELECT city_name FROM tbl_city WHERE branch_id = @branch_id`;
const query = `SELECT city_name FROM tbl_city`;

try {
  // const[cities] = await request.query(query);
  // res.json(cities);
  const result = await request.query(query);
  res.json(result.recordset);
}

    catch (error) {
    console.error('Error fetching cities:', error);
    res.status(500).json({ error: 'Failed to fetch cities' });
  }
});

// Route to get countries based on branch_id
app.get('/api/countries', async (req, res) => {
  
  const request = new sql.Request();
  //request.input('branch_id', sql.VarChar, branch_G); // Pass branch_G as branch_id parameter
  
  // Your SQL query
  // const query = `SELECT country_name FROM tbl_country WHERE branch_id = @branch_id`;
  const query = `SELECT country_name FROM tbl_country`;
  
  try {
    const result = await request.query(query);
    res.json(result.recordset);
    // const [countries] = await request.query(query);
    // res.json(countries);
  }
  catch (error) {
    console.error('Error fetching countries:', error);
    res.status(500).json({ error: 'Failed to fetch countries' });
  }
});

  // Route to insert data into `customer_info`
  app.post('/add-customer', async (req, res) => {
    const {
      cust_code,
      cust_name,
      cust_ph_no,
      cust_mob_no,
      cust_address1,
      cust_address2,
      cust_email,
      cust_cnic,
      cust_area,
      cust_city,
      cust_country,
      remarks,
      cust_type,
      cust_terms,
      cust_disc_per,
      price_level,
      cust_credit_limit,
      cust_credit_days,
      branch_id,
      salesman_code,
      cust_fax,
      cust_cmp_name,
      cust_ntn_no,
      cust_sales_tax_reg,
      cust_current_bal,
      target,
      commission,
      last_inv_type,
      cust_dng_type,
      cust_joining_date,
      master_code,
      search_code

    } = req.body;

    try {
      const request = pool.request();
      
      // Add parameters to the query
      request.input('cust_code', sql.Decimal, cust_code);
      request.input('cust_name', sql.VarChar(50), cust_name);
      request.input('cust_ph_no', sql.VarChar(50), cust_ph_no);
      request.input('cust_mob_no', sql.VarChar(50), cust_mob_no);
      request.input('cust_address1', sql.VarChar(50), cust_address1);
      request.input('cust_address2', sql.VarChar(50), cust_address2);

      request.input('cust_email', sql.VarChar(50), cust_email);
      request.input('cust_cnic', sql.VarChar(50), cust_cnic);
      request.input('cust_area', sql.VarChar(50), cust_area);
      request.input('cust_city', sql.VarChar(50), cust_city);
      request.input('cust_country', sql.VarChar(50), cust_country);
      request.input('remarks', sql.VarChar(50), remarks);
      request.input('cust_type', sql.VarChar(50), cust_type);
      request.input('cust_terms', sql.VarChar(50), cust_terms);
      request.input('cust_disc_per', sql.Decimal, cust_disc_per ||0);
      request.input('price_level', sql.Int, price_level ||0);
      request.input('cust_credit_limit', sql.Decimal,cust_credit_limit||0 );
      request.input('cust_credit_days', sql.Int, cust_credit_days ||0);
      request.input('branch_id', sql.VarChar(50), branch_id);
      request.input('salesman_code', sql.Decimal, salesman_code);
      request.input('cust_fax', sql.VarChar(50), cust_fax);
      request.input('cust_cmp_name', sql.VarChar(50), cust_cmp_name);
      request.input('cust_ntn_no', sql.VarChar(50), cust_ntn_no);
      request.input('cust_sales_tax_reg', sql.VarChar(50), cust_sales_tax_reg);
      request.input('cust_current_bal', sql.Decimal, cust_current_bal);
      request.input('target', sql.Decimal, target);
      request.input('commission', sql.Decimal, commission);
      request.input('last_inv_type', sql.VarChar(50), last_inv_type);
      request.input('cust_dng_type', sql.VarChar(50), cust_dng_type);
      request.input('master_code', sql.Int,master_code);
      request.input('cust_joining_date', sql.DateTime,  cust_joining_date)
      request.input('search_code', sql.VarChar(50),  search_code);
     
      // Execute the query to insert the customer data
      await request.query(`
        INSERT INTO customer_info (
          cust_code, cust_name, cust_ph_no, cust_mob_no, cust_address1, cust_address2, cust_email, cust_cnic, 
          cust_area, cust_city, cust_country, remarks, cust_type, cust_terms, cust_disc_per, price_level, 
          cust_credit_limit, cust_credit_days, branch_id, salesman_code, cust_fax, cust_cmp_name, cust_ntn_no, 
          cust_sales_tax_reg, cust_current_bal, target, commission, last_inv_type, cust_dng_type,master_code,cust_joining_date,search_code
        )
        VALUES (
          @cust_code, @cust_name, @cust_ph_no, @cust_mob_no, @cust_address1, @cust_address2, @cust_email, @cust_cnic, 
          @cust_area, @cust_city, @cust_country, @remarks, @cust_type, @cust_terms, @cust_disc_per, @price_level, 
          @cust_credit_limit, @cust_credit_days, @branch_id, @salesman_code, @cust_fax, @cust_cmp_name, @cust_ntn_no, 
          @cust_sales_tax_reg, @cust_current_bal, @target, @commission, @last_inv_type, @cust_dng_type,401,@cust_joining_date,@search_code
        )
      `);

      res.status(201).send('Customer added successfully');
    } catch (error) {
      console.error('Error adding customer:', error);
      res.status(500).send('Error adding customer');
    }
  });
  app.get('/api/get-max-product-code', async (req, res) => {

    try {
      const result = await pool.request()
  .query("SELECT MAX(product_code) AS maxCode FROM item_description");
  //console.log("fetched pro"+ JSON.stringify(result.recordset, null, 2))
         const maxCode = result.recordset[0].maxCode;
       res.json({ maxCode: maxCode ? maxCode : 0 });
     } catch (err) {
       console.error('Query Error: ', err);
       res.status(500).send(err.message);
     }

  });
  
  // API to fetch bin locations
  app.get('/api/get-bin-locations', async (req, res) => {

    try {
      const result = await pool.request()
  .query("SELECT bin_name FROM item_bin_loc");
  //console.log("fetched bin"+ JSON.stringify(result.recordset, null, 2))
   res.json(result.recordset);
     } catch (err) {
       console.error('Query Error: ', err);
       res.status(500).send(err.message);
     }
  });
  
  // API to fetch categories
  app.get('/api/get-categories', async (req, res) => {
    try {
      const result = await pool.request()
  .query("select category_name,category_code from item_category");
  //console.log("fetched cat"+ JSON.stringify(result.recordset, null, 2))
   res.json(result.recordset);
     } catch (err) {
       console.error('Query Error: ', err);
       res.status(500).send(err.message);
     }
 
  });
  
  // API to fetch item types
  app.get('/api/get-item-types', async (req, res) => {
    try {
      const result = await pool.request()
  .query("select sub_cate_name from item_sub_category");
  //console.log("fetched sub-cat"+ JSON.stringify(result.recordset, null, 2))
   res.json(result.recordset);
     } catch (err) {
       console.error('Query Error: ', err);
       res.status(500).send(err.message);
     }
  });
  
  // API to fetch product groups
  app.get('/api/get-product-groups', async (req, res) => {
    try {
      const result = await pool.request()
  .query("select group_name,group_code from item_group");
  //console.log("fetched grp"+ JSON.stringify(result.recordset, null, 2))
   res.json(result.recordset);
     } catch (err) {
       console.error('Query Error: ', err);
       res.status(500).send(err.message);
     }
  });
  
  // API to fetch units of measure (UOM)
  app.get('/api/get-uoms', async (req, res) => {
    try {
      const result = await pool.request()
  .query("select uom_name from item_uom");
  //console.log("fetched uom"+ JSON.stringify(result.recordset, null, 2))
   res.json(result.recordset);
     } catch (err) {
       console.error('Query Error: ', err);
       res.status(500).send(err.message);
     }
  });
  app.post("/api/save-product", async (req, res) => {
    const { 
      product_code, picture, product_desc, cost, retail, avg_cost, qty_inhand, 
      case_qty, category_code, po_type, sale_tax, min_level, max_level, 
      bin_location, item_disc, branch_id, joining_date, brand_code, sub_category, 
      uom, design_model, active, make, barcode, group_code, last_sale_rate, 
      last_sale_qty, last_sale_date, last_pur_rate, last_pur_qty, last_pur_date, 
      qty_inhand000, qty_inhand001, qty_inhand002, qty_inhand003, qty_inhand004, 
      qty_inahnd005, qty_inhand006, qty_inahnd007, qty_inhand008, qty_inhand009, 
      price_level1, price_level2, price_level3, price_level4, price_level5, 
      tax_code, retail_min, retail_max, urdu_desc, type_print, item_brand
    } = req.body; // Destructure all fields from request body
  
    try {
      const productCode = product_code || 0; // Default to 0 if no product code is provided
       const barCode=barcode || '';
        //console.log(picture)
       let imageBuffer = null;
       if (picture) {
         imageBuffer = Buffer.from(picture, "base64");
       } 
     
      const request = pool.request();
      request.input('product_code', sql.Decimal, productCode);
      request.input('product_desc', sql.VarChar, product_desc);
      request.input('cost', sql.Decimal, cost);
      request.input('retail', sql.Decimal, retail);
      //request.input('avg_cost', sql.Decimal, avg_cost);
      request.input('qty_inhand', sql.Decimal, qty_inhand);
      request.input('case_qty', sql.Decimal, case_qty)||1;
      request.input('category_code', sql.Decimal, category_code) || 0;
      request.input('sale_tax', sql.Decimal, sale_tax);
      request.input('bin_location', sql.VarChar, bin_location);
      request.input('item_disc', sql.Decimal, item_disc);
      request.input('branch_id', sql.VarChar, branch_id);
      request.input('joining_date', sql.DateTime, joining_date);
      request.input('brand_code', sql.Decimal, brand_code);
      request.input('sub_category', sql.VarChar, sub_category);
      request.input('uom', sql.VarChar, uom);
      request.input('design_model', sql.VarChar, design_model);
      request.input('make', sql.VarChar, make);
      request.input('barcode', sql.VarChar, barCode);
      request.input('group_code', sql.Decimal, group_code) || 0;
      request.input('tax_code', sql.VarChar, tax_code);
      request.input('retail_min', sql.Decimal, retail_min);
      request.input('retail_max', sql.Decimal, retail_max);
      request.input('urdu_desc', sql.NVarChar, urdu_desc);
  
      // Query for product details
      const productQuery = `
        INSERT INTO item_description (
          product_code, product_desc, cost, retail, qty_inhand, 
          case_qty, category_code, sale_tax,
          bin_location, item_disc, branch_id, joining_date, brand_code, sub_category, 
          uom, design_model, make, barcode, group_code,
          tax_code, retail_min, retail_max, urdu_desc
        ) VALUES (
          @product_code, @product_desc, @cost, @retail, @qty_inhand, 
          @case_qty, @category_code, @sale_tax,
          @bin_location, @item_disc, @branch_id, @joining_date, @brand_code, @sub_category, 
          @uom, @design_model, @make, @barcode, @group_code,
          @tax_code, @retail_min, @retail_max, @urdu_desc
        )
      `;
  
      // Execute the product details query
      await request.query(productQuery);
    //console.log(imageBuffer)
      // If image is provided, insert it
      if (imageBuffer) {
        const imageRequest = pool.request();
        imageRequest.input('product_code', sql.Decimal, productCode);
        imageRequest.input('picture', sql.VarBinary, imageBuffer);
  
        const imageQuery = `
          INSERT INTO item_images (product_code, picture)
          VALUES (@product_code, @picture)
        `;
        await imageRequest.query(imageQuery);
      }
  
      res.status(200).send("Product Saved Successfully!");
    } catch (error) {
      console.error("Error saving product or image:", error);
      res.status(500).send("Error saving product or image.");
    }
  });
  // app.get('/api/get-product-by-code/:productCode', (req, res) => {

  //   const { productCode } = req.params;
    
  //   pool.execute('SELECT * FROM item_description,item_images WHERE product_code = ?', [productCode], (err, results) => {
  //     if (err) {
  //       console.error(err);
  //       return res.status(500).send('Error retrieving product');
  //     }
      
  //     if (results.length === 0) {
  //       return res.status(404).send('Product not found');
  //     }
  
  //     return res.json(results[0]); // Return the first result (should be unique based on product_code)
  //   });
  // });
  // app.get('/api/get-product-by-code/:productCode', async (req, res) => {
  //   const { productCode } = req.params;
  
  //   try {
  //     const result = await pool.request()
  //     .input('productCode', sql.Decimal, productCode)
  //       .query(`
  //         SELECT 
  //           item_description.*, 
  //           item_images.*
  //         FROM 
  //           item_description
  //         INNER JOIN 
  //           item_images
  //         ON 
  //           item_description.product_code = item_images.product_code
  //         WHERE 
  //           item_description.product_code = @productCode
  //       `);
  //     if (result.recordset.length === 0) {
  //       return res.status(404).send('Product not found');
  //     }
  
  //     return res.json(result.recordset); // Return the first result (if found)
  //   } catch (err) {
  //     console.error('Error retrieving product:', err);
  //     return res.status(500).send('Error retrieving product');
  //   }
  // });
  
  app.get('/api/get-product-by-code/:productCode', async (req, res) => {
    const { productCode } = req.params;
  
    try {
      const result = await pool.request()
        .input('productCode', sql.Decimal, productCode)
//         .query(`
//           SELECT 
//             item_description.*, 
//             item_images.*
//        FROM item_description
// JOIN item_images
//           ON 
//             item_description.product_code = item_images.product_code
//             WHERE item_description.product_code = @productCode
        
//         `);
.query(`
SELECT 
item_description.*, 
item_images.picture
FROM item_description
LEFT JOIN item_images
ON item_description.product_code = item_images.product_code
WHERE item_description.product_code = @productCode
`);

      if (result.recordset.length === 0) {
        return res.status(404).send('Product not found');
      }
  
      const product = result.recordset;
     // console.log("Yes IMAG CONVERT"+product.picture)
      // Convert binary image data to Base64
      // if ((product.picture)!=0) {
      //   product.picture = Buffer.from(product.picture).toString('base64');
      //    console.log("Yes IMAG CONVERT"+product.picture)
      
      // }

      //console.log(product)
      res.json(product); // Send the product with the converted image
    } catch (err) {
      console.error('Error retrieving product:', err);
      res.status(500).send('Error retrieving product');
    }
  });
  
  app.put("/api/update-product/:product_code", async (req, res) => {
    const {
      product_desc, cost, retail, avg_cost, qty_inhand, case_qty, category_code,
      sale_tax, bin_location, item_disc, branch_id, joining_date, brand_code, 
      sub_category, uom, design_model, make, barcode, group_code, tax_code, 
      retail_min, retail_max, urdu_desc, picture
    } = req.body;
  
    const productCode = req.params.product_code; // Get product code from URL params
  
    try {
      // Create the image buffer if the picture is provided
      let imageBuffer = null;
      if (picture) {
        imageBuffer = Buffer.from(picture, "base64");
      }
  
      const request = pool.request();
      request.input('product_code', sql.Decimal, productCode);
      request.input('product_desc', sql.VarChar, product_desc);
      request.input('cost', sql.Decimal, cost);
      request.input('retail', sql.Decimal, retail);
      request.input('avg_cost', sql.Decimal, avg_cost);
      request.input('qty_inhand', sql.Decimal, qty_inhand);
      request.input('case_qty', sql.Decimal, case_qty);
      request.input('category_code', sql.Decimal, category_code);
      request.input('sale_tax', sql.Decimal, sale_tax);
      request.input('bin_location', sql.VarChar, bin_location);
      request.input('item_disc', sql.Decimal, item_disc);
      request.input('branch_id', sql.VarChar, branch_id);
      request.input('joining_date', sql.DateTime, joining_date);
      request.input('brand_code', sql.Decimal, brand_code);
      request.input('sub_category', sql.VarChar, sub_category);
      request.input('uom', sql.VarChar, uom);
      request.input('design_model', sql.VarChar, design_model);
      request.input('make', sql.VarChar, make);
      request.input('barcode', sql.VarChar, barcode);
      request.input('group_code', sql.Decimal, group_code);
      request.input('tax_code', sql.VarChar, tax_code);
      request.input('retail_min', sql.Decimal, retail_min);
      request.input('retail_max', sql.Decimal, retail_max);
      request.input('urdu_desc', sql.NVarChar, urdu_desc);
  
      // Query to update the product details
      const updateProductQuery = `
        UPDATE item_description
        SET product_desc = @product_desc, cost = @cost, retail = @retail, avg_cost = @avg_cost,
            qty_inhand = @qty_inhand, case_qty = @case_qty, category_code = @category_code,
            sale_tax = @sale_tax, bin_location = @bin_location, item_disc = @item_disc, 
            branch_id = @branch_id, joining_date = @joining_date, brand_code = @brand_code, 
            sub_category = @sub_category, uom = @uom, design_model = @design_model, make = @make, 
            barcode = @barcode, group_code = @group_code, tax_code = @tax_code, 
            retail_min = @retail_min, retail_max = @retail_max, urdu_desc = @urdu_desc
        WHERE product_code = @product_code
      `;
  
      await request.query(updateProductQuery);
  
      // If an image is provided, update the image
      if (imageBuffer) {
        const imageRequest = pool.request();
        imageRequest.input('product_code', sql.Decimal, productCode);
        imageRequest.input('picture', sql.VarBinary, imageBuffer);
  
        const updateImageQuery = `
          UPDATE item_images
          SET picture = @picture
          WHERE product_code = @product_code
        `;
        await imageRequest.query(updateImageQuery);
      }
  
      res.status(200).send("Product Updated Successfully!");
    } catch (error) {
      console.error("Error updating product or image:", error);
      res.status(500).send("Error updating product or image.");
    }
  });
  
  //for edit product page
  // app.get('/editproduct', async (req, res) => {

  //   try {
  //     const result = await pool.request()
  // .query("SELECT *from  item_description");
  // //console.log("fetched bin"+ JSON.stringify(result.recordset, null, 2))
  //  res.json(result.recordset);
  //    } catch (err) {
  //      console.error('Query Error: ', err);
  //      res.status(500).send(err.message);
  //    }
  // });
  app.get('/api/get-items', async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query('SELECT * FROM item_description');
        res.json(result.recordset);
    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).send('Error fetching items');
    }
});

// Search items by product_desc
app.get('/api/search-items', async (req, res) => {
    const { product_desc } = req.query;
    try {
        const pool = await sql.connect(config);
        const result = await pool
            .request()
            .input('product_desc', sql.VarChar, `%${product_desc}%`)
            .query('SELECT * FROM item_description WHERE product_desc LIKE @product_desc');
        res.json(result.recordset);
    } catch (error) {
        console.error('Error searching items:', error);
        res.status(500).send('Error searching items');
    }
});
  
  // app.post("/api/save-product-image", async (req, res) => {
  //   const { product_code, picture } = req.body; // Get product code and image (base64)
    
  //   if (!picture) {
  //     return res.status(400).send("No image provided");
  //   }
  
  //   const productCode = product_code || 0; // Default to 0 if no product code is provided
  
  //   try {
  //     // Convert base64 to binary
  //     const imageBuffer = Buffer.from(picture, "base64");  // Convert the base64 string to a buffer
  
  //     // Use the mssql connection pool to execute the query
  //     const request = pool.request();
  //     request.input('product_code', sql.Decimal, productCode);  // Pass product_code as parameter
  //     request.input('picture', sql.VarBinary, imageBuffer);      // Pass imageBuffer as parameter
  
  //     const query = `
  //       INSERT INTO item_images (product_code, picture) 
  //       VALUES (@product_code, @picture)
  //     `;
  //     await request.query(query);
  
  //     res.status(200).send("Image saved successfully!");
  //   } catch (error) {
  //     console.error("Error converting base64 to buffer:", error);
  //     res.status(500).send("Error processing the image.");
  //   }
  // });
  app.get('/accountmaster', async (req, res) => {
    try {
     const result = await pool.request()
 .input('branch_id', sql.VarChar, branch_G)
 .query("select *from accounts_master where account_type=701 and branch_id=@branch_id");
           //  console.log("Salesmen Field Done: " + JSON.stringify(result.recordset, null, 2));

  res.json(result.recordset);
    } catch (err) {
      console.error('Query Error: ', err);
      res.status(500).send(err.message);
    }
  });

  app.post('/voucher', async (req, res) => {
    try { 
      const result = await pool.request()
      .input('branch_id', sql.VarChar, branch_G)
      .query("select max(voucher_no) As vouc from voucher_master where voucher_type=4 and branch_id=@branch_id");
  
      //console.log('SQL Query Result:', result.recordset);
      let newVoucherNumber = (result.recordset[0]?.vouc === null) ? 1 : result.recordset[0].vouc + 1;
  
      res.json({ voucher_number: newVoucherNumber });
      //console.log(newInvoiceNumber);
    } catch (err) {
      console.error('Query Error: ', err);
      res.status(500).json({ error: err.message });
    }
  });
  app.get('/getPaymentsLedger', async (req, res) => {
    const masterCode = req.query.masterCode; // Pass masterCode as query parameter
    
    try {
      const result = await sql.query(`SELECT * FROM payments_ledger WHERE master_code = ${masterCode}`);
      res.json(result.recordset); // Send the filtered data as response
    } catch (err) {
      res.status(500).json({ error: err.message }); // Handle errors
    }
  });
  
  // app.post("/saveVoucher", async (req, res) => {
  //   const pool = await sql.connect(config);
    
  //   const {
  //     voucher_no,
  //     voucher_type,
  //     wk_no,
  //     voucher_year,
  //     voucher_month,
  //     dt_date,
  //     dt_datetime,
  //     items,
  //   } = req.body;
  
  //   try {
  //     if (!items || items.length === 0) {
  //       return res.status(400).json({ error: "Items array is required." });
  //     }
  
  //     // Insert items into voucher_master
  //     let s_no = 1; // Initialize serial number
  //     for (const item of items) {
  //       const query = `
  //         INSERT INTO voucher_master 
  //         (voucher_no, voucher_type, account_no, branch_id, wk_no, voucher_year, voucher_month, 
  //         s_no, debit, credit, particular, title, dt_date, ref_doc_no, prv_balance, discount) 
  //         VALUES 
  //         (@voucher_no, @voucher_type, @account_no, @branch_id, @wk_no, @voucher_year, @voucher_month, 
  //         @s_no, @debit, @credit, @particular, @title, @dt_date, @ref_doc_no, @prv_balance, @discount)
  //       `;
  
  //       await pool.request()
  //         .input("voucher_no", sql.Decimal(18, 0), voucher_no)
  //         .input("voucher_type", sql.Int, voucher_type)
  //         .input("account_no", sql.Decimal(18, 0), item.account_no)
  //         .input("branch_id", sql.VarChar(50), item.branch_id)
  //         .input("wk_no", sql.Int, wk_no)
  //         .input("voucher_year", sql.Int, voucher_year)
  //         .input("voucher_month", sql.Int, voucher_month)
  //         .input("s_no", sql.Int, s_no++) // Increment s_no for each item
  //         .input("debit", sql.Decimal(18, 0), item.debit)
  //         .input("credit", sql.Decimal(18, 0), item.credit)
  //         .input("particular", sql.VarChar(250), item.particular)
  //         .input("title", sql.VarChar(250), item.title)
  //         .input("dt_date", sql.DateTime, dt_date)
  //         // .input("dt_datetime", sql.DateTime, dt_datetime)
  //         .input("ref_doc_no", sql.Decimal(18, 0), item.ref_doc_no)
  //         .input("prv_balance", sql.Decimal(18, 0), item.prv_balance)
  //         .input("discount", sql.Decimal(18, 2), item.discount)
  //         .query(query);
  //     }
  
  //     res.status(200).json({ message: "Voucher saved successfully!" });
  //   } catch (error) {
  //     console.error("Error saving voucher:", error);
  //     res.status(500).json({ error: "Failed to save voucher." });
  //   } 
    
  // });
  app.post("/saveVoucher", async (req, res) => {
    const pool = await sql.connect(config);
  
    const {
      voucher_no,
      particular,
      voucher_type,
      wk_no,

      voucher_year,
      voucher_month,
      dt_date
      ,ref_doc_no,
      dt_datetime,
      items,
      last_account_no,
      last_debit,
      last_title,
      last_discount,
      discount
      // manualItem, // For manual item input
    } = req.body;
  console.log("Voucher no"+voucher_no)
    try {
      if (!items || items.length === 0) {
        return res.status(400).json({ error: "Items array is required." });
      }
      items.sort((a, b) => a.s_no - b.s_no);
      // Insert items into voucher_master
      let s_no = 1; // Initialize serial number
      for (const item of items) {
        const query = `
          INSERT INTO voucher_master 
          (voucher_no, voucher_type, account_no, branch_id, wk_no, voucher_year, voucher_month, dt_datetime,
          s_no, debit, credit, particular, title, dt_date, ref_doc_no, prv_balance, discount) 
          VALUES 
          (@voucher_no, @voucher_type, @account_no, @branch_id, @wk_no, @voucher_year, @voucher_month,@dt_datetime,
          @s_no, @debit, @credit, @particular, @title, @dt_date, @ref_doc_no, @prv_balance, @discount)
        `;
  
        await pool.request()
          .input("voucher_no", sql.Decimal(18, 0), voucher_no)
          .input("voucher_type", sql.Int, voucher_type)
          .input("account_no", sql.Decimal(18, 0), item.account_no)
          .input("branch_id", sql.VarChar(50), item.branch_id)
          .input("wk_no", sql.Int, wk_no)
          .input("voucher_year", sql.Int, voucher_year)
          .input("voucher_month", sql.Int, voucher_month)
          .input("dt_datetime", sql.DateTime,dt_datetime)
       
          .input("s_no", sql.Int, s_no++) // Increment s_no for each item
          .input("debit", sql.Decimal(18, 0), item.debit)
          .input("credit", sql.Decimal(18, 0), item.credit)
          .input("particular", sql.VarChar(250), item.particular)
          .input("title", sql.VarChar(250), item.title)
          .input("dt_date", sql.DateTime, dt_date)
          .input("ref_doc_no", sql.Decimal(18, 0), item.ref_doc_no)
          .input("prv_balance", sql.Decimal(18, 0), item.prv_balance)
          .input("discount", sql.Decimal(18, 2), item.discount)
          .query(query);
       
      }
const manualItem=true;
      // If manual item is provided, insert it as well
      if (manualItem) {
        const query = `
          INSERT INTO voucher_master 
          (voucher_no, voucher_type, account_no, branch_id, wk_no, voucher_year, voucher_month,dt_datetime,
          s_no, debit, credit, particular, title, dt_date, ref_doc_no, prv_balance, discount) 
          VALUES 
          (@voucher_no, @voucher_type, @account_no, @branch_id, @wk_no, @voucher_year, @voucher_month,@dt_datetime,
          @s_no, @debit, @credit, @particular, @title, @dt_date, @ref_doc_no, @prv_balance, @discount)
        `;
  
        await pool.request()
          .input("voucher_no", sql.Decimal(18, 0), voucher_no)
          .input("voucher_type", sql.Int, voucher_type)
          .input("account_no", sql.Decimal(18, 0), last_account_no)
          .input("branch_id", sql.VarChar(50), branch_G)
          .input("wk_no", sql.Int, wk_no)
          .input("voucher_year", sql.Int, voucher_year)
          .input("voucher_month", sql.Int, voucher_month)
          .input("dt_datetime", sql.DateTime,dt_datetime)
          .input("s_no", sql.Int, s_no++) // Increment s_no for the manual item
          .input("debit", sql.Decimal(18, 0),  last_debit)
          .input("credit", sql.Decimal(18, 0), 0)
          .input("particular", sql.VarChar(250), particular || 'CASH RECEIVED')
          .input("title", sql.VarChar(250), last_title)
          .input("dt_date", sql.DateTime, dt_date)
          .input("ref_doc_no", sql.Decimal(18, 0), ref_doc_no)
          .input("prv_balance", sql.Decimal(18, 0), 0)
          .input("discount", sql.Decimal(18, 2),  last_discount)
          .query(query);
      }
  
      res.status(200).json({ message: "Voucher saved successfully!" });
    } catch (error) {
      console.error("Error saving voucher:", error);
      res.status(500).json({ error: "Failed to save voucher." });
    }
  });
  
  // Start the server
  app.listen(3001, () => {
    console.log('Backend server is running on port 3001');
  });
}).catch((err) => {
  console.error('SQL Connection Error: ', err);
});
