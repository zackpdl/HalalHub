-- ==============================================
-- Group 5: SQL Commands for HalalHub API Backend
-- ==============================================

-- ====================
-- 1. Health Check Query
-- ====================
-- This query checks if the database connection is healthy by executing a simple SELECT statement.
SELECT 1;

-- ====================
-- 2. Fetch All Restaurants
-- ====================
-- This query retrieves all restaurants from the `restaurants` table.
-- Used in the `/api/restaurants` endpoint to display a list of restaurants.
SELECT * FROM restaurants;

-- ====================
-- 3. Fetch Specific Restaurant Details
-- ====================
-- This query retrieves details of a specific restaurant based on its ID.
-- Used in the `/api/restaurants/:id` endpoint to display detailed information about a restaurant.
SELECT * FROM restaurants WHERE id = $1;

-- ====================
-- 4. User Signup
-- ====================
-- This query inserts a new user into the `users` table during the signup process.
-- Used in the `/api/auth/signup` endpoint to register a new user.
INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *;

-- ====================
-- 5. User Signin
-- ====================
-- This query retrieves a user's details from the `users` table during the signin process.
-- Used in the `/api/auth/signin` endpoint to authenticate a user.
SELECT * FROM users WHERE email = $1;

-- ====================
-- 6. Host Signin with Restaurant Information
-- ====================
-- This query retrieves host details along with associated restaurant information.
-- Used in the `/api/host/signin` endpoint to authenticate a host and fetch their restaurant data.
SELECT h.*, r.id AS restaurant_id, r.restaurant_name, r.address, r.city,
       r.cuisine, r.opening_hours, r.closing_hours, r.halal_cert_type,
       r.halal_cert_number, r.halal_cert_expiry
FROM hosts h
LEFT JOIN restaurants r ON r.host_id = h.id
WHERE h.email = $1;

-- ====================
-- 7. Host and Restaurant Registration
-- ====================
-- These queries are used to register a new host and create an associated restaurant.
-- Used in the `/api/host/register` endpoint to handle host and restaurant registration.

-- Step 1: Insert into the `hosts` table to create a new host.
INSERT INTO hosts (email, password, phone) VALUES ($1, $2, $3) RETURNING id;

-- Step 2: Insert into the `restaurants` table to create a new restaurant associated with the host.
INSERT INTO restaurants (
    restaurant_name, address, city, cuisine, opening_hours, closing_hours,
    halal_cert_type, halal_cert_number, halal_cert_expiry, host_id
) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id;

-- ====================
-- 8. Fetch Restaurant Details for Host
-- ====================
-- This query retrieves detailed information about a restaurant associated with a host.
-- Used in the `/api/host/restaurant-details` endpoint to display restaurant details.
SELECT 
    restaurant_name, address, city, halal_cert_type, halal_cert_number, halal_cert_expiry
FROM restaurants
WHERE host_id = $1;

-- ====================
-- 9. Fetch Reviews for a Restaurant
-- ====================
-- This query retrieves reviews for a restaurant based on the host ID.
-- Used in the `/api/host/reviews` endpoint to display reviews for a host's restaurant.
SELECT r.*
FROM reviews r
JOIN restaurants rest ON r.restaurant_id = rest.id
WHERE rest.host_id = $1;

-- ====================
-- 10. Fetch Menu for a Specific Restaurant
-- ====================
-- This query retrieves the menu items for a specific restaurant based on its ID.
-- Used in the `/api/host/menu` endpoint to display the menu for a restaurant.
SELECT * FROM menus WHERE restaurant_id = $1;

-- ====================
-- 11. Update Menu Item
-- ====================
-- This query updates an existing menu item for a restaurant.
-- Used in the `/api/host/menu` PUT endpoint to modify a menu item.
UPDATE menus
SET name = $1, description = $2, price = $3, updated_at = NOW()
WHERE id = $4 AND restaurant_id = $5
RETURNING *;

-- ====================
-- 12. Add New Menu Item
-- ====================
-- This query inserts a new menu item for a restaurant.
-- Used in the `/api/host/menu` POST endpoint to add a new menu item.
INSERT INTO menus (
    restaurant_id, name, description, price, created_at, updated_at
) VALUES ($1, $2, $3, $4::numeric, NOW(), NOW())
RETURNING *;