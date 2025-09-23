const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

// A test API endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: "Hello from the backend server!" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});