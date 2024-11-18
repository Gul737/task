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
      console.log("customer Field Set"+ JSON.stringify(result.recordset, null, 2));
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
            .query(`
              UPDATE invoice_detail
              SET product_name = @product_name, qty = @qty, rate = @rate, discount = @discount,
                  i_retail = @i_retail, i_cost = @i_cost
              WHERE inv_code = @inv_code AND product_code = @product_code
            `);
        }
        existingItemsMap.delete(item.product_code); // Mark as processed
      } else {
        // Insert new item
        s_no++;
        await requestDetail
        .input('inv_code', sql.Decimal(18, 0), inv_code)
          .input('branch_id', sql.VarChar(50), branch_G)
          .input('product_code', sql.Decimal(18, 0), item.product_code)
          .input('product_name', sql.VarChar(500), item.product_name)
          .input('qty', sql.Decimal(18, 3), item.qty)
          .input('rate', sql.Decimal(18, 2), item.rate)
          .input('discount', sql.Decimal(18, 2), item.discount)
          .input('s_no', sql.Int, s_no)
          .query(`
            INSERT INTO invoice_detail (inv_code, branch_id, status, wk_no, product_code, product_name, qty, rate, discount, s_no)
            VALUES (@inv_code, @branch_id, 2, 1, @product_code, @product_name, @qty, @rate, @discount, @s_no)
          `);
      }
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
      request.input('cust_disc_per', sql.Decimal, cust_disc_per);
      request.input('price_level', sql.Int, price_level);
      request.input('cust_credit_limit', sql.Decimal, cust_credit_limit);
      request.input('cust_credit_days', sql.Int, cust_credit_days);
      request.input('branch_id', sql.VarChar(50), branch_G);
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
      request.input('cust_joining_date', sql.DateTime, cust_joining_date)
      // Execute the query to insert the customer data
      await request.query(`
        INSERT INTO customer_info (
          cust_code, cust_name, cust_ph_no, cust_mob_no, cust_address1, cust_address2, cust_email, cust_cnic, 
          cust_area, cust_city, cust_country, remarks, cust_type, cust_terms, cust_disc_per, price_level, 
          cust_credit_limit, cust_credit_days, branch_id, salesman_code, cust_fax, cust_cmp_name, cust_ntn_no, 
          cust_sales_tax_reg, cust_current_bal, target, commission, last_inv_type, cust_dng_type,cust_joining_date,master_code
        )
        VALUES (
          @cust_code, @cust_name, @cust_ph_no, @cust_mob_no, @cust_address1, @cust_address2, @cust_email, @cust_cnic, 
          @cust_area, @cust_city, @cust_country, @remarks, @cust_type, @cust_terms, @cust_disc_per, @price_level, 
          @cust_credit_limit, @cust_credit_days, @branch_id, @salesman_code, @cust_fax, @cust_cmp_name, @cust_ntn_no, 
          @cust_sales_tax_reg, @cust_current_bal, @target, @commission, @last_inv_type, @cust_dng_type,cust_joining_date,401
        )
      `);

      res.status(201).send('Customer added successfully');
    } catch (error) {
      console.error('Error adding customer:', error);
      res.status(500).send('Error adding customer');
    }
  });
  // Start the server
  app.listen(3001, () => {
    console.log('Backend server is running on port 3001');
  });
}).catch((err) => {
  console.error('SQL Connection Error: ', err);
});
