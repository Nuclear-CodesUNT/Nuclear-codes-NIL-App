const express = require('express');
const cors = require('cors'); // Import the cors package
const app = express();
const PORT = process.env.PORT || 5001;

// Use the cors middleware
app.use(cors()); // This will allow all origins by default

// A test API endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: "Hello from the backend server!" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});