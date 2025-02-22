import React, { useState, useEffect } from "react";
import { Menu, CheckCircle, PlusCircle, Trash2 } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import { useNavigate } from "react-router-dom";

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
}

export default function MenuPage() {
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    price: 0,
  });

  // Fetch menu items
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const hostData = localStorage.getItem("hostData");
        if (!hostData) {
          navigate("/host/login");
          return;
        }

        const parsedHostData = JSON.parse(hostData);
        const restaurantId =
          parsedHostData.restaurantId ||
          parsedHostData.restaurant_id ||
          parsedHostData.restaurant?.id;

        if (!restaurantId) {
          console.error("No restaurant ID found in host data:", parsedHostData);
          return;
        }

        const response = await fetch(
          `http://localhost:5001/api/host/menu?restaurant_id=${restaurantId}&host_id=${parsedHostData.id}`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch menu items: ${response.statusText}`);
        }

        const { menu } = await response.json();
        const formattedMenu = Array.isArray(menu)
          ? menu.map((item: MenuItem) => ({
              ...item,
              price: Number(item.price),
            }))
          : [];
        setMenuItems(formattedMenu);
      } catch (error) {
        console.error("Error fetching menu items:", error);
        setMenuItems([]);
      }
    };

    fetchMenuItems();
  }, [navigate]);

  // Add new menu item
  const handleAddItem = async () => {
    try {
      const hostData = localStorage.getItem("hostData");
      if (!hostData) return;

      const parsedData = JSON.parse(hostData);
      const response = await fetch(`http://localhost:5001/api/host/menu`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

  // Edit menu item
  const handleEditItem = async (item: MenuItem) => {
    try {
      const hostData = localStorage.getItem("hostData");
      if (!hostData) return;

      const parsedData = JSON.parse(hostData);
      const response = await fetch(`http://localhost:5001/api/host/menu?id=${item.id}&host_id=${parsedData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: item.id,
          restaurant_id: parsedData.restaurantId,
          host_id: parsedData.id,
          name: item.name,
          description: item.description,
          price: Number(item.price),
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to update menu item");
      }

      const data = await response.json();
      setMenuItems(
        menuItems.map((menuItem) =>
          menuItem.id === item.id ? { ...data.menuItem, price: Number(data.menuItem.price) } : menuItem
        )
      );
      setEditingItem(null);
    } catch (error) {
      console.error("Error updating menu item:", error);
    }
  };

  // Delete menu item
  const handleDeleteItem = async (itemId: number) => {
    try {
      const hostData = localStorage.getItem("hostData");
      if (!hostData) return;

      const parsedData = JSON.parse(hostData);
      const response = await fetch(`http://localhost:5001/api/host/menu?id=${itemId}&host_id=${parsedData.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to delete menu item");
      }

      const data = await response.json();
      setMenuItems(menuItems.filter((item) => item.id !== itemId));
      console.log("Menu item deleted successfully:", data.deletedItem);
    } catch (error) {
      console.error("Error deleting menu item:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar type="host" />
      <main className="ml-64 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Menu</h1>
        <p className="text-gray-600 mb-8">Manage your restaurant's menu here</p>

        {/* Display menu items */}
        <div className="space-y-6">
          {menuItems.map((item) => (
            <div key={item.id} className="bg-white p-6 rounded-lg shadow-sm">
              {editingItem?.id === item.id ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (editingItem) handleEditItem(editingItem);
                  }}
                >
                  <input
                    value={editingItem.name}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, name: e.target.value })
                    }
                    className="w-full text-xl font-bold mb-2 p-2 border rounded"
                    required
                  />
                  <textarea
                    value={editingItem.description}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, description: e.target.value })
                    }
                    className="w-full mb-2 p-2 border rounded"
                    required
                  />
                  <input
                    type="number"
                    value={editingItem.price}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, price: Number(e.target.value) })
                    }
                    className="w-full mb-2 p-2 border rounded"
                    required
                  />
                  <button type="submit" className="bg-emerald-600 text-white px-4 py-2 rounded">
                    Save
                  </button>
                  <button
                    onClick={() => setEditingItem(null)}
                    className="ml-2 bg-gray-300 text-gray-700 px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <>
                  <h3 className="text-xl font-bold">{item.name}</h3>
                  <p className="text-gray-600">{item.description}</p>
                  <p className="text-emerald-600 font-medium">฿{item.price.toFixed(2)}</p>
                  <div className="mt-4 space-x-4">
                    <button
                      onClick={() => setEditingItem(item)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="inline-block h-4 w-4 mr-1" /> Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Add new menu item form */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Add New Item</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddItem();
            }}
          >
            <input
              value={newItem.name}
              onChange={(e) =>
                setNewItem({ ...newItem, name: e.target.value })
              }
              placeholder="Item Name"
              className="mt-1 block w-full p-2 border rounded-lg"
              required
            />
            <textarea
              value={newItem.description}
              onChange={(e) =>
                setNewItem({ ...newItem, description: e.target.value })
              }
              placeholder="Description"
              className="mt-1 block w-full p-2 border rounded-lg"
              required
            />
            <input
              type="number"
              value={newItem.price}
              onChange={(e) =>
                setNewItem({ ...newItem, price: Number(e.target.value) })
              }
              placeholder="Price"
              className="mt-1 block w-full p-2 border rounded-lg"
              required
            />
            <button type="submit" className="mt-4 bg-emerald-600 text-white px-4 py-2 rounded">
              Add Item
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}