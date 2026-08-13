// Helper to validate input data
const validateRegisterInput = (req, res, next) => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Please provide username, email and password' });
  }

  if (username.trim().length < 3) {
    return res.status(400).json({ message: 'Username must be at least 3 characters long' });
  }

  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Please provide a valid email address' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long' });
  }

  if (role && !['Admin', 'Developer', 'Tester', 'User'].includes(role)) {
    return res.status(400).json({ message: 'Invalid user role' });
  }

  next();
};

const validateLoginInput = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Please provide a valid email address' });
  }

  next();
};

const validateIssueInput = (req, res, next) => {
  const { title, description, type, priority, status } = req.body;

  if (!title || !description) {
    return res.status(400).json({ message: 'Please provide issue title and description' });
  }

  if (title.trim().length > 100) {
    return res.status(400).json({ message: 'Title cannot exceed 100 characters' });
  }

  if (type && !['Bug', 'Task'].includes(type)) {
    return res.status(400).json({ message: 'Type must be Bug or Task' });
  }

  if (priority && !['Low', 'Medium', 'High'].includes(priority)) {
    return res.status(400).json({ message: 'Priority must be Low, Medium, or High' });
  }

  if (status && !['Open', 'In Progress', 'Resolved', 'Closed'].includes(status)) {
    return res.status(400).json({ message: 'Status must be Open, In Progress, Resolved, or Closed' });
  }

  next();
};

module.exports = {
  validateRegisterInput,
  validateLoginInput,
  validateIssueInput,
};
