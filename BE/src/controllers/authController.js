const authService = require('../services/authService');
const { success, error } = require('../utils/response');
const { generateToken } = require('../utils/jwt');

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return error(res, 'Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.', 400);
    }

    const user = await authService.login(username, password);

    if (!user) {
      return error(res, 'Tên đăng nhập hoặc mật khẩu không đúng.', 401);
    }

    const userId = user.Id || user.id;
    const usernameValue = user.Username || user.username;
    const roleValue = user.Role || user.role;

    // Tạo JWT token
    const token = generateToken({
      id: userId,
      username: usernameValue,
      role: roleValue
    });

    const employee = userId
      ? await authService.getEmployeeByUserId(userId)
      : null;

    const employeeId = employee?.EmployeeId || employee?.employeeId || null;
    const employeeName =
      user.EmployeeName || user.employeeName ||
      employee?.Name || employee?.name || null;

    const displayName = employeeName || usernameValue;

    // Trả về thông tin người dùng và token
    return success(res, {
      user: {
        id: userId,
        employeeId,
        username: usernameValue,
        role: roleValue,
        displayName,
        name: displayName
      },
      token
    }, 'Đăng nhập thành công');
  } catch (err) {
    console.error('Lỗi khi đăng nhập:', err);
    return error(res, 'Đăng nhập thất bại', 500);
  }
};

const me = async (req, res) => {
  try {
    const employee = await authService.getEmployeeByUserId(req.user.id);
    const employeeId = employee?.EmployeeId || employee?.employeeId || null;
    let displayName = employee?.Name || employee?.name || req.user.username;

    return success(res, {
      id: req.user.id,
      employeeId,
      username: req.user.username,
      role: req.user.role,
      displayName,
      name: displayName,
      phone: employee?.Phone || employee?.phone || null,
      gender: employee?.Gender || employee?.gender || null,
      birthDate: employee?.BirthDate || employee?.birthDate || null,
      position: employee?.Position || employee?.position || null,
      salary: employee?.Salary || employee?.salary || null,
      address: employee?.Address || employee?.address || null
    });
  } catch (err) {
    console.error('Lỗi:', err);
    return error(res, 'Lấy thông tin người dùng thất bại.', 500);
  }
};

const updateProfile = async (req, res) => {
  try {
    const employee = await authService.getEmployeeByUserId(req.user.id);
    const employeeId = employee?.EmployeeId || employee?.employeeId;
    if (!employeeId) {
      return error(res, 'Không tìm thấy hồ sơ nhân viên liên kết.', 404);
    }

    const { name, phone, gender, birthDate, address } = req.body;
    if (!name || !phone) {
      return error(res, 'Họ tên và số điện thoại là bắt buộc.', 400);
    }

    const employeeService = require('../services/employeeService');
    await employeeService.update(
      employeeId, name, phone,
      gender || null, birthDate || null,
      employee.Position || employee.position || null,
      employee.Salary || employee.salary || null,
      address || null
    );

    return success(res, null, 'Cập nhật hồ sơ thành công.');
  } catch (err) {
    console.error('Lỗi cập nhật hồ sơ:', err);
    return error(res, 'Cập nhật hồ sơ thất bại.', 500);
  }
};

module.exports = {
  login,
  me,
  updateProfile
};
