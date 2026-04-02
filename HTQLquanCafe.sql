CREATE DATABASE htql_quan_cafe;
GO

USE htql_quan_cafe;
GO

--Table Roles/Vai trò
CREATE TABLE Roles (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Name NVARCHAR(50) NOT NULL
);

--Table Users/Tài khoản người dùng
CREATE TABLE Users (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Username NVARCHAR(50) NOT NULL UNIQUE,
    Password NVARCHAR(100) NOT NULL,
    RoleId UNIQUEIDENTIFIER,
    CreatedAt DATETIME DEFAULT GETDATE(),

    FOREIGN KEY (RoleId) REFERENCES Roles(Id)
);

--Table Employees/Nhân viên
CREATE TABLE Employees (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER,
    Name NVARCHAR(100),
    Phone NVARCHAR(20),
    CreatedAt DATETIME DEFAULT GETDATE(),

    FOREIGN KEY (UserId) REFERENCES Users(Id)
);

--Table Tables/Bàn
CREATE TABLE Tables (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Name NVARCHAR(50),
    Capacity INT,
    Status NVARCHAR(20)
);

--Table MenuCategories/Danh mục thực đơn
CREATE TABLE MenuCategories (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Name NVARCHAR(100) NOT NULL
);

--Table MenuItems/Món ăn / Sản phẩm
CREATE TABLE MenuItems (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Name NVARCHAR(100),
    CategoryId UNIQUEIDENTIFIER,
    Price DECIMAL(12,2),
    IsAvailable BIT DEFAULT 1,
	ImageUrl NVARCHAR(255),
    FOREIGN KEY (CategoryId) REFERENCES MenuCategories(Id)
);
--Table Suppliers/Nhà cung cấp
CREATE TABLE Suppliers (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Name NVARCHAR(100),
    Phone NVARCHAR(20),
    Address NVARCHAR(255)
);

--Ingredients/Nguyên liệu
CREATE TABLE Ingredients (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Name NVARCHAR(100),
    Unit NVARCHAR(20),
    StockQuantity DECIMAL(10,2),
    SupplierId UNIQUEIDENTIFIER,

    FOREIGN KEY (SupplierId) REFERENCES Suppliers(Id)
);

--MenuItemIngredients(Receipt)/Công thức món
CREATE TABLE MenuItemIngredients (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    MenuItemId UNIQUEIDENTIFIER,
    IngredientId UNIQUEIDENTIFIER,
    Quantity DECIMAL(10,2),

    FOREIGN KEY (MenuItemId) REFERENCES MenuItems(Id),
    FOREIGN KEY (IngredientId) REFERENCES Ingredients(Id)
);

--Table Orders/Đơn hàng
CREATE TABLE Orders (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    TableId UNIQUEIDENTIFIER,
    EmployeeId UNIQUEIDENTIFIER,
    Status NVARCHAR(50),
    CreatedAt DATETIME DEFAULT GETDATE(),

    FOREIGN KEY (TableId) REFERENCES Tables(Id),
    FOREIGN KEY (EmployeeId) REFERENCES Employees(Id)
);

--Table OrderItems/Chi tiết đơn hàng
CREATE TABLE OrderItems (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    OrderId UNIQUEIDENTIFIER,
    MenuItemId UNIQUEIDENTIFIER,
    Quantity INT,
    Price DECIMAL(12,2),
    Status NVARCHAR(50),

    FOREIGN KEY (OrderId) REFERENCES Orders(Id),
    FOREIGN KEY (MenuItemId) REFERENCES MenuItems(Id)
);

--Table Payment/Thanh toán
CREATE TABLE Payments (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    OrderId UNIQUEIDENTIFIER,
    Amount DECIMAL(12,2),
    PaymentMethod NVARCHAR(50),
    PaidAt DATETIME,

    FOREIGN KEY (OrderId) REFERENCES Orders(Id)
);

--Table InventoryTransactions/Giao dịch kho
CREATE TABLE InventoryTransactions (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    IngredientId UNIQUEIDENTIFIER,
    Quantity DECIMAL(10,2),
    Type NVARCHAR(20),
    CreatedAt DATETIME DEFAULT GETDATE(),

    FOREIGN KEY (IngredientId) REFERENCES Ingredients(Id)
);

CREATE INDEX IX_Orders_TableId ON Orders(TableId);
CREATE INDEX IX_Orders_CreatedAt ON Orders(CreatedAt);
CREATE INDEX IX_OrderItems_OrderId ON OrderItems(OrderId);
CREATE INDEX IX_MenuItems_CategoryId ON MenuItems(CategoryId);
CREATE INDEX IX_Ingredients_SupplierId ON Ingredients(SupplierId);

INSERT INTO Roles(Name) VALUES 
(N'Admin'),
(N'Staff');
SELECT * FROM ROLES

INSERT INTO Users (Username, Password, RoleId) VALUES
('admin','123456','119B7A6F-397D-45F9-966E-73235D787968'),
('staff1','123456','3CF1814D-7487-4F9E-BCA1-69A723684811'),
('staff2','123456','3CF1814D-7487-4F9E-BCA1-69A723684811');
SELECT * FROM USERS


INSERT INTO Employees ( UserId, Name, Phone) VALUES
('8FD04CB8-5DA9-4AEC-BE9D-F144E102F26C',N'Bùi Trí Dũng','0867438232'),
('92EBC901-B7C3-45CC-AEF8-AA623D293261',N'Nguyễn Văn Đức','0321456789'),
('BFFC4276-E06A-45E6-AF97-41B73A71B788',N'Nguyễn Đức Huy','0123456789');
SELECT * FROM EMPLOYEES

INSERT INTO Tables ( Name, Capacity, Status) VALUES
('Bàn 1',4,'Available'),
('Bàn 2',4,'Occupied'),
('Bàn 3',2,'Available'),
('Bàn 4',6,'Available'),
('Bàn 5',4,'Reserved');
SELECT * FROM TABLES

INSERT INTO MenuCategories (Name) VALUES
(N'Cà phê'),
(N'Trà sữa'),
(N'Nước ép');
SELECT * FROM MENUCATEGORIES

INSERT INTO MenuItems ( Name, CategoryId, Price) VALUES
--Cà phê
(N'Cà phê đen', '83330E65-BD72-4774-B2AB-D4034DF75B19', 30000),
(N'Cà phê sữa', '83330E65-BD72-4774-B2AB-D4034DF75B19', 25000),
(N'Bạc xỉu', '83330E65-BD72-4774-B2AB-D4034DF75B19', 35000),
(N'Espresso', '83330E65-BD72-4774-B2AB-D4034DF75B19', 40000),
(N'Cappuccino', '83330E65-BD72-4774-B2AB-D4034DF75B19', 40000),
--Trà sữa
(N'Trà sữa truyền thống', 'EEB4FE2C-C6BC-4805-B5E9-477B4742C9CC', 30000),
(N'Trà sữa matcha', 'EEB4FE2C-C6BC-4805-B5E9-477B4742C9CC', 35000),
(N'Trà sữa khoai môn', 'EEB4FE2C-C6BC-4805-B5E9-477B4742C9CC', 40000),
(N'Trà sữa đường đen', 'EEB4FE2C-C6BC-4805-B5E9-477B4742C9CC', 35000),
(N'Trà sữa Thái', 'EEB4FE2C-C6BC-4805-B5E9-477B4742C9CC', 35000),
--Nước ép
(N'Nước ép cam', 'E30C782C-4543-48B1-A2F2-2D058029A2FD', 30000),
(N'Nước ép dưa hấu', 'E30C782C-4543-48B1-A2F2-2D058029A2FD', 30000),
(N'Nước ép thơm', 'E30C782C-4543-48B1-A2F2-2D058029A2FD', 30000),
(N'Nước ép cà rốt', 'E30C782C-4543-48B1-A2F2-2D058029A2FD', 30000),
(N'Nước ép táo', 'E30C782C-4543-48B1-A2F2-2D058029A2FD', 35000);
SELECT * FROM MENUITEMS

INSERT INTO Suppliers (Name, Phone, Address) VALUES
(N'Công ty cà phê Trung Nguyên','0901112222',N'TP.HCM'),
(N'Nhà cung cấp sữa Vinamilk','0903334444',N'Hà Nội'),
(N'Công ty trái cây sạch','0905556666',N'Đà Lạt'),
(N'Công ty đường Biên Hòa','0907778888',N'Đồng Nai'),
(N'Công ty bánh ngọt ABC','0909990000',N'TP.HCM');
SELECT * FROM SUPPLIERS

INSERT INTO Ingredients (Name, Unit, StockQuantity, SupplierId) VALUES
(N'Cà phê hạt','gram',5000,'E2776F56-4FB8-45CB-AFE2-91DCD872E6E3'),
(N'Sữa đặc','ml',3000,'F03C66A0-5CC3-4A7F-B45A-7E7CC86D8F57'),
(N'Trà đào','ml',2000,'86AAB005-1BA9-4B24-B106-9D0CA3B65FDD'),
(N'Xoài','gram',1500,'86AAB005-1BA9-4B24-B106-9D0CA3B65FDD'),
(N'Đường','gram',4000,'46C62418-4D60-4022-8741-ADF7B9D46D33');
SELECT * FROM INGREDIENTS

INSERT INTO MenuItemIngredients (MenuItemId, IngredientId, Quantity) VALUES
('44444444-1111-1111-1111-111111111111','55555555-1111-1111-1111-111111111111',20),
('44444444-1111-1111-1111-111111111111','55555555-1111-1111-1111-111111111112',30),
('44444444-1111-1111-1111-111111111113','55555555-1111-1111-1111-111111111113',40),
('44444444-1111-1111-1111-111111111114','55555555-1111-1111-1111-111111111114',100),
('44444444-1111-1111-1111-111111111115','55555555-1111-1111-1111-111111111115',10);


--Stored Procedures
--------Login
		CREATE PROCEDURE sp_Login
			@Username NVARCHAR(50),
			@Password NVARCHAR(100)
		AS
		BEGIN
			SELECT 
				u.Id,
				u.Username,
				r.Name AS Role
			FROM Users u
			JOIN Roles r ON u.RoleId = r.Id
			WHERE u.Username = @Username
			  AND u.Password = @Password
		END
	EXEC sp_Login 'admin', '123456'

-----Roles
--------Get Roles
		CREATE PROCEDURE sp_Roles_GetAll
		AS
		BEGIN
			SELECT * FROM Roles
		END

--------Create Role
		CREATE PROCEDURE sp_Roles_Create
			@Name NVARCHAR(50)
		AS
		BEGIN
			INSERT INTO Roles(Id,Name)
			VALUES(NEWID(),@Name)
		END

-----Users
--------Get Users
		CREATE PROCEDURE sp_Users_GetAll
		AS
		BEGIN
			SELECT 
				u.Id,
				u.Username,
				r.Name Role
			FROM Users u
			LEFT JOIN Roles r ON u.RoleId = r.Id
		END

--------Get User By Id
		CREATE PROCEDURE sp_Users_GetById
			@Id UNIQUEIDENTIFIER
		AS
		BEGIN
			SELECT * FROM Users WHERE Id = @Id
		END

--------Create User
		CREATE PROCEDURE sp_Users_Create
			@Username NVARCHAR(50),
			@Password NVARCHAR(100),
			@RoleId UNIQUEIDENTIFIER
		AS
		BEGIN
			INSERT INTO Users
			VALUES(NEWID(),@Username,@Password,@RoleId,GETDATE())
		END

--------Update User
		CREATE PROCEDURE sp_Users_Update
			@Id UNIQUEIDENTIFIER,
			@Username NVARCHAR(50),
			@Password NVARCHAR(100),
			@RoleId UNIQUEIDENTIFIER
		AS
		BEGIN
			UPDATE Users
			SET Username=@Username,
				Password=@Password,
				RoleId=@RoleId
			WHERE Id=@Id
		END

--------Delete User
		CREATE PROCEDURE sp_Users_Delete
			@Id UNIQUEIDENTIFIER
		AS
		BEGIN
			DELETE FROM Users WHERE Id=@Id
		END

-----Employees
--------Get Employees
		CREATE PROCEDURE sp_Employees_GetAll
		AS
		BEGIN
			SELECT * FROM Employees
		END
--------Get Employees ByUserId
		CREATE PROCEDURE sp_Employees_GetByUserId
	   @UserId UNIQUEIDENTIFIER
		AS
		BEGIN
			SELECT 
				e.Id AS EmployeeId,
				e.Name,
				e.Phone,
				e.CreatedAt,

				u.Id AS UserId,
				u.Username,
				u.CreatedAt AS UserCreatedAt,

				r.Name AS Role
			FROM Employees e
			INNER JOIN Users u 
				ON e.UserId = u.Id
			LEFT JOIN Roles r 
				ON u.RoleId = r.Id
			WHERE e.UserId = @UserId
		END

--------Create Employee
		CREATE PROCEDURE sp_Employees_Create
			@UserId UNIQUEIDENTIFIER,
			@Name NVARCHAR(100),
			@Phone NVARCHAR(20)
		AS
		BEGIN
			INSERT INTO Employees
			VALUES(NEWID(),@UserId,@Name,@Phone,GETDATE())
		END

--------Update Employee
		CREATE PROCEDURE sp_Employees_Update
			@Id UNIQUEIDENTIFIER,
			@Name NVARCHAR(100),
			@Phone NVARCHAR(20)
		AS
		BEGIN
			UPDATE Employees
			SET Name=@Name,
				Phone=@Phone
			WHERE Id=@Id
		END

--------Delete Employee
		CREATE PROCEDURE sp_Employees_Delete
			@Id UNIQUEIDENTIFIER
		AS
		BEGIN
			DELETE FROM Employees WHERE Id=@Id
		END

-----Tables
--------Get Tables
		CREATE PROCEDURE sp_Tables_GetAll
		AS
		BEGIN
			SELECT * FROM Tables
		END

--------Create Table
		CREATE PROCEDURE sp_Tables_Create
			@Name NVARCHAR(50),
			@Capacity INT
		AS
		BEGIN
			INSERT INTO Tables
			VALUES(NEWID(),@Name,@Capacity,'Available')
		END

--------Update Table
		CREATE PROCEDURE sp_Tables_Update
			@Id UNIQUEIDENTIFIER,
			@Name NVARCHAR(50),
			@Capacity INT
		AS
		BEGIN
			UPDATE Tables
			SET Name=@Name,
				Capacity=@Capacity
			WHERE Id=@Id
		END

--------Update Table Status
		CREATE PROCEDURE sp_Tables_UpdateStatus
			@Id UNIQUEIDENTIFIER,
			@Status NVARCHAR(20)
		AS
		BEGIN
			UPDATE Tables
			SET Status=@Status
			WHERE Id=@Id
		END

-----MenuItems
--------Get Menu
		CREATE PROCEDURE sp_MenuItems_GetAll
		AS
		BEGIN
			SELECT 
				m.Id,
				m.Name,
				m.Price,
				m.ImageUrl,
				c.Name Category
			FROM MenuItems m
			JOIN MenuCategories c ON m.CategoryId = c.Id
		END

--------Get MenuItem By Id
		CREATE PROCEDURE sp_MenuItems_GetById
			@Id UNIQUEIDENTIFIER
		AS
		BEGIN
			SELECT * FROM MenuItems WHERE Id=@Id
		END

--------Create MenuItem
		CREATE PROCEDURE sp_MenuItems_Create
			@Name NVARCHAR(100),
			@CategoryId UNIQUEIDENTIFIER,
			@Price DECIMAL(12,2),
			@ImageUrl NVARCHAR(255)
		AS
		BEGIN
			INSERT INTO MenuItems
			VALUES(NEWID(), @Name, @CategoryId, @Price, 1, @ImageUrl)
		END

--------Update MenuItem
		CREATE PROCEDURE sp_MenuItems_Update
			@Id UNIQUEIDENTIFIER,
			@Name NVARCHAR(100),
			@Price DECIMAL(12,2),
			@ImageUrl NVARCHAR(255)
		AS
		BEGIN
			UPDATE MenuItems
			SET 
				Name = @Name,
				Price = @Price,
				ImageUrl = @ImageUrl
			WHERE Id = @Id
		END

--------Delete MenuItem
		CREATE PROCEDURE sp_MenuItems_Delete
			@Id UNIQUEIDENTIFIER
		AS
		BEGIN
			DELETE FROM MenuItems WHERE Id=@Id
		END

-----Orders
--------Get Orders
		CREATE PROCEDURE sp_Orders_GetAll
		AS
		BEGIN
			SELECT * FROM Orders
		END

--------Get Order Detail
		CREATE PROCEDURE sp_Orders_GetById
			@Id UNIQUEIDENTIFIER
		AS
		BEGIN
			SELECT * FROM Orders WHERE Id=@Id
		END

--------Create Order
		CREATE PROCEDURE sp_Orders_Create
			@TableId UNIQUEIDENTIFIER,
			@EmployeeId UNIQUEIDENTIFIER
		AS
		BEGIN
			INSERT INTO Orders
			VALUES(NEWID(),@TableId,@EmployeeId,'Open',GETDATE())
		END

--------Update Order Status
		CREATE PROCEDURE sp_Orders_UpdateStatus
			@Id UNIQUEIDENTIFIER,
			@Status NVARCHAR(50)
		AS
		BEGIN
			UPDATE Orders
			SET Status=@Status
			WHERE Id=@Id
		END

--------Delete Order
		CREATE PROCEDURE sp_Orders_Delete
			@Id UNIQUEIDENTIFIER
		AS
		BEGIN
			DELETE FROM Orders WHERE Id=@Id
		END

-----OrderItems
--------Add Item
		CREATE PROCEDURE sp_OrderItems_Add
			@OrderId UNIQUEIDENTIFIER,
			@MenuItemId UNIQUEIDENTIFIER,
			@Quantity INT
		AS
		BEGIN

			DECLARE @Price DECIMAL(12,2)

			-- Check stock
			IF EXISTS (
				SELECT 1
				FROM Ingredients i
				JOIN MenuItemIngredients mi
				ON i.Id = mi.IngredientId
				WHERE mi.MenuItemId = @MenuItemId
				AND i.StockQuantity < mi.Quantity * @Quantity
			)
			BEGIN
				RAISERROR('Not enough ingredients',16,1)
				RETURN
			END


			SELECT @Price = Price
			FROM MenuItems
			WHERE Id = @MenuItemId


			INSERT INTO OrderItems
			VALUES
			(
				NEWID(),
				@OrderId,
				@MenuItemId,
				@Quantity,
				@Price,
				'Pending'
			)


			UPDATE i
			SET i.StockQuantity = i.StockQuantity - (mi.Quantity * @Quantity)
			FROM Ingredients i
			JOIN MenuItemIngredients mi
			ON i.Id = mi.IngredientId
			WHERE mi.MenuItemId = @MenuItemId


			INSERT INTO InventoryTransactions
			SELECT
				NEWID(),
				mi.IngredientId,
				mi.Quantity * @Quantity,
				'Export',
				GETDATE()
			FROM MenuItemIngredients mi
			WHERE mi.MenuItemId = @MenuItemId

		END
		GO

--------Update Quantity
		CREATE PROCEDURE sp_OrderItems_Update
			@Id UNIQUEIDENTIFIER,
			@Quantity INT
		AS
		BEGIN
			UPDATE OrderItems
			SET Quantity=@Quantity
			WHERE Id=@Id
		END

--------Delete Item
		CREATE PROCEDURE sp_OrderItems_Delete
			@Id UNIQUEIDENTIFIER
		AS
		BEGIN
			DELETE FROM OrderItems WHERE Id=@Id
		END

--------Update Kitchen Status
		CREATE PROCEDURE sp_OrderItems_UpdateStatus
			@Id UNIQUEIDENTIFIER,
			@Status NVARCHAR(50)
		AS
		BEGIN
			UPDATE OrderItems
			SET Status=@Status
			WHERE Id=@Id
		END

-----Payment
--------Get Payments
		CREATE PROCEDURE sp_Payments_GetAll
		AS
		BEGIN
			SELECT 
				p.Id,
				p.OrderId,
				p.Amount,
				p.PaymentMethod,
				p.PaidAt
			FROM Payments p
			ORDER BY p.PaidAt DESC
		END
		GO
--------Checkout
		CREATE PROCEDURE sp_Payments_Checkout
			@OrderId UNIQUEIDENTIFIER,
			@PaymentMethod NVARCHAR(50)
		AS
		BEGIN	

		DECLARE @Total DECIMAL(12,2)

		SELECT @Total = SUM(Price * Quantity)
		FROM OrderItems
		WHERE OrderId = @OrderId

		INSERT INTO Payments
		VALUES
		(
			NEWID(),
			@OrderId,
			@Total,
			@PaymentMethod,
			GETDATE()
		)

		UPDATE Orders
		SET Status='Completed'
		WHERE Id=@OrderId

		END

-----Inventory
--------Import
		CREATE PROCEDURE sp_Inventory_Import
			@IngredientId UNIQUEIDENTIFIER,
			@Quantity DECIMAL(10,2)
		AS
		BEGIN

		UPDATE Ingredients
		SET StockQuantity = StockQuantity + @Quantity
		WHERE Id = @IngredientId

		INSERT INTO InventoryTransactions
		VALUES
		(
			NEWID(),
			@IngredientId,
			@Quantity,
			'Import',
			GETDATE()
		)

		END

--------Export
		CREATE PROCEDURE sp_Inventory_Export
			@IngredientId UNIQUEIDENTIFIER,
			@Quantity DECIMAL(10,2)
		AS
		BEGIN

		UPDATE Ingredients
		SET StockQuantity = StockQuantity - @Quantity
		WHERE Id = @IngredientId

		INSERT INTO InventoryTransactions
		VALUES
		(
			NEWID(),
			@IngredientId,
			@Quantity,
			'Export',
			GETDATE()
		)

		END

-----MenuCategories
--------Get All
		CREATE PROCEDURE sp_MenuCategories_GetAll
		AS
		BEGIN
			SELECT *
			FROM MenuCategories
		END
		GO

--------Create
		CREATE PROCEDURE sp_MenuCategories_Create
			@Name NVARCHAR(100)
		AS
		BEGIN
			INSERT INTO MenuCategories(Id, Name)
			VALUES(NEWID(), @Name)
		END
		GO

--------Update
		CREATE PROCEDURE sp_MenuCategories_Update
			@Id UNIQUEIDENTIFIER,
			@Name NVARCHAR(100)
		AS
		BEGIN
			UPDATE MenuCategories
			SET Name = @Name
			WHERE Id = @Id
		END
		GO

--------Delete
		CREATE PROCEDURE sp_MenuCategories_Delete
			@Id UNIQUEIDENTIFIER
		AS
		BEGIN
			DELETE FROM MenuCategories
			WHERE Id = @Id
		END
		GO
-----MenuItemIngredients
--------Get Ingredients By MenuItem
		CREATE PROCEDURE sp_MenuItemIngredients_GetByMenuItem
			@MenuItemId UNIQUEIDENTIFIER
		AS
		BEGIN
			SELECT 
				mi.Id,
				i.Name IngredientName,
				mi.Quantity,
				i.Unit
			FROM MenuItemIngredients mi
			JOIN Ingredients i 
				ON mi.IngredientId = i.Id
			WHERE mi.MenuItemId = @MenuItemId
		END
		GO

--------Create Recipe
		CREATE PROCEDURE sp_MenuItemIngredients_Create
			@MenuItemId UNIQUEIDENTIFIER,
			@IngredientId UNIQUEIDENTIFIER,
			@Quantity DECIMAL(10,2)
		AS
		BEGIN
			INSERT INTO MenuItemIngredients
			VALUES
			(
				NEWID(),
				@MenuItemId,
				@IngredientId,
				@Quantity
			)
		END
		GO

--------Update Recipe
		CREATE PROCEDURE sp_MenuItemIngredients_Update
			@Id UNIQUEIDENTIFIER,
			@Quantity DECIMAL(10,2)
		AS
		BEGIN
			UPDATE MenuItemIngredients
			SET Quantity = @Quantity
			WHERE Id = @Id
		END
		GO

--------Delete Recipe
		CREATE PROCEDURE sp_MenuItemIngredients_Delete
			@Id UNIQUEIDENTIFIER
		AS
		BEGIN
			DELETE FROM MenuItemIngredients
			WHERE Id = @Id
		END
		GO

-----Ingredients
--------Get All Ingredients
		CREATE PROCEDURE sp_Ingredients_GetAll
		AS
		BEGIN
			SELECT 
				i.Id,
				i.Name,
				i.Unit,
				i.StockQuantity,
				s.Name Supplier
			FROM Ingredients i
			LEFT JOIN Suppliers s
				ON i.SupplierId = s.Id
		END
		GO

--------Create Ingredient
		CREATE PROCEDURE sp_Ingredients_Create
			@Name NVARCHAR(100),
			@Unit NVARCHAR(20),
			@StockQuantity DECIMAL(10,2),
			@SupplierId UNIQUEIDENTIFIER
		AS
		BEGIN
			INSERT INTO Ingredients
			VALUES
			(
				NEWID(),
				@Name,
				@Unit,
				@StockQuantity,
				@SupplierId
			)
		END
		GO
--------Update Ingredient
		CREATE PROCEDURE sp_Ingredients_Update
			@Id UNIQUEIDENTIFIER,
			@Name NVARCHAR(100),
			@Unit NVARCHAR(20),
			@StockQuantity DECIMAL(10,2),
			@SupplierId UNIQUEIDENTIFIER
		AS
		BEGIN
			UPDATE Ingredients
			SET 
				Name = @Name,
				Unit = @Unit,
				StockQuantity = @StockQuantity,
				SupplierId = @SupplierId
			WHERE Id = @Id
		END
		GO

--------Delete Ingredient
		CREATE PROCEDURE sp_Ingredients_Delete
			@Id UNIQUEIDENTIFIER
		AS
		BEGIN
			DELETE FROM Ingredients
			WHERE Id = @Id
		END
		GO

-----Suppliers
--------Get All
		CREATE PROCEDURE sp_Suppliers_GetAll
		AS
		BEGIN
			SELECT *
			FROM Suppliers
		END
		GO

--------Create Supplier
		CREATE PROCEDURE sp_Suppliers_Create
			@Name NVARCHAR(100),
			@Phone NVARCHAR(20),
			@Address NVARCHAR(255)
		AS
		BEGIN
			INSERT INTO Suppliers
			VALUES
			(
				NEWID(),
				@Name,
				@Phone,
				@Address
			)
		END
		GO

--------Update Supplier
		CREATE PROCEDURE sp_Suppliers_Update
			@Id UNIQUEIDENTIFIER,
			@Name NVARCHAR(100),
			@Phone NVARCHAR(20),
			@Address NVARCHAR(255)
		AS
		BEGIN
			UPDATE Suppliers
			SET 
				Name = @Name,
				Phone = @Phone,
				Address = @Address
			WHERE Id = @Id
		END
		GO

--------Delete Supplier
		CREATE PROCEDURE sp_Suppliers_Delete
			@Id UNIQUEIDENTIFIER
		AS
		BEGIN
			DELETE FROM Suppliers
			WHERE Id = @Id
		END
		GO

-----InventoryTransactions
--------Get Inventory History
		CREATE PROCEDURE sp_InventoryTransactions_GetAll
		AS
		BEGIN
			SELECT 
				t.Id,
				i.Name IngredientName,
				t.Quantity,
				t.Type,
				t.CreatedAt
			FROM InventoryTransactions t
			JOIN Ingredients i
				ON t.IngredientId = i.Id
			ORDER BY t.CreatedAt DESC
		END
		GO

-----Daily Revenue
--------Báo cáo doanh thu theo ngày
		CREATE PROCEDURE sp_Report_DailyRevenue
			@Date DATE
		AS
		BEGIN

		SELECT 
			@Date AS RevenueDate,
			COUNT(DISTINCT p.OrderId) AS TotalOrders,
			SUM(p.Amount) AS TotalRevenue
		FROM Payments p
		WHERE CAST(p.PaidAt AS DATE) = @Date

		END
		GO

--------Báo cáo món bán chạy
		CREATE PROCEDURE sp_Report_BestSellingItems
			@Top INT
		AS
		BEGIN

		SELECT TOP(@Top)
			m.Id,
			m.Name,
			SUM(oi.Quantity) AS TotalSold,
			SUM(oi.Quantity * oi.Price) AS TotalRevenue
		FROM OrderItems oi
		JOIN MenuItems m 
			ON oi.MenuItemId = m.Id
		GROUP BY m.Id, m.Name
		ORDER BY TotalSold DESC

		END
		GO

--------Kiểm tra nguyên liệu có tồn kho thấp hơn ngưỡng
		CREATE PROCEDURE sp_Report_LowStockIngredients
			@Threshold DECIMAL(10,2)
		AS
		BEGIN

		SELECT
			i.Id,
			i.Name,
			i.Unit,
			i.StockQuantity,
			s.Name AS SupplierName,
			s.Phone AS SupplierPhone
		FROM Ingredients i
		LEFT JOIN Suppliers s
			ON i.SupplierId = s.Id
		WHERE i.StockQuantity <= @Threshold
		ORDER BY i.StockQuantity ASC

		END
		GO