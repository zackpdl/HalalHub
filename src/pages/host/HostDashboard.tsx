import React, { useState, useEffect } from "react";
import { Users, Star, AlertCircle } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import { useNavigate } from "react-router-dom";

interface Review {
  rating: number;
  comment: string;
  customer_name: string;
  created_at: string;
}

export default function HostDashboard() {
  const navigate = useNavigate();
  const [restaurantDetails, setRestaurantDetails] = useState({
    name: "",
    location: "",
    halalCertification: "",
    certNumber: "",
    certExpiry: "",
    halalCertType: "", // Add a new field for halal_cert_type
  });
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState<number | string>(0);

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        const hostData = localStorage.getItem("hostData");
        if (!hostData) {
          navigate("/host/login");
          return;
        }

        const { id } = JSON.parse(hostData);
        const response = await fetch(
          `http://localhost:5001/api/host/restaurant-details?hostId=${id}`
        );

        const text = await response.text();
        console.log("Raw API Response:", text); // Debugging raw response

        if (response.headers.get("content-type")?.includes("application/json")) {
          const data = JSON.parse(text);
          console.log("Parsed API Response:", data); // Debugging parsed data

          if (response.ok) {
            const expiryDate = data.cert_expiry ? new Date(data.cert_expiry) : null;

            // Determine certification status
            const currentDate = new Date();
            const isCertified =
              expiryDate && expiryDate > currentDate
                ? "Certified"
                : "Not Certified";

            console.log("Fetched Certification Expiry Date:", data.cert_expiry);

            setRestaurantDetails({
              name: data.name || "Unknown",
              location: data.location || "No location set",
              halalCertification: isCertified,
              certNumber: data.halal_cert_number || "N/A",
              certExpiry: data.cert_expiry || "",
              halalCertType: data.halal_certification || "N/A", // Changed from halal_cert_type to halal_certification
            });
          } else {
            console.error("Failed to fetch restaurant details:", data.message);
          }
        } else {
          console.error("Response is not JSON:", text);
        }
      } catch (error) {
        console.error("Error fetching restaurant details:", error);
      }
    };

    const fetchReviews = async () => {
      try {
        const hostData = localStorage.getItem("hostData");
        if (!hostData) return;
        const { id } = JSON.parse(hostData);
        const response = await fetch(
          `http://localhost:5001/api/host/reviews?hostId=${id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch reviews");
        }
        const { reviews } = await response.json();
        setReviews(reviews);
        // Calculate average rating
        if (reviews.length > 0) {
          const totalRating = reviews.reduce(
            (sum: any, review: { rating: any }) => sum + review.rating,
            0
          );
          setAverageRating(Number((totalRating / reviews.length).toFixed(1)));
        } else {
          setAverageRating("N/A");
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setAverageRating("N/A");
      }
    };

    fetchRestaurantDetails();
    fetchReviews();
  }, [navigate]);

  const stats = [
    { label: "Rating", value: averageRating, icon: Star, trend: "+0.3" },
    { label: "Reviews", value: reviews.length, icon: AlertCircle, trend: "+2" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar type="host" />
      <main className="ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {restaurantDetails.name}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <stat.icon className="h-6 w-6 text-emerald-600" />
                <span
                  className={`text-sm font-medium ${
                    stat.trend && stat.trend.startsWith("+")
                      ? "text-green-600"
                      : stat.trend.startsWith("-")
                      ? "text-red-600"
                      : "text-gray-600"
                  }`}
                >
                  {stat.trend || "N/A"}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
              <p className="text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Location</h2>
            <div className="p-4 border rounded-lg">
              {restaurantDetails.location ? (
                <iframe
                  title="Restaurant Location"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(
                    restaurantDetails.location
                  )}&output=embed`}
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              ) : (
                <p className="text-gray-600">No location set.</p>
              )}
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Certification Status
            </h2>
            <div
              className={`p-4 border rounded-lg ${
                restaurantDetails.halalCertification.toLowerCase() === "certified"
                  ? "bg-emerald-50"
                  : "bg-red-50"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`font-medium ${
                    restaurantDetails.halalCertification.toLowerCase() ===
                    "certified"
                      ? "text-emerald-800"
                      : "text-red-800"
                  }`}
                >
                  {restaurantDetails.halalCertification}
                </span>
                <span
                  className={`px-3 py-1 text-sm rounded-full ${
                    restaurantDetails.halalCertification.toLowerCase() ===
                    "certified"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {restaurantDetails.halalCertification.toLowerCase() ===
                  "certified"
                    ? "Active"
                    : "Not Certified"}
                </span>
              </div>
              {restaurantDetails.halalCertification.toLowerCase() === "certified" ? (
                <>
                  <p className="text-sm text-emerald-700">
                    Certificate Type: {restaurantDetails.halalCertType} {/* Display halal_cert_type */}
                  </p>
                  <p className="text-sm text-emerald-700">
                    Certificate Number: {restaurantDetails.certNumber}
                  </p>
                  <p className="text-sm text-emerald-700">
                    Valid until:{" "}
                    {new Date(restaurantDetails.certExpiry).toLocaleDateString()}
                  </p>
                </>
              ) : (
                <p className="text-sm text-red-700">
                  Your restaurant is not certified yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}