import type {
  Province,
  City,
  District,
  Village,
  RegisterRequest,
} from "@/types/auth";

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Phone,
  Lock,
  AlertCircle,
  UserPlus,
  User,
  Mail,
  Calendar,
  MapPin,
  CreditCard,
  ChevronDown,
} from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import {
  fetchProvinces,
  fetchCities,
  fetchDistricts,
  fetchVillages,
} from "@/services/location";
import Layout from "@/components/Layout";

export default function Register() {
  const [formData, setFormData] = useState<Omit<RegisterRequest, "password">>({
    phone: "",
    nik: "",
    nama: "",
    tanggal_lahir: "",
    tempat_lahir: "",
    jenis_kelamin: "L",
    email: "",
    is_dev_account: 0,
    id_provinsi: "",
    id_kota: "",
    id_kecamatan: "",
    id_kelurahan: "",
    provinsi: "",
    kota: "",
    kecamatan: "",
    kelurahan: "",
  });

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Location states
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [villages, setVillages] = useState<Village[]>([]);
  const [loadingLocations, setLoadingLocations] = useState({
    provinces: false,
    cities: false,
    districts: false,
    villages: false,
  });

  const { register, registerWithEmail, registerWithPassword, login } =
    useAuth();
  const navigate = useNavigate();

  // Load provinces on component mount
  useEffect(() => {
    const loadProvinces = async () => {
      setLoadingLocations((prev) => ({ ...prev, provinces: true }));
      try {
        const data = await fetchProvinces();

        setProvinces(data);
      } catch (error) {
        console.error("Error loading provinces:", error);
      } finally {
        setLoadingLocations((prev) => ({ ...prev, provinces: false }));
      }
    };

    loadProvinces();
  }, []);

  // Load cities when province changes
  useEffect(() => {
    const loadCities = async () => {
      if (!formData.id_provinsi) {
        setCities([]);
        setDistricts([]);
        setVillages([]);

        return;
      }

      setLoadingLocations((prev) => ({ ...prev, cities: true }));
      try {
        const data = await fetchCities(formData.id_provinsi);

        setCities(data);
        setDistricts([]);
        setVillages([]);

        // Reset dependent fields
        setFormData((prev) => ({
          ...prev,
          id_kota: "",
          id_kecamatan: "",
          id_kelurahan: "",
          kota: "",
          kecamatan: "",
          kelurahan: "",
        }));
      } catch (error) {
        console.error("Error loading cities:", error);
      } finally {
        setLoadingLocations((prev) => ({ ...prev, cities: false }));
      }
    };

    loadCities();
  }, [formData.id_provinsi]);

  // Load districts when city changes
  useEffect(() => {
    const loadDistricts = async () => {
      if (!formData.id_kota) {
        setDistricts([]);
        setVillages([]);

        return;
      }

      setLoadingLocations((prev) => ({ ...prev, districts: true }));
      try {
        const data = await fetchDistricts(formData.id_kota);

        setDistricts(data);
        setVillages([]);

        // Reset dependent fields
        setFormData((prev) => ({
          ...prev,
          id_kecamatan: "",
          id_kelurahan: "",
          kecamatan: "",
          kelurahan: "",
        }));
      } catch (error) {
        console.error("Error loading districts:", error);
      } finally {
        setLoadingLocations((prev) => ({ ...prev, districts: false }));
      }
    };

    loadDistricts();
  }, [formData.id_kota]);

  // Load villages when district changes
  useEffect(() => {
    const loadVillages = async () => {
      if (!formData.id_kecamatan) {
        setVillages([]);

        return;
      }

      setLoadingLocations((prev) => ({ ...prev, villages: true }));
      try {
        const data = await fetchVillages(formData.id_kecamatan);

        setVillages(data);

        // Reset dependent fields
        setFormData((prev) => ({
          ...prev,
          id_kelurahan: "",
          kelurahan: "",
        }));
      } catch (error) {
        console.error("Error loading villages:", error);
      } finally {
        setLoadingLocations((prev) => ({ ...prev, villages: false }));
      }
    };

    loadVillages();
  }, [formData.id_kecamatan]);

  const handleInputChange = (field: keyof RegisterRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLocationChange = (
    field: keyof RegisterRequest,
    value: string,
    nameField: keyof RegisterRequest,
    selectedItem: Province | City | District | Village,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      [nameField]: selectedItem.name,
    }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow digits
    const value = e.target.value.replace(/\D/g, "");

    handleInputChange("phone", value);
  };

  const validateForm = () => {
    if (!formData.phone?.trim()) return "Phone number is required";
    if (!password?.trim()) return "Password is required";
    if (password !== confirmPassword) return "Passwords do not match";
    if (!formData.nik?.trim()) return "NIK is required";
    if (formData.nik.length !== 16) return "NIK must be 16 digits";
    if (!formData.nama?.trim()) return "Full name is required";
    if (!formData.tanggal_lahir?.trim()) return "Date of birth is required";
    if (!formData.tempat_lahir?.trim()) return "Place of birth is required";
    if (!formData.email?.trim()) return "Email is required";
    if (!formData.id_provinsi?.trim()) return "Province is required";
    if (!formData.id_kota?.trim()) return "City is required";
    if (!formData.id_kecamatan?.trim()) return "District is required";
    if (!formData.id_kelurahan?.trim()) return "Village is required";

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);

      return;
    }

    setIsLoading(true);
    try {
      // Step 1: Register with email (exclude password from the payload)
      const emailRegistrationData = {
        phone: formData.phone,
        nik: formData.nik,
        nama: formData.nama,
        tanggal_lahir: formData.tanggal_lahir,
        tempat_lahir: formData.tempat_lahir,
        jenis_kelamin: formData.jenis_kelamin,
        email: formData.email,
        is_dev_account: formData.is_dev_account,
        id_provinsi: formData.id_provinsi,
        id_kota: formData.id_kota,
        id_kecamatan: formData.id_kecamatan,
        id_kelurahan: formData.id_kelurahan,
        provinsi: formData.provinsi,
        kota: formData.kota,
        kecamatan: formData.kecamatan,
        kelurahan: formData.kelurahan,
      };

      const emailResponse = await registerWithEmail(emailRegistrationData);

      // Step 2: Register with password using the session_id
      const passwordRegistrationData = {
        session_id: emailResponse.result.session_id,
        password: password,
      };

      await registerWithPassword(passwordRegistrationData);

      // Step 3: Login the user after successful registration
      await login(formData.phone, password);

      navigate("/", { replace: true });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout hideFooter>
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="max-w-2xl w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-secondary-900 mb-2">
              Create your account
            </h2>
            <p className="text-secondary-600">
              Join and get access to all features
            </p>
          </div>

          {/* Registration Form */}
          <div className="bg-white rounded-xl shadow-soft p-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-danger-50 border border-danger-200 rounded-lg p-4 flex items-start space-x-3">
                  <AlertCircle
                    className="text-danger-500 flex-shrink-0 mt-0.5"
                    size={20}
                  />
                  <div>
                    <h4 className="text-danger-800 font-medium">
                      Registration failed
                    </h4>
                    <p className="text-danger-700 text-sm mt-1">{error}</p>
                  </div>
                </div>
              )}

              {/* Personal Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-secondary-900 border-b border-secondary-200 pb-2">
                  Personal Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <label
                      className="block text-sm font-medium text-secondary-700 mb-2"
                      htmlFor="nama"
                    >
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="text-secondary-400" size={20} />
                      </div>
                      <input
                        required
                        autoComplete="name"
                        className="block w-full pl-10 pr-3 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                        id="nama"
                        placeholder="Enter your full name"
                        type="text"
                        value={formData.nama || ""}
                        onChange={(e) =>
                          handleInputChange("nama", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  {/* NIK */}
                  <div>
                    <label
                      className="block text-sm font-medium text-secondary-700 mb-2"
                      htmlFor="nik"
                    >
                      NIK (ID Number)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <CreditCard className="text-secondary-400" size={20} />
                      </div>
                      <input
                        required
                        className="block w-full pl-10 pr-3 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                        id="nik"
                        maxLength={16}
                        placeholder="16-digit ID number"
                        type="text"
                        value={formData.nik || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "nik",
                            e.target.value.replace(/\D/g, ""),
                          )
                        }
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      className="block text-sm font-medium text-secondary-700 mb-2"
                      htmlFor="email"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="text-secondary-400" size={20} />
                      </div>
                      <input
                        required
                        autoComplete="email"
                        className="block w-full pl-10 pr-3 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                        id="email"
                        placeholder="Enter your email"
                        type="email"
                        value={formData.email || ""}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label
                      className="block text-sm font-medium text-secondary-700 mb-2"
                      htmlFor="phone"
                    >
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="text-secondary-400" size={20} />
                      </div>
                      <input
                        required
                        autoComplete="tel"
                        className="block w-full pl-10 pr-3 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                        id="phone"
                        placeholder="089503386642"
                        type="tel"
                        value={formData.phone || ""}
                        onChange={handlePhoneChange}
                      />
                    </div>
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label
                      className="block text-sm font-medium text-secondary-700 mb-2"
                      htmlFor="tanggal_lahir"
                    >
                      Date of Birth
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="text-secondary-400" size={20} />
                      </div>
                      <input
                        required
                        className="block w-full pl-10 pr-3 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                        id="tanggal_lahir"
                        type="date"
                        value={formData.tanggal_lahir || ""}
                        onChange={(e) =>
                          handleInputChange("tanggal_lahir", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  {/* Place of Birth */}
                  <div>
                    <label
                      className="block text-sm font-medium text-secondary-700 mb-2"
                      htmlFor="tempat_lahir"
                    >
                      Place of Birth
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="text-secondary-400" size={20} />
                      </div>
                      <input
                        required
                        className="block w-full pl-10 pr-3 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                        id="tempat_lahir"
                        placeholder="Enter place of birth"
                        type="text"
                        value={formData.tempat_lahir || ""}
                        onChange={(e) =>
                          handleInputChange("tempat_lahir", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  {/* Gender */}
                  <div>
                    <label
                      className="block text-sm font-medium text-secondary-700 mb-2"
                      htmlFor="jenis_kelamin"
                    >
                      Gender
                    </label>
                    <div className="relative">
                      <select
                        required
                        className="block w-full px-3 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors appearance-none bg-white"
                        id="jenis_kelamin"
                        value={formData.jenis_kelamin || "L"}
                        onChange={(e) =>
                          handleInputChange("jenis_kelamin", e.target.value)
                        }
                      >
                        <option value="L">Male</option>
                        <option value="P">Female</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <ChevronDown className="text-secondary-400" size={20} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-secondary-900 border-b border-secondary-200 pb-2">
                  Location Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Province */}
                  <div>
                    <label
                      className="block text-sm font-medium text-secondary-700 mb-2"
                      htmlFor="id_provinsi"
                    >
                      Province
                    </label>
                    <div className="relative">
                      <select
                        required
                        className="block w-full px-3 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors appearance-none bg-white"
                        disabled={loadingLocations.provinces}
                        id="id_provinsi"
                        value={formData.id_provinsi || ""}
                        onChange={(e) => {
                          const selectedProvince = provinces.find(
                            (p) => p.id === e.target.value,
                          );

                          if (selectedProvince) {
                            handleLocationChange(
                              "id_provinsi",
                              e.target.value,
                              "provinsi",
                              selectedProvince,
                            );
                          }
                        }}
                      >
                        <option value="">
                          {loadingLocations.provinces
                            ? "Loading..."
                            : "Select Province"}
                        </option>
                        {provinces.map((province) => (
                          <option key={province.id} value={province.id}>
                            {province.name}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <ChevronDown className="text-secondary-400" size={20} />
                      </div>
                    </div>
                  </div>

                  {/* City */}
                  <div>
                    <label
                      className="block text-sm font-medium text-secondary-700 mb-2"
                      htmlFor="id_kota"
                    >
                      City/Regency
                    </label>
                    <div className="relative">
                      <select
                        required
                        className="block w-full px-3 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors appearance-none bg-white disabled:bg-secondary-50"
                        disabled={
                          !formData.id_provinsi || loadingLocations.cities
                        }
                        id="id_kota"
                        value={formData.id_kota || ""}
                        onChange={(e) => {
                          const selectedCity = cities.find(
                            (c) => c.id === e.target.value,
                          );

                          if (selectedCity) {
                            handleLocationChange(
                              "id_kota",
                              e.target.value,
                              "kota",
                              selectedCity,
                            );
                          }
                        }}
                      >
                        <option value="">
                          {loadingLocations.cities
                            ? "Loading..."
                            : "Select City"}
                        </option>
                        {cities.map((city) => (
                          <option key={city.id} value={city.id}>
                            {city.name}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <ChevronDown className="text-secondary-400" size={20} />
                      </div>
                    </div>
                  </div>

                  {/* District */}
                  <div>
                    <label
                      className="block text-sm font-medium text-secondary-700 mb-2"
                      htmlFor="id_kecamatan"
                    >
                      District
                    </label>
                    <div className="relative">
                      <select
                        required
                        className="block w-full px-3 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors appearance-none bg-white disabled:bg-secondary-50"
                        disabled={
                          !formData.id_kota || loadingLocations.districts
                        }
                        id="id_kecamatan"
                        value={formData.id_kecamatan || ""}
                        onChange={(e) => {
                          const selectedDistrict = districts.find(
                            (d) => d.id === e.target.value,
                          );

                          if (selectedDistrict) {
                            handleLocationChange(
                              "id_kecamatan",
                              e.target.value,
                              "kecamatan",
                              selectedDistrict,
                            );
                          }
                        }}
                      >
                        <option value="">
                          {loadingLocations.districts
                            ? "Loading..."
                            : "Select District"}
                        </option>
                        {districts.map((district) => (
                          <option key={district.id} value={district.id}>
                            {district.name}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <ChevronDown className="text-secondary-400" size={20} />
                      </div>
                    </div>
                  </div>

                  {/* Village */}
                  <div>
                    <label
                      className="block text-sm font-medium text-secondary-700 mb-2"
                      htmlFor="id_kelurahan"
                    >
                      Village
                    </label>
                    <div className="relative">
                      <select
                        required
                        className="block w-full px-3 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors appearance-none bg-white disabled:bg-secondary-50"
                        disabled={
                          !formData.id_kecamatan || loadingLocations.villages
                        }
                        id="id_kelurahan"
                        value={formData.id_kelurahan || ""}
                        onChange={(e) => {
                          const selectedVillage = villages.find(
                            (v) => v.id === e.target.value,
                          );

                          if (selectedVillage) {
                            handleLocationChange(
                              "id_kelurahan",
                              e.target.value,
                              "kelurahan",
                              selectedVillage,
                            );
                          }
                        }}
                      >
                        <option value="">
                          {loadingLocations.villages
                            ? "Loading..."
                            : "Select Village"}
                        </option>
                        {villages.map((village) => (
                          <option key={village.id} value={village.id}>
                            {village.name}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <ChevronDown className="text-secondary-400" size={20} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Security */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-secondary-900 border-b border-secondary-200 pb-2">
                  Account Security
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Password */}
                  <div>
                    <label
                      className="block text-sm font-medium text-secondary-700 mb-2"
                      htmlFor="password"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="text-secondary-400" size={20} />
                      </div>
                      <input
                        required
                        autoComplete="new-password"
                        className="block w-full pl-10 pr-12 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                        id="password"
                        minLength={6}
                        placeholder="Enter your password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-secondary-400 hover:text-secondary-600 transition-colors"
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label
                      className="block text-sm font-medium text-secondary-700 mb-2"
                      htmlFor="confirmPassword"
                    >
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="text-secondary-400" size={20} />
                      </div>
                      <input
                        required
                        autoComplete="new-password"
                        className="block w-full pl-10 pr-12 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                        id="confirmPassword"
                        placeholder="Confirm your password"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      <button
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-secondary-400 hover:text-secondary-600 transition-colors"
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                disabled={isLoading}
                type="submit"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Creating account...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2" size={16} />
                    Create Account
                  </>
                )}
              </button>
            </form>

            {/* Additional Links */}
            <div className="mt-6 text-center">
              <p className="text-sm text-secondary-600">
                Already have an account?{" "}
                <Link
                  className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
                  to="/login"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          {/* Back to Home */}
          <div className="text-center">
            <Link
              className="inline-flex items-center text-sm text-secondary-600 hover:text-secondary-900 transition-colors"
              to="/"
            >
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
