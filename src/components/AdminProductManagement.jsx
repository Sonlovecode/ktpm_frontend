import React, { useState, useEffect } from 'react';
import { productAPI } from "../services/api";

import '../styles/AdminProductManagement.css';


const API_URL = import.meta.env.VITE_API_URL || 'https://ktpm-backend.onrender.com';

const AdminProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Tất cả');
  const [statusFilter, setStatusFilter] = useState('Tất cả');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({
    _id: null,
    name: '',
    category: '',
    price: 0,
    image: '',
    discount: '',
    priceGoc: 0,
    stock: 0,
    status: 'Active'
  });

  // Lấy dữ liệu từ API khi component được mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getAll();
      // Đảm bảo dữ liệu trả về là một mảng
      if (Array.isArray(response.data)) {
        const productsWithStatus = response.data.map(product => ({
          ...product,
          status: product.status || 'Active', // Đảm bảo mỗi sản phẩm có trạng thái
          stock: product.stock || 0 // Đảm bảo mỗi sản phẩm có số lượng tồn kho
        }));
        setProducts(productsWithStatus);
        setFilteredProducts(productsWithStatus);
      } else {
        throw new Error("Dữ liệu sản phẩm không hợp lệ");
      }
    } catch (error) {
      setError(error.response?.data?.message || error.message || "Có lỗi xảy ra khi lấy dữ liệu sản phẩm");
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get unique categories for filter
  const categories = ['Tất cả', ...new Set(products.map(product => product.category))];

  // Filter products
  useEffect(() => {
    let result = [...products];
    
    // Apply search filter
    if (search) {
      result = result.filter(product => 
        product.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Apply category filter
    if (categoryFilter !== 'Tất cả') {
      result = result.filter(product => product.category === categoryFilter);
    }
    
    // Apply status filter
    if (statusFilter !== 'Tất cả') {
      result = result.filter(product => product.status === statusFilter);
    }
    
    setFilteredProducts(result);
  }, [search, categoryFilter, statusFilter, products]);

  const handleAddProduct = async () => {
    // Validation
    if (!currentProduct.name || !currentProduct.category || currentProduct.price <= 0) {
      alert("Vui lòng điền đầy đủ thông tin sản phẩm (tên, danh mục, giá)");
      return;
    }

    try {
      const productData = { ...currentProduct };
      delete productData._id; // Xóa _id khi tạo sản phẩm mới
      
      console.log("Sending data to API:", productData);
      
      // Gọi API để thêm sản phẩm
      const response = await productAPI.create(productData);
      console.log("API response:", response);
      
      if (response && response.data) {
        // Cập nhật danh sách sản phẩm
        setProducts([...products, response.data]);
        
        // Reset form
        resetForm();
        
        alert('Thêm sản phẩm thành công!');
      } else {
        throw new Error("Không nhận được phản hồi từ API");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      alert('Lỗi khi thêm sản phẩm: ' + (error.response?.data?.message || error.message || "Đã xảy ra lỗi"));
    }
  };

  const handleUpdateProduct = async () => {
    // Validation
    if (!currentProduct.name || !currentProduct.category || currentProduct.price <= 0) {
      alert("Vui lòng điền đầy đủ thông tin sản phẩm (tên, danh mục, giá)");
      return;
    }

    try {
      console.log("Updating product with ID:", currentProduct._id);
      console.log("Update data:", currentProduct);
      
      // Kiểm tra ID sản phẩm
      if (!currentProduct._id) {
        throw new Error("ID sản phẩm không hợp lệ");
      }
      
      // Gọi API để cập nhật sản phẩm
      const response = await productAPI.update(currentProduct._id, currentProduct);
      console.log("API update response:", response);
      
      if (response && response.data) {
        // Cập nhật danh sách sản phẩm
        setProducts(products.map(product => 
          product._id === currentProduct._id ? response.data : product
        ));
        
        // Reset form
        resetForm();
        
        alert('Cập nhật sản phẩm thành công!');
      } else {
        throw new Error("Không nhận được phản hồi từ API");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert('Lỗi khi cập nhật sản phẩm: ' + (error.response?.data?.message || error.message || "Đã xảy ra lỗi"));
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!id) {
      alert("ID sản phẩm không hợp lệ");
      return;
    }
    
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      try {
        console.log("Deleting product with ID:", id);
        
        // Gọi API để xóa sản phẩm
        await productAPI.delete(id);
        
        // Cập nhật danh sách sản phẩm
        setProducts(products.filter(product => product._id !== id));
        
        alert('Xóa sản phẩm thành công!');
      } catch (error) {
        console.error("Error deleting product:", error);
        alert('Lỗi khi xóa sản phẩm: ' + (error.response?.data?.message || error.message || "Đã xảy ra lỗi"));
      }
    }
  };

  const resetForm = () => {
    setCurrentProduct({
      _id: null,
      name: '',
      category: '',
      price: 0,
      image: '',
      discount: '',
      priceGoc: 0,
      stock: 0,
      status: 'Active'
    });
    setShowAddForm(false);
    setShowEditForm(false);
  };

  const editProduct = (product) => {
    setCurrentProduct({...product});
    setShowEditForm(true);
    setShowAddForm(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct({
      ...currentProduct,
      [name]: name === 'price' || name === 'priceGoc' || name === 'stock' 
        ? parseFloat(value) 
        : value
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
  };

  if (loading) {
    return (
      <div className="container my-5">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Đang tải dữ liệu sản phẩm...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger text-center" role="alert">
          <i className="fas fa-exclamation-circle me-2"></i>
          {error}
          <div className="mt-3">
            <button className="btn btn-outline-danger" onClick={fetchProducts}>
              <i className="fas fa-sync-alt me-2"></i>Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-product-management">
      <h2 className="page-title">Quản lý sản phẩm</h2>
      
      {/* Control Panel */}
      <div className="control-panel">
        <div className="search-filters">
          <input
            type="text"
            className="form-control search-input"
            placeholder="Tìm kiếm sản phẩm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          
          <select 
            className="form-select category-filter"
            value={categoryFilter} 
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          
          <select 
            className="form-select status-filter"
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="Tất cả">Tất cả trạng thái</option>
            <option value="Active">Đang bán</option>
            <option value="Inactive">Ngừng bán</option>
          </select>
        </div>
        
        <button 
          className={`btn ${showAddForm ? 'btn-secondary' : 'btn-primary'} add-product-btn`}
          onClick={() => {
            setShowAddForm(!showAddForm);
            setShowEditForm(false);
            resetForm();
          }}
        >
          <i className={`fas ${showAddForm ? 'fa-times' : 'fa-plus'} me-2`}></i>
          {showAddForm ? 'Hủy' : 'Thêm sản phẩm mới'}
        </button>
      </div>

      {/* Add Product Form */}
      {showAddForm && (
        <div className="product-form add-form">
          <div className="form-header">
            <h5>Thêm sản phẩm mới</h5>
          </div>
          <div className="form-body">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Tên sản phẩm <span className="required">*</span></label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={currentProduct.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Danh mục <span className="required">*</span></label>
                <input
                  type="text"
                  className="form-control"
                  name="category"
                  value={currentProduct.category}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Giá bán <span className="required">*</span></label>
                <input
                  type="number"
                  className="form-control"
                  name="price"
                  value={currentProduct.price}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Giá gốc</label>
                <input
                  type="number"
                  className="form-control"
                  name="priceGoc"
                  value={currentProduct.priceGoc}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Giảm giá (%)</label>
                <input
                  type="text"
                  className="form-control"
                  name="discount"
                  value={currentProduct.discount}
                  onChange={handleInputChange}
                  placeholder="Ví dụ: 10%"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Tồn kho <span className="required">*</span></label>
                <input
                  type="number"
                  className="form-control"
                  name="stock"
                  value={currentProduct.stock}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Trạng thái</label>
                <select
                  className="form-select"
                  name="status"
                  value={currentProduct.status}
                  onChange={handleInputChange}
                >
                  <option value="Active">Đang bán</option>
                  <option value="Inactive">Ngừng bán</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Link hình ảnh</label>
                <input
                  type="text"
                  className="form-control"
                  name="image"
                  value={currentProduct.image}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
            
            <div className="form-actions">
              <button
                className="btn btn-primary"
                onClick={handleAddProduct}
              >
                <i className="fas fa-save me-2"></i>
                Thêm sản phẩm
              </button>
              <button
                className="btn btn-secondary"
                onClick={resetForm}
              >
                <i className="fas fa-times me-2"></i>
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Form */}
      {showEditForm && (
        <div className="product-form edit-form">
          <div className="form-header">
            <h5>Chỉnh sửa sản phẩm</h5>
          </div>
          <div className="form-body">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Tên sản phẩm <span className="required">*</span></label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={currentProduct.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Danh mục <span className="required">*</span></label>
                <input
                  type="text"
                  className="form-control"
                  name="category"
                  value={currentProduct.category}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Giá bán <span className="required">*</span></label>
                <input
                  type="number"
                  className="form-control"
                  name="price"
                  value={currentProduct.price}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Giá gốc</label>
                <input
                  type="number"
                  className="form-control"
                  name="priceGoc"
                  value={currentProduct.priceGoc}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Giảm giá (%)</label>
                <input
                  type="text"
                  className="form-control"
                  name="discount"
                  value={currentProduct.discount}
                  onChange={handleInputChange}
                  placeholder="Ví dụ: 10%"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Tồn kho <span className="required">*</span></label>
                <input
                  type="number"
                  className="form-control"
                  name="stock"
                  value={currentProduct.stock}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Trạng thái</label>
                <select
                  className="form-select"
                  name="status"
                  value={currentProduct.status}
                  onChange={handleInputChange}
                >
                  <option value="Active">Đang bán</option>
                  <option value="Inactive">Ngừng bán</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Link hình ảnh</label>
                <input
                  type="text"
                  className="form-control"
                  name="image"
                  value={currentProduct.image}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
            
            <div className="form-actions">
              <button
                className="btn btn-info text-white"
                onClick={handleUpdateProduct}
              >
                <i className="fas fa-sync-alt me-2"></i>
                Cập nhật sản phẩm
              </button>
              <button
                className="btn btn-secondary"
                onClick={resetForm}
              >
                <i className="fas fa-times me-2"></i>
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="products-table-container">
        <table className="products-table">
          <thead>
            <tr>
              <th>Hình ảnh</th>
              <th>Tên sản phẩm</th>
              <th>Danh mục</th>
              <th>Giá bán</th>
              <th>Giá gốc</th>
              <th>Giảm giá</th>
              <th>Tồn kho</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <tr key={product._id}>
                  <td className="product-image">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      onError={(e) => {e.target.onerror = null; e.target.src = '/placeholder-image.jpg'}} 
                    />
                  </td>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td className="price">{formatPrice(product.price)}</td>
                  <td className="price">{product.priceGoc ? formatPrice(product.priceGoc) : '-'}</td>
                  <td>{product.discount || '-'}</td>
                  <td>{product.stock}</td>
                  <td>
                    <span className={`status-badge ${product.status === 'Active' ? 'active' : 'inactive'}`}>
                      {product.status === 'Active' ? 'Đang bán' : 'Ngừng bán'}
                    </span>
                  </td>
                  <td className="actions">
                    <button
                      className="btn btn-sm btn-edit"
                      onClick={() => editProduct(product)}
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      className="btn btn-sm btn-delete"
                      onClick={() => handleDeleteProduct(product._id)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="no-products">
                  <i className="fas fa-box-open"></i>
                  <p>Không tìm thấy sản phẩm nào.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="summary-footer">
        <div className="total-count">
          <strong>Tổng số sản phẩm:</strong> {products.length}
        </div>
        <div className="showing-count">
          <strong>Hiển thị:</strong> {filteredProducts.length} sản phẩm
        </div>
      </div>
    </div>
  );
};

export default AdminProductManagement;