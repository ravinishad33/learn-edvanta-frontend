import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion"; // Added for animations
import { 
  FiPlus, FiEdit2, FiTrash2, FiSave, FiX, FiFolder, 
  FiChevronRight, FiLoader, FiSearch, FiXCircle, FiGrid
} from "react-icons/fi";

const AdminCategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("categories");
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchActive, setSearchActive] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    categoryId: "",
    isActive: true,
  });

  useEffect(() => {
    fetchCategories();
    fetchSubcategories();
  }, []);

  useEffect(() => {
    fetchSubcategories();
  }, [categories]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCategories(categories);
      setFilteredSubcategories(subcategories);
      setSearchActive(false);
    } else {
      const searchLower = searchTerm.toLowerCase();
      const categoryResults = categories.filter(cat => 
        cat.name.toLowerCase().includes(searchLower) ||
        (cat.description && cat.description.toLowerCase().includes(searchLower))
      );
      const subcategoryResults = subcategories.filter(sub => {
        const parentCategory = categories.find(c => c._id === sub.categoryId?._id);
        return (
          sub.name.toLowerCase().includes(searchLower) ||
          (parentCategory && parentCategory.name.toLowerCase().includes(searchLower))
        );
      });
      setFilteredCategories(categoryResults);
      setFilteredSubcategories(subcategoryResults);
      setSearchActive(true);
    }
  }, [searchTerm, categories, subcategories]);

  // API Methods (Kept exactly as per your logic)
  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${apiUrl}/api/category`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(response.data);
      setFilteredCategories(response.data);
    } catch (error) { toast.error("Failed to load categories"); }
    finally { setLoading(false); }
  };

  const fetchSubcategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${apiUrl}/api/subcategory`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubcategories(response?.data?.subCategories || []);
      setFilteredSubcategories(response?.data?.subCategories || []);
    } catch (error) { console.error(error); }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const resetForm = () => {
    setFormData({ name: "", description: "", categoryId: "", isActive: true });
    setEditingItem(null);
  };

  const openAddModal = (type) => {
    resetForm();
    setActiveTab(type);
    setShowModal(true);
  };

  const openEditModal = (item, type) => {
    setEditingItem(item);
    setActiveTab(type);
    setFormData({
      name: item.name,
      description: item.description || "",
      categoryId: item.categoryId?._id || item.categoryId || "",
      isActive: item.isActive !== undefined ? item.isActive : true,
    });
    setShowModal(true);
  };

  // Logic for Submit, Delete, etc. remains identical to your provided code
  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeTab === "categories") {
      editingItem ? handleUpdateCategory() : handleCreateCategory();
    } else {
      editingItem ? handleUpdateSubcategory() : handleCreateSubcategory();
    }
  };

  // CATEGORY CRUD (identical logic)
  const handleCreateCategory = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${apiUrl}/api/category`, formData, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Category created");
      setShowModal(false); fetchCategories();
    } catch (e) { toast.error("Error creating category"); }
  };

  const handleUpdateCategory = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${apiUrl}/api/category/${editingItem._id}`, formData, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Category updated");
      setShowModal(false); fetchCategories();
    } catch (e) { toast.error("Error updating category"); }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Delete category and its subcategories?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${apiUrl}/api/category/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Deleted"); fetchCategories(); fetchSubcategories();
    } catch (e) { toast.error("Delete failed"); }
  };

  // subcategory crud
  const handleCreateSubcategory = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${apiUrl}/api/subcategory`, formData, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Subcategory created");
      setShowModal(false); fetchSubcategories();
    } catch (e) { toast.error("Error creating subcategory"); }
  };

  const handleUpdateSubcategory = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${apiUrl}/api/subcategory/${editingItem._id}`, formData, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Subcategory updated");
      setShowModal(false); fetchSubcategories();
    } catch (e) { toast.error("Error updating subcategory"); }
  };

  const handleDeleteSubcategory = async (id) => {
    if (!window.confirm("Delete subcategory?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${apiUrl}/api/subcategory/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Deleted"); fetchSubcategories();
    } catch (e) { toast.error("Delete failed"); }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        >
          <FiLoader className="w-12 h-12 text-blue-600" />
        </motion.div>
        <p className="mt-4 text-gray-500 font-medium animate-pulse">Loading Management Console...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-sans">
      <Toaster position="top-right" reverseOrder={false} />
      
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6"
        >
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
             Category Management
            </h1>
            <p className="text-slate-500 mt-1">Manage your course categories and sub-structures</p>
          </div>
          
          <div className="flex flex-wrap w-full lg:w-auto gap-3">
            <div className="relative flex-1 md:min-w-[320px]">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search anything..."
                className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <FiXCircle className="text-slate-400 hover:text-red-500 transition-colors" />
                </button>
              )}
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => openAddModal("categories")}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl shadow-blue-200 shadow-lg hover:bg-blue-700 transition-all font-semibold"
            >
              <FiPlus /> Category
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => openAddModal("subcategories")}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl shadow-emerald-200 shadow-lg hover:bg-emerald-700 transition-all font-semibold"
            >
              <FiPlus /> Subcategory
            </motion.button>
          </div>
        </motion.div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Categories Column */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <FiGrid className="text-blue-600" /> Main Categories
              </h2>
              <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full">
                {filteredCategories.length} total
              </span>
            </div>

            <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-300px)] pr-2 custom-scrollbar">
              <AnimatePresence mode="popLayout">
                {filteredCategories.map((category) => (
                  <motion.div
                    layout
                    key={category._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md border-l-4 border-l-blue-500 transition-all group"
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors">{category.name}</h3>
                          {!category.isActive && <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">Hidden</span>}
                        </div>
                        <p className="text-sm text-slate-500 line-clamp-2">{category.description || "No description provided."}</p>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEditModal(category, "categories")} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><FiEdit2 size={18}/></button>
                        <button onClick={() => handleDeleteCategory(category._id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><FiTrash2 size={18}/></button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Subcategories Column */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <FiFolder className="text-emerald-600" /> Subcategories
              </h2>
              <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full">
                {filteredSubcategories.length} total
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-auto max-h-[calc(100vh-300px)] pr-2 custom-scrollbar">
              <AnimatePresence mode="popLayout">
                {filteredSubcategories.map((sub) => {
                  const parent = categories.find(c => c._id === (sub.categoryId?._id || sub.categoryId));
                  return (
                    <motion.div
                      layout
                      key={sub._id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all group border-b-4 border-b-emerald-500"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md truncate max-w-[120px]">
                          {parent?.name || "Global"}
                        </span>
                        <div className="flex gap-1">
                          <button onClick={() => openEditModal(sub, "subcategories")} className="text-slate-400 hover:text-blue-600 transition-colors"><FiEdit2 size={14}/></button>
                          <button onClick={() => handleDeleteSubcategory(sub._id)} className="text-slate-400 hover:text-red-600 transition-colors"><FiTrash2 size={14}/></button>
                        </div>
                      </div>
                      <h3 className="font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">{sub.name}</h3>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <FiChevronRight /> {sub.courseCount || 0} Courses
                        </span>
                        {!sub.isActive && <div className="w-2 h-2 rounded-full bg-slate-300"></div>}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

        </div>

        {/* Improved Modal */}
        <AnimatePresence>
          {showModal && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowModal(false)}
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative z-10"
              >
                <div className={`h-2 w-full ${activeTab === 'categories' ? 'bg-blue-600' : 'bg-emerald-600'}`} />
                <div className="p-8">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-black text-slate-800">
                      {editingItem ? "Update" : "New"} {activeTab === "categories" ? "Category" : "Subcategory"}
                    </h2>
                    <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><FiX /></button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Title</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all text-slate-800"
                        placeholder="e.g. Graphic Design"
                        required
                      />
                    </div>

                    {activeTab === "categories" ? (
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Description</label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          rows="3"
                          className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all text-slate-800"
                          placeholder="What is this category about?"
                        />
                      </div>
                    ) : (
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Parent Category</label>
                        <select
                          name="categoryId"
                          value={formData.categoryId}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all text-slate-800 appearance-none"
                          required
                        >
                          <option value="">Choose parent...</option>
                          {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                        </select>
                      </div>
                    )}

                    <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleInputChange}
                        className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm font-semibold text-slate-700">Make visible to public</span>
                    </label>

                    <div className="flex gap-3 mt-8">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className={`flex-1 py-3 text-white rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2 ${activeTab === 'categories' ? 'bg-blue-600 shadow-blue-200' : 'bg-emerald-600 shadow-emerald-200'}`}
                      >
                        <FiSave /> {editingItem ? "Save Changes" : "Create Now"}
                      </motion.button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminCategoryManagement;