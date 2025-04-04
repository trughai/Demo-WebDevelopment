const admin = require('firebase-admin');
admin.initializeApp();

// Cập nhật vai trò cho người dùng (admin)
const setRole = async (email) => {
  const user = await admin.auth().getUserByEmail(email);

  // Gán custom claim (role) cho người dùng
  await admin.auth().setCustomUserClaims(user.uid, { role: 'admin' });

  // Cập nhật Firestore nếu cần
  await admin.firestore().collection('users').doc(user.uid).set({
    email: user.email,
    role: 'admin',
  });
};

// Ví dụ gọi hàm
setRole("user@example.com");
