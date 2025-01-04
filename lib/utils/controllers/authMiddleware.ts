// import jwt from 'jsonwebtoken';

// export function verifyToken(req, res) {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith('Bearer '))
//     return res.status(401).json({ error: 'Unauthorized access' });

//   const token = authHeader.split(' ')[1];

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET!);
//     return decoded.userId;
//   } catch (err) {
//     return res.status(401).json({ error: 'Invalid token' });
//   }
// }
