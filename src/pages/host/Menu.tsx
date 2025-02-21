import React, { useState, useEffect } from "react";
import { Menu, CheckCircle, PlusCircle } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import { useNavigate } from "react-router-dom";

interface MenuItem {
  name: string;
  description: string;
  price: number;
}

// Add new interface and state
interface MenuItemWithId extends MenuItem {
  id: number;
}

// Remove the duplicate form section (lines ~177-220) and keep only the form inside the menu items mapping
export default function MenuPage() {
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState<MenuItemWithId[]>([]);
  const [editingItem, setEditingItem] = useState<MenuItemWithId | null>(null);
  const [newItem, setNewItem] = useState<MenuItem>({
    name: "",
    description: "",
    price: 0,
  });

  useEffect(() => {
    // Check authentication first
    const hostData = localStorage.getItem("hostData");
    if (!hostData) {
      navigate("/host/login");
      return;
    }
  
    const parsedHostData = JSON.parse(hostData);
    console.log("Parsed host data:", parsedHostData); // Debug log
  
    // Try different ways to get restaurant ID
    const restaurantId = 
      parsedHostData.restaurantId || 
      parsedHostData.restaurant_id || 
      parsedHostData.restaurant?.id;
  
    if (!restaurantId) {
      console.error("No restaurant ID found in host data:", parsedHostData);
      return;
    }
  
    // Fetch menu items
    const fetchMenuItems = async () => {
      try {
        console.log("Fetching menu for restaurant:", restaurantId);
        
        const response = await fetch(
          `http://localhost:5001/api/host/menu?restaurant_id=${restaurantId}&host_id=${parsedHostData.id}`
        );
  
        if (response.status === 404) {
          console.log("No menu items found for restaurant:", restaurantId);
          setMenuItems([]);
          return;
        }
  
        if (!response.ok) {
          throw new Error(`Failed to fetch menu items: ${response.statusText}`);
        }
  
        // In the fetch section
        const { menu } = await response.json();
        console.log("Received menu data:", menu);
        // Convert price to number if it's a string
        const formattedMenu = Array.isArray(menu) ? menu.map(item => ({
          ...item,
          price: Number(item.price)
        })) : [];
        setMenuItems(formattedMenu);
      } catch (error) {
        console.error("Error fetching menu items:", error);
        setMenuItems([]);
      }
    };
  
    fetchMenuItems();
  }, [navigate]);

  // Remove the duplicate localStorage check here
  // Add a new menu item
  // Also update handleAddItem to handle the response correctly
  // Update handleAddItem
  const handleAddItem = async () => {
    try {
      const hostData = localStorage.getItem("hostData");
      if (!hostData) return;
  
      const parsedData = JSON.parse(hostData);
      const response = await fetch(`http://localhost:5001/api/host/menu`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          host_id: parsedData.id,
          restaurant_id: parsedData.restaurantId,
          name: newItem.name,
          description: newItem.description,
          price: Number(newItem.price),
        }),
      });
  
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to add menu item");
      }
  
      setMenuItems([...menuItems, { ...data.menuItem, price: Number(data.menuItem.price) }]);
      setNewItem({ name: "", description: "", price: 0 });
    } catch (error) {
      console.error("Error adding new menu item:", error);
    }
  };

  // Add handleEditItem function
  // Update the handleEditItem function to use query parameters instead of URL params
const handleEditItem = async (item: MenuItemWithId) => {
  try {
    const hostData = localStorage.getItem("hostData");
    if (!hostData) return;

    const parsedData = JSON.parse(hostData);

    // Ensure all required fields are included in the request body
    const response = await fetch(
      `http://localhost:5001/api/host/menu?id=${item.id}&host_id=${parsedData.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: item.id, // Include the menu item ID
          restaurant_id: parsedData.restaurantId, // Include the restaurant ID
          host_id: parsedData.id, // Include the host ID
          name: item.name,
          description: item.description,
          price: Number(item.price),
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Failed to update menu item");
    }

    const data = await response.json();
    setMenuItems(
      menuItems.map((menuItem) =>
        menuItem.id === item.id
          ? { ...data.menuItem, price: Number(data.menuItem.price) }
          : menuItem
      )
    );
    setEditingItem(null);
  } catch (error) {
    console.error("Error updating menu item:", error);
  }
};
  // Update the edit form inputs to handle undefined values
  <form onSubmit={(e) => {
    e.preventDefault();
    if (editingItem) handleEditItem(editingItem);
  }}>
    <input
      type="text"
      value={editingItem?.name || ""}
      onChange={(e) => editingItem && setEditingItem({ ...editingItem, name: e.target.value })}
      className="w-full text-xl font-bold mb-2 p-2 border rounded"
      required
    />
    <textarea
      value={editingItem?.description || ""}
      onChange={(e) => editingItem && setEditingItem({ ...editingItem, description: e.target.value })}
      className="w-full mb-2 p-2 border rounded"
      required
    />
    <input
      type="number"
      value={editingItem?.price || 0}
      onChange={(e) => editingItem && setEditingItem({ ...editingItem, price: Number(e.target.value) })}
      className="w-full mb-2 p-2 border rounded"
      required
    />

    <div className="flex gap-2">
      <button type="submit" className="bg-emerald-600 text-white px-4 py-2 rounded">
        Save
      </button>
      <button 
        type="button" 
        onClick={() => setEditingItem(null)}
        className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
      >
        Cancel
      </button>
    </div>
  </form>

  // Update the menu items render section
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar type="host" />

      <main className="ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Menu</h1>
          <p className="text-gray-600">Manage your restaurant's menu here</p>
        </div>

        // In the render section
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {menuItems.map((item) => (
            <div key={item.id} className="bg-white p-6 rounded-xl shadow-sm">
              {editingItem?.id === item.id ? (
                <form onSubmit={(e) => {
                  e.preventDefault();
                  handleEditItem(editingItem);
                }}>
                  <input
                    type="text"
                    value={editingItem.name}
                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                    className="w-full text-xl font-bold mb-2 p-2 border rounded"
                    required
                  />
                  <textarea
                    value={editingItem.description}
                    onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                    className="w-full mb-2 p-2 border rounded"
                    required
                  />
                  <input
                    type="number"
                    value={editingItem.price}
                    onChange={(e) => setEditingItem({ ...editingItem, price: Number(e.target.value) })}
                    className="w-full mb-2 p-2 border rounded"
                    required
                  />
                  <div className="flex gap-2">
                    <button type="submit" className="bg-emerald-600 text-white px-4 py-2 rounded">
                      Save
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setEditingItem(null)}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
                  <p className="text-gray-600">{item.description}</p>
                  <p className="text-gray-800 font-semibold">
                    ${item.price.toFixed(2)}
                  </p>
                  <button
                    onClick={() => setEditingItem(item)}
                    className="mt-4 text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                </>
              )}
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Add New Item</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddItem();
            }}
          >
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700">Item Name</label>
              <input
                type="text"
                id="name"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                className="mt-1 block w-full p-2 border rounded-lg"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="description" className="block text-gray-700">Description</label>
              <textarea
                id="description"
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                className="mt-1 block w-full p-2 border rounded-lg"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="price" className="block text-gray-700">Price</label>
              <input
                type="number"
                id="price"
                value={newItem.price}
                onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })}
                className="mt-1 block w-full p-2 border rounded-lg"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg mt-4"
            >
              <PlusCircle className="inline-block mr-2" /> Add Item
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}