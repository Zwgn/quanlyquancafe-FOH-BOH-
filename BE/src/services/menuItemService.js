const { getPool, sql } = require('../config/db');

const normalizeMenuItem = (row) => {
  if (!row) {
    return row;
  }

  const resolvedImageUrl = row.ImageUrl ?? row.imageUrl ?? row.imgUrl ?? null;

  const {
    ImageUrl: _ImageUrl,
    imageUrl: _imageUrl,
    imgUrl: _imgUrl,
    ...rest
  } = row;

  return {
    ...rest,
    imgUrl: resolvedImageUrl
  };
};

const getAll = async () => {
  const pool = await getPool();
  const result = await pool.request()
    .execute('sp_MenuItems_GetAll');
  return result.recordset.map(normalizeMenuItem);
};

const getById = async (id) => {
  const pool = await getPool();
  const result = await pool.request()
    .input('Id', sql.UniqueIdentifier, id)
    .execute('sp_MenuItems_GetById');
  return normalizeMenuItem(result.recordset[0]) || null;
};

const create = async (name, categoryId, price, imageUrl = null) => {
  const pool = await getPool();
  await pool.request()
    .input('Name', sql.NVarChar(100), name)
    .input('CategoryId', sql.UniqueIdentifier, categoryId)
    .input('Price', sql.Decimal(12, 2), price)
    .input('ImageUrl', sql.NVarChar(255), imageUrl)
    .execute('sp_MenuItems_Create');
  return { message: 'Tạo món ăn thành công' };
};

const update = async (id, name, categoryId, price, imageUrl = null) => {
  const pool = await getPool();
  await pool.request()
    .input('Id', sql.UniqueIdentifier, id)
    .input('Name', sql.NVarChar(100), name)
    .input('CategoryId', sql.UniqueIdentifier, categoryId)
    .input('Price', sql.Decimal(12, 2), price)
    .input('ImageUrl', sql.NVarChar(255), imageUrl)
    .execute('sp_MenuItems_Update');
  return { message: 'Cập nhật món ăn thành công' };
};

const remove = async (id) => {
  const pool = await getPool();
  await pool.request()
    .input('Id', sql.UniqueIdentifier, id)
    .execute('sp_MenuItems_Delete');
  return { message: 'Xóa món ăn thành công' };
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
};
