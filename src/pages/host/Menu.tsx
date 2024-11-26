import React, { useState, ChangeEvent, FormEvent } from 'react';
import Sidebar from '../../components/Sidebar';

interface MenuItem {
  name: string;
  price: string;
  image: string | null;
}

export default function MenuPage(): JSX.Element {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddMenuItem = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const nameInput = form.elements.namedItem("name") as HTMLInputElement;
    const priceInput = form.elements.namedItem("price") as HTMLInputElement;

    const name = nameInput.value.trim();
    const price = priceInput.value.trim();
    const image = imagePreview;

    if (name && price && image) {
      setMenuItems([...menuItems, { name, price, image }]);
      form.reset();
      setImagePreview(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar type="host" />

      <main className="ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Menu Management</h1>
          <p className="text-gray-600">Add or update your restaurant menu</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Add a Menu Item</h2>
          <form onSubmit={handleAddMenuItem} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                className="mt-1 block w-full p-2 border rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Enter dish name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Price</label>
              <input
                type="text"
                name="price"
                className="mt-1 block w-full p-2 border rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Enter price"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Image</label>
              <input
                type="file"
                accept="image/*"
                className="mt-1 block w-full text-sm text-gray-900 border rounded-lg shadow-sm"
                onChange={handleFileChange}
                required
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="mt-4 max-h-40 rounded-lg shadow-md"
                />
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 text-white py-2 px-4 rounded-lg shadow-sm hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500"
            >
              Add Menu Item
            </button>
          </form>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Menu</h2>
          {menuItems.length === 0 ? (
            <p className="text-gray-600">No menu items yet. Add some dishes to display them here.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuItems.map((item, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-xl shadow-sm flex flex-col items-center"
                >
                  <img
                    src={item.image || ''}
                    alt={item.name}
                    className="mb-4 w-full max-h-40 object-cover rounded-lg shadow-md"
                  />
                  <h3 className="text-xl font-medium text-gray-900">{item.name}</h3>
                  <p className="text-gray-600">${item.price}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
